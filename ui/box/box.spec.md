---
api:
    Attrs:
        cva: false
        role: html-attrs
        type: templ.Attributes
    Class:
        cva: false
        role: style-extension
        type: string
    Tag:
        allow-list-source: utils.tags.TagGroupLayout
        cva: false
        default: div
        enum:
            - div
            - section
            - article
            - aside
            - header
            - footer
            - main
            - nav
            - figure
            - search
            - hgroup
        role: layout-tag
        type: string
data: box.data.json
facade: github.com/fastygo/templ/ui
id: ui.box
kind: layout
layer: primitive
package: github.com/fastygo/templ/ui/box
semantics:
    behavior: static
    data: box.data.json
    role: none
    root: resolved from Tag
    rule: internal-layout-only-not-landmark
showcase:
    - id: tag.default
      props:
        Tag: div
      ref: tag.default
    - id: tag.section
      props:
        Class: p-4
        Tag: section
      ref: tag.section
slots:
    default:
        accepts: any
        required: true
targets:
    react:
        component: Box
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/box'
    templ:
        component: Box
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/box
templ: Box
variants: box.variants.json
---
## Summary

Box wraps internal layout sections inside a Block.
Box is not for top-level page landmarks.

## Use Cases

- Pad content inside a card body
- Group inline elements with flex utilities on Class

## Semantics

- ResolveTag uses TagGroupLayout from utils
- Attrs spread directly on the root element
- Prefer Block for main, header, and footer regions

## Example tag.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Box(ui.BoxProps{Class: "mx-auto max-w-3xl px-6"}) {
		Inner content
	}
}
```

## Example tag.section

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Box(ui.BoxProps{Tag: "section", Class: "p-4"}) {
		Section body
	}
}
```
