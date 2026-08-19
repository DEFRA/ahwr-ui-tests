#!/bin/bash

# Docker Hub org/user
DOCKERHUB_ORG="defradigital"

# Updated repo names
IMAGES=(
  "ahwr-application-backend"
  "ahwr-backoffice-ui"
  "ahwr-public-user-ui"
)

# Tracks whether any image could not be updated, so we can exit non-zero
FAILED=0

# Parse --local arguments
LOCAL_IMAGES=()
while [[ $# -gt 0 ]]; do
  case $1 in
    --local)
      LOCAL_IMAGES+=("$2")
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

# Get latest tag from Docker Hub
get_latest_tag() {
  local repo="$1"

  curl -s "https://registry.hub.docker.com/v2/repositories/${DOCKERHUB_ORG}/${repo}/tags?page_size=50" \
    | jq -r '
        .results
        | map(.name)
        | map(select(. | contains("rc") | not))
        | map(select(. | contains("beta") | not))
        | map(select(. | contains("alpha") | not))
        | map(select(. | contains("pr") | not))
        | first
      '
}

# Pull latest images
for IMAGE in "${IMAGES[@]}"; do
  # Check if image should use local version
  if [[ " ${LOCAL_IMAGES[*]} " =~ " ${IMAGE} " ]]; then
    echo "Using local ${IMAGE}-development:latest"
    docker tag "${IMAGE}-development:latest" "${IMAGE}:latest"
    echo "Retagged ${IMAGE}-development:latest → ${IMAGE}:latest"
    continue
  fi

  LATEST_TAG=$(get_latest_tag "$IMAGE")

  if [ -z "$LATEST_TAG" ] || [ "$LATEST_TAG" = "null" ]; then
    echo "⚠️  No valid tags found for $IMAGE — leaving any existing ${IMAGE}:latest untouched."
    FAILED=1
    continue
  fi

  FULL_IMAGE="${DOCKERHUB_ORG}/${IMAGE}:${LATEST_TAG}"

  echo "🚀 Pulling $FULL_IMAGE..."
  if ! docker pull "$FULL_IMAGE"; then
    echo "❌ Failed to pull $FULL_IMAGE — leaving any existing ${IMAGE}:latest untouched."
    FAILED=1
    continue
  fi

  echo "🔄 Retagging ${IMAGE}:latest..."
  docker tag "$FULL_IMAGE" "${IMAGE}:latest"

  echo "🧹 Removing old tag reference..."
  docker rmi "$FULL_IMAGE" >/dev/null 2>&1

  echo "✅ Updated $IMAGE → latest"
done

if [ "$FAILED" -ne 0 ]; then
  echo "⚠️  One or more images could not be updated (see errors above)."
  exit 1
fi

echo "🎉 All images updated to latest."
