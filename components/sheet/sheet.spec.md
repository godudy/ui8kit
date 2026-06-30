---
id: components.sheet
layer: composite
kind: overlay
package: github.com/fastygo/templ/components/sheet
facade: github.com/fastygo/templ/components
templ: Sheet
parts:
  - templ: Sheet
    props: [ID, Variant, Side, Size, Class, Open, AriaLabel, AriaLabelledBy, AriaDescribedBy, Behavior, Attrs]
  - templ: SheetTrigger
    props: [ID, For, Class, Variant, Size, Open, Behavior, AriaLabel, Attrs]
  - templ: SheetOverlay
    props: [For, Class, Open, Behavior, Attrs]
  - templ: SheetContent
    props: [ID, Class, Attrs]
  - templ: SheetHeader
    props: [Class, Attrs]
  - templ: SheetTitle
    props: [ID, Class, Attrs]
    value: string
  - templ: SheetDescription
    props: [ID, Class, Attrs]
    value: string
  - templ: SheetClose
    props: [For, Class, Variant, Size, Behavior, AriaLabel, Attrs]
api:
  Variant:
    role: appearance
    type: string
    enum: [default, card, ghost, unstyled]
    allow-list-source: sheet.variants.json#variant
    default: default
  Side:
    role: placement
    type: string
    enum: [left, right, top, bottom]
    default: right
  Size:
    role: density
    type: string
    enum: [sm, default, md, lg, xl, full]
    default: default
  Behavior:
    role: behavior-hook
    type: string
    enum: ["", ui8kit]
    default: ""
  Open:
    role: state
    type: bool
    default: false
    notes: 'Initial SSR open state. Runtime toggling uses @ui8kit/aria when Behavior is ui8kit.'
  Target:
    role: id-reference
    type: string
    react-only: true
    notes: 'Replaces Go For on SheetTrigger, SheetOverlay, SheetClose.'
showcase:
  - id: side.left
    props: { ID: demo-sheet, Side: left, Size: sm, AriaLabel: "Navigation" }
  - id: behavior.ui8kit
    props: { ID: demo-sheet, Behavior: ui8kit }
semantics:
  root: div[role=dialog]
  role: dialog
  behavior: optional
targets:
  react:
    component: Sheet
    facade: '@fastygo/templ-react'
    package: '@fastygo/templ-react/components/sheet'
    notes:
      - 'Declarative open?: boolean sets initial hidden/data-state only; runtime uses @ui8kit/aria when behavior="ui8kit".'
      - 'SheetTrigger, SheetOverlay, SheetClose use target (id reference) instead of Go For string.'
      - 'behavior="ui8kit" emits data-ui8kit-* hooks matching Templ markup.'
  templ:
    component: Sheet
    facade: github.com/fastygo/templ/components
    package: github.com/fastygo/templ/components/sheet
---

## Summary

Sheet composes a side panel with trigger, overlay, content, and close parts.
Behavior hooks are opt-in through Behavior.

## Use Cases

- Render mobile navigation panels
- Render settings and inspector side panels

## Semantics

- Sheet root is a div with role dialog and aria-modal true (side panel semantics, not native dialog element)
- For center modals use ui/dialog with native dialog element and showModal()
- Trigger wires aria-haspopup, aria-controls, and aria-expanded
- Behavior ui8kit adds data-ui8kit dialog hooks; @ui8kit/aria owns open/close runtime on both stacks

## Example side.left

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.SheetTrigger(cmp.SheetTriggerProps{For: "demo-sheet", AriaLabel: "Open navigation"}) { Menu }
	@cmp.Sheet(cmp.SheetProps{ID: "demo-sheet", Side: "left", AriaLabel: "Navigation"}) {
		@cmp.SheetContent(cmp.SheetContentProps{}) {
			Navigation
		}
	}
}
```

## Example behavior.ui8kit

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.SheetTrigger(cmp.SheetTriggerProps{For: "demo-sheet", Behavior: "ui8kit"}) { Open }
	@cmp.Sheet(cmp.SheetProps{ID: "demo-sheet", Behavior: "ui8kit", AriaLabel: "Panel"}) {
		@cmp.SheetOverlay(cmp.SheetOverlayProps{For: "demo-sheet", Behavior: "ui8kit"})
		@cmp.SheetContent(cmp.SheetContentProps{}) { Panel }
	}
}
```
