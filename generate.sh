#!/usr/bin/env bash
# Regenerate all registry *_templ.go files.
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd)"
dirs=(
  "$root/ui/button"
  "$root/ui/badge"
  "$root/ui/input"
  "$root/ui/textarea"
  "$root/ui/selectfield"
  "$root/ui/checkbox"
  "$root/ui/radio"
  "$root/ui/formswitch"
  "$root/ui/label"
  "$root/ui/form"
  "$root/ui/text"
  "$root/ui/title"
  "$root/ui/block"
  "$root/ui/box"
  "$root/ui/container"
  "$root/ui/stack"
  "$root/ui/group"
  "$root/ui/grid"
  "$root/ui/list"
  "$root/ui/table"
  "$root/ui"
  "$root/components/card"
  "$root/components/alert"
  "$root/components/breadcrumb"
  "$root/components"
  "$root/test/example"
)
for dir in "${dirs[@]}"; do
  echo "templ generate $dir"
  (cd "$dir" && templ generate .)
done
echo "done"
