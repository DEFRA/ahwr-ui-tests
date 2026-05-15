#!/bin/bash

# Docker Hub org/user
DOCKERHUB_ORG="defradigital"

# Updated repo names
IMAGES=(
  "ahwr-application-backend"
  "ahwr-backoffice-ui"
  "ahwr-public-user-ui"
)

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
    echo "⚠️  No valid tags found for $IMAGE. Skipping."
    continue
  fi

  FULL_IMAGE="${DOCKERHUB_ORG}/${IMAGE}:${LATEST_TAG}"

  echo "🚀 Pulling $FULL_IMAGE..."
  docker pull "$FULL_IMAGE"

  echo "🔄 Retagging ${IMAGE}:latest..."
  docker tag "$FULL_IMAGE" "${IMAGE}:latest"

  echo "🧹 Removing old tag reference..."
  docker rmi "$FULL_IMAGE" >/dev/null 2>&1

  echo "✅ Updated $IMAGE → latest"
done

echo "🎉 All images updated to latest."
