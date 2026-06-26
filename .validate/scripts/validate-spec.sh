#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> validate-spec"
go run ./.validate/cmd/validate-spec

echo "==> blockgen --check"
go run ./.validate/cmd/blockgen --check

if [[ "${1:-}" == "--with-tests" ]]; then
	echo "==> go test ./..."
	go test ./...
fi
