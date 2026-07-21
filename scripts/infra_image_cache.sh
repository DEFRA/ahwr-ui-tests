#!/bin/bash

# Save or load the pinned infra images (localstack, mongo, redis) as a single
# tarball so CI can cache them across ephemeral runners instead of pulling from
# Docker Hub every run. The app images (ahwr-*) are excluded: they change on
# most runs and are pulled fresh by pull_latest_images.sh.
#
# Usage: ./infra_image_cache.sh <load|save> <tarball>

set -eo pipefail

ACTION="$1"
TARBALL="$2"
COMPOSE_FILE="docker-compose.yml"

if [[ -z "$ACTION" || -z "$TARBALL" ]]; then
  echo "Usage: $0 <load|save> <tarball>"
  exit 1
fi

# The compose file is the single source of truth for the infra image tags: take
# every `image:` reference, dropping the locally-built wdio-tests image and the
# ahwr-* app images.
infra_images() {
  grep -E '^\s*image:' "$COMPOSE_FILE" \
    | sed -E 's/^\s*image:\s*//' \
    | grep -vE '^(wdio-tests|ahwr-)'
}

case "$ACTION" in
  load)
    echo "📦 Loading cached infra images from $TARBALL..."
    docker load -i "$TARBALL"
    echo "✅ Infra images loaded."
    ;;
  save)
    mapfile -t IMAGES < <(infra_images)
    if [ "${#IMAGES[@]}" -eq 0 ]; then
      echo "❌ No infra images found in $COMPOSE_FILE"
      exit 1
    fi

    for IMAGE in "${IMAGES[@]}"; do
      echo "🚀 Pulling $IMAGE..."
      docker pull "$IMAGE"
    done

    mkdir -p "$(dirname "$TARBALL")"
    echo "💾 Saving infra images to $TARBALL..."
    docker save "${IMAGES[@]}" -o "$TARBALL"
    echo "✅ Infra images cached."
    ;;
  *)
    echo "❌ Unknown action: $ACTION (expected 'load' or 'save')"
    exit 1
    ;;
esac
