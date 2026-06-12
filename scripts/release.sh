#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/release.sh 0.1.0
# Creates an annotated tag for the Go module in go.mod.

VERSION="${1:-}"

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.1.0"
  exit 1
fi

VERSION="${VERSION#v}"
TAG="v${VERSION}"
MODULE_PATH="$(go list -m)"

if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Error: version must be semver, for example 0.1.0 or v0.1.0"
  exit 1
fi

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Error: tag $TAG already exists"
  exit 1
fi

git tag -a "$TAG" -m "$TAG"

echo "Created $TAG for $MODULE_PATH."
echo "Publish it with:"
echo "  git push origin $TAG"
