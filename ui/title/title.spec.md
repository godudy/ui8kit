---
api:
    Class:
        cva: false
        role: style-extension
        type: string
    Order:
        allow-list-source: utils.helpers.TitleTag
        cva: false
        default: 2
        enum:
            - 1
            - 2
            - 3
            - 4
            - 5
            - 6
        role: heading-level
        type: int
    value:
        cva: false
        position: argument
        role: copy
        type: string
data: title.data.json
facade: github.com/fastygo/templ/ui
id: ui.title
kind: typography
layer: primitive
package: github.com/fastygo/templ/ui/title
semantics:
    behavior: static
    data: title.data.json
    role: heading
    root: h1 | h2 | h3 | h4 | h5 | h6
showcase:
    - id: order.h1
      props:
        Order: 1
      ref: order.h1
    - id: order.h2
      props:
        Order: 2
      ref: order.h2
    - id: order.h3
      props:
        Class: text-lg
        Order: 3
      ref: order.h3
targets:
    react:
        component: Title
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/title'
    templ:
        component: Title
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/title
templ: Title
variants: title.variants.json
---
## Summary

Title renders one heading from Order prop.
TitleTag maps Order to h1 through h6.

## Use Cases

- Render page title with Order 1
- Render section title with Order 2

## Semantics

- Order 0 and 2 default to h2
- Order 1 maps to h1, Order 3 to h3

## Example order.h1

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Title(ui.TitleProps{Order: 1}, "Page title")
}
```

## Example order.h2

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Title(ui.TitleProps{Order: 2}, "Section title")
}
```

## Example order.h3

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Title(ui.TitleProps{Order: 3, Class: "text-lg"}, "Subsection title")
}
```
