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
        allow-list-source: utils.tags.TagGroupText
        cva: false
        default: p
        enum:
            - p
            - blockquote
            - figcaption
            - address
            - pre
            - span
            - em
            - strong
            - small
            - abbr
            - cite
            - code
            - kbd
            - mark
            - time
            - data
            - var
            - samp
            - sub
            - sup
            - b
            - i
            - u
            - s
            - q
            - dfn
            - bdo
            - bdi
            - ins
            - del
        role: prose-tag
        type: string
    value:
        cva: false
        position: argument
        role: copy
        type: string
data: text.data.json
facade: github.com/fastygo/templ/ui
id: ui.text
kind: typography
layer: primitive
package: github.com/fastygo/templ/ui/text
semantics:
    behavior: static
    data: text.data.json
    role: none
    root: resolved from Tag
showcase:
    - id: tag.p
      props:
        Tag: p
      ref: tag.p
    - id: tag.small
      props:
        Class: text-muted-foreground
        Tag: small
      ref: tag.small
    - id: tag.code
      props:
        Class: text-sm
        Tag: code
      ref: tag.code
targets:
    react:
        component: Text
        facade: '@fastygo/templ-react'
        package: '@fastygo/templ-react/ui/text'
    templ:
        component: Text
        facade: github.com/fastygo/templ/ui
        package: github.com/fastygo/templ/ui/text
templ: Text
variants: text.variants.json
---
## Summary

Text renders plain copy in a semantic tag.
Pass copy as the second value argument.

## Use Cases

- Render body paragraph copy
- Render muted helper line with Tag small

## Semantics

- ResolveTag uses TagGroupText from utils
- Invalid Tag falls back to p

## Example tag.p

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Text(ui.TextProps{}, "Body paragraph text.")
}
```

## Example tag.small

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Text(ui.TextProps{Tag: "small", Class: "text-muted-foreground"}, "Helper line.")
}
```

## Example tag.code

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Text(ui.TextProps{Tag: "code", Class: "text-sm"}, "npm install")
}
```
