---
id: blocks.workspace.home
layer: catalog-block
kind: page-scaffold
package: github.com/fastygo/buildy/internal/ui/blocks/workspace/home
templ: Page
api:
  PageProps:
    role: page-data
    fields:
      - Brand
      - Workspace
      - Prototype
      - Sidebar
      - HeaderNav
      - Hero
      - Tools
      - Showcase
      - Notice
      - ProfileName
showcase:
  - id: default
    constructor: DefaultPage
semantics:
  root: main
  behavior: static
  data: in-package English defaults
---

## Summary

Workspace home is a self-contained Catalog page block.
It includes its own sidebar, header, hero command center, workflow cards,
showcase grid, and prototype notice.

## Boundaries

- Does not import BuildY runtime layout, views, site, or fixtures.
- Does not include theme or language controls.
- Uses English defaults from `defaults.go`.
- Intended for isolated copy into `@Templ/examples`.
