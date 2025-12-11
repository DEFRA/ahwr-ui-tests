#!/bin/bash

set -eo pipefail

TEST_COMMAND="$1"
CLAIM_COMPLIANCE_CHECK_RATIO="$2"

if [ -z "$TEST_COMMAND" ]; then
  echo "❌ Error: No test command provided. Usage: ./run-tests.sh <mainSuite|comp|compFA>"
  exit 1
fi

if [[ "$TEST_COMMAND" == "mainSuite" ]]; then
  echo "No environment overrides required for test command mainSuite"
elif [[ "$TEST_COMMAND" == "comp" ]]; then
  echo "No environment overrides required for test command comp"
elif [[ "$TEST_COMMAND" == "compFA" ]]; then
  FEATURE_ASSURANCE_ENABLED="true"
else
  echo "❌ Invalid TEST_COMMAND: $TEST_COMMAND (expected 'mainSuite' or 'comp' or 'compFA')"
  exit 1
fi

ENV_FILE=".env"

# Resolve Docker host IP (only needed for Linux/Jenkins)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  HOST_INTERNAL_IP=$(ip -4 addr show docker0 | awk '/inet / {print $2}' | cut -d/ -f1)
  if [ -z "$HOST_INTERNAL_IP" ]; then
    echo "❌ Could not resolve Docker bridge IP. Are you running inside Jenkins/Docker?"
    exit 1
  fi
  echo "🔌 Using host IP for host.docker.internal: $HOST_INTERNAL_IP"
else
  echo "🖥️  Detected non-Linux OS ($OSTYPE) — skipping IP mapping, Docker handles host.docker.internal on Mac/Windows"
  HOST_INTERNAL_IP="host-gateway"
fi


if [ ! -f "$ENV_FILE" ]; then
  echo "No .env file found... assuming this is running on pipeline and required values are injected"
else
  MESSAGE_QUEUE_HOST=$(grep -E '^MESSAGE_QUEUE_HOST=' "$ENV_FILE" | cut -d '=' -f2-)
  EVENT_QUEUE_ADDRESS=$(grep -E '^EVENT_QUEUE_ADDRESS=' "$ENV_FILE" | cut -d '=' -f2-)
  MESSAGE_QUEUE_USER=$(grep -E '^MESSAGE_QUEUE_USER=' "$ENV_FILE" | cut -d '=' -f2-)
  FCP_AHWR_EVENT_QUEUE_SA_KEY=$(grep -E '^FCP_AHWR_EVENT_QUEUE_SA_KEY=' "$ENV_FILE" | cut -d '=' -f2-)
  USE_INSTANCES=$(grep -E '^USE_INSTANCES=' "$ENV_FILE" | cut -d '=' -f2-)
  AADAR_AUTHORITY_URL=$(grep -E '^AADAR_AUTHORITY_URL=' "$ENV_FILE" | cut -d '=' -f2-)
  AADAR_CLIENT_SECRET=$(grep -E '^AADAR_CLIENT_SECRET=' "$ENV_FILE" | cut -d '=' -f2-)
  AADAR_CLIENT_ID=$(grep -E '^AADAR_CLIENT_ID=' "$ENV_FILE" | cut -d '=' -f2-)
fi

REQUIRED_VARS=(
  MESSAGE_QUEUE_HOST
  EVENT_QUEUE_ADDRESS
  MESSAGE_QUEUE_USER
  FCP_AHWR_EVENT_QUEUE_SA_KEY
  AADAR_AUTHORITY_URL
  AADAR_CLIENT_SECRET
  AADAR_CLIENT_ID
)

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "❌ Error: Required env var '$VAR' is missing"
    exit 1
  fi
done

if [[ "$CLEANUP_FIRST" == "true" ]]; then
  echo "🧹 Cleaning up previous outputs..."
  ./scripts/cleanup_outputs.sh
fi

if [[ -n "${USE_INSTANCES:-}" ]]; then
  echo "Using multiple instances ($USE_INSTANCES) for pure speed 🔥"
fi

echo "🚀 Starting services..."

# Run docker compose after injecting secrets and replacing host IP placeholder
SED_ARGS=(
  -e "s|(MESSAGE_QUEUE_HOST:).*|\1 ${MESSAGE_QUEUE_HOST}|g"
  -e "s|(EVENT_QUEUE_ADDRESS:).*|\1 ${EVENT_QUEUE_ADDRESS}|g"
  -e "s|(MESSAGE_QUEUE_USER:).*|\1 ${MESSAGE_QUEUE_USER}|g"
  -e "s|(FCP_AHWR_EVENT_QUEUE_SA_KEY:).*|\1 ${FCP_AHWR_EVENT_QUEUE_SA_KEY}|g"
  -e "s|(AADAR_AUTHORITY_URL:).*|\1 ${AADAR_AUTHORITY_URL}|g"
  -e "s|(AADAR_CLIENT_SECRET:).*|\1 ${AADAR_CLIENT_SECRET}|g"
  -e "s|(AADAR_CLIENT_ID:).*|\1 ${AADAR_CLIENT_ID}|g"
)

if [[ -n "${CLAIM_COMPLIANCE_CHECK_RATIO:-}" ]]; then
  SED_ARGS+=(-e "s|(CLAIM_COMPLIANCE_CHECK_RATIO:).*|\1 ${CLAIM_COMPLIANCE_CHECK_RATIO}|g")
fi
if [[ -n "${FEATURE_ASSURANCE_ENABLED:-}" ]]; then
  SED_ARGS+=(-e "s|(FEATURE_ASSURANCE_ENABLED:).*|\1 ${FEATURE_ASSURANCE_ENABLED}|g")
fi

sed -E "${SED_ARGS[@]}" docker-compose.yml | docker compose -f - up -d

WDIO_CONTAINER=$(docker ps -qf "name=wdio-tests")

if [ -z "$WDIO_CONTAINER" ]; then
  echo "❌ Error: WDIO container not found!"
  exit 1
fi

echo "🧪 Running WDIO tests: "$TEST_COMMAND""

LOG_DIR="logs"
if [[ "$TEST_COMMAND" == "comp" ]]; then
  LOG_DIR="logsComp"
elif [[ "$TEST_COMMAND" == "compFA" ]]; then
  LOG_DIR="logsCompFA"
fi

mkdir -p "$LOG_DIR"
export LOG_DIR

docker image ls --format "{{.Repository}}" \
  | grep '^ahwr-' \
  | xargs -I {} sh -c '
      docker compose logs -f "$1" > "$LOG_DIR/$1.log" 2>&1 &
    ' sh {}

docker exec -i --user root "$WDIO_CONTAINER" npm run test:"$TEST_COMMAND" | tee "$LOG_DIR/wdio_test_output.log"
EXIT_CODE=${PIPESTATUS[0]}

echo "🛑 Stopping services..."
docker compose down

exit $EXIT_CODE
