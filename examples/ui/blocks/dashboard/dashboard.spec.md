---
id: blocks.dashboard
layer: catalog-block
kind: page-scaffold
package: github.com/fastygo/buildy/internal/ui/blocks/dashboard
templ: Page
api:
  PageProps:
    role: page-data
    fields:
      - Brand
      - Workspace
      - Status
      - ProfileName
      - Sidebar
      - HeaderNav
      - Hero
      - Cards
      - Layers
      - Notice
showcase:
  - id: default
    constructor: DefaultPage
semantics:
  root: main
  behavior: static
  data: in-package English defaults
---

## Summary

Dashboard is a self-contained Catalog page block.
It mirrors the current application shell layer with sidebar navigation, header
navigation, status cards, and a current-layer inventory.

## Boundaries

- Uses FastyGo naming in defaults.
- Does not import product runtime layout, views, site, or fixtures.
- Does not include theme or language controls.
- Intended for isolated copy into `@Templ/examples`.
