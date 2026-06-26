---
id: blocks.home
layer: catalog-block
kind: page-scaffold
package: github.com/fastygo/templ/examples/ui/blocks/home
facade: github.com/fastygo/templ/examples/ui/blocks/home
templ: Page

targets:
  templ:
    package: github.com/fastygo/templ/examples/ui/blocks/home
    facade: github.com/fastygo/templ/examples/ui/blocks/home
    component: Page

variants: home.variants.json
data: home.data.json

codegen:
  output: page_gen.go
  data:
    propsType: PageProps
    defaultFunction: DefaultPage
    ref: default

api:
  PageProps:
    role: page-data
    type: object
    cva: false
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
  toolTone:
    role: appearance
    type: string
    cva: true
    enum: [blue, green, amber, muted, default]
    allow-list-source: home.variants.json#toolTone
    default: default

slots:
  default:
    required: false
    accepts: any

showcase:
  - id: default
    ref: default

semantics:
  root: main
  behavior: static
  data: home.data.json
---

## Summary

Workspace home is a self-contained catalog page block.
It includes sidebar, header, hero command center, workflow cards, showcase grid, and prototype notice.
The shell composes Sheet, Nav, and IconBadge from the registry.

## Use Cases

- Preview a marketing-style workspace landing in examples
- Copy an isolated page scaffold into a consumer app
- Drive render tests from stack-neutral showcase fixtures

## Semantics

- Root element is main via Block
- Mobile navigation uses Sheet with ui8kit behavior hooks
- Demo copy lives in home.data.json, not in registry bricks

## Boundaries

- Does not import BuildY runtime layout, views, site, or fixtures.
- Does not include theme or language controls.
- Uses English defaults from home.data.json.
- Intended for isolated copy into examples preview.

## Example default

```templ
import "github.com/fastygo/templ/examples/ui/blocks/home"

templ Example() {
	@home.Page(home.DefaultPage())
}
```
