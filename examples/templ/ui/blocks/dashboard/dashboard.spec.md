---
id: blocks.dashboard
layer: catalog-block
kind: page-scaffold
package: github.com/fastygo/templ/examples/templ/ui/blocks/dashboard
facade: github.com/fastygo/templ/examples/templ/ui/blocks/dashboard
templ: Page

targets:
  templ:
    package: github.com/fastygo/templ/examples/templ/ui/blocks/dashboard
    facade: github.com/fastygo/templ/examples/templ/ui/blocks/dashboard
    component: Page

variants: dashboard.variants.json
data: ../../../../data/dashboard.data.json
data-package: github.com/fastygo/templ/examples/data
data-var: DashboardDataJSON

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
      - Status
      - ProfileName
      - Sidebar
      - HeaderNav
      - Hero
      - Cards
      - Layers
      - Notice
  statusTone:
    role: appearance
    type: string
    cva: true
    enum: [default, muted]
    allow-list-source: dashboard.variants.json#statusTone
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
  data: examples/data/dashboard.data.json
---

## Summary

Dashboard is a self-contained catalog page block.
It mirrors an application shell with sidebar navigation, header navigation, status cards, and a current-layer inventory.
The block composes Sheet, Nav, and IconBadge for mobile menu, navigation lists, and icon surfaces.

## Use Cases

- Preview an app-shell dashboard in examples
- Copy a portable shell snapshot into a consumer app
- Drive render tests from stack-neutral showcase fixtures

## Semantics

- Root element is main via Block
- Mobile navigation uses Sheet with ui8kit behavior hooks
- Demo copy lives in dashboard.data.json, not in registry bricks

## Boundaries

- Uses FastyGo naming in showcase fixtures.
- Does not import product runtime layout, views, site, or fixtures.
- Does not include theme or language controls.
- Intended for isolated copy into examples preview.

## Example default

```templ
import "github.com/fastygo/templ/examples/templ/ui/blocks/dashboard"

templ Example() {
	@dashboard.Page(dashboard.DefaultPage()) {
		<!-- optional slot content -->
	}
}
```
