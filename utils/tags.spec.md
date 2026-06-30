---
id: utils.tags
layer: helper
kind: module
package: github.com/fastygo/templ/utils
facade: github.com/fastygo/templ/utils
go-package: uiutils
parent: utils
source: utils/tags.json
generator: .validate/cmd/tagsgen
exports:
  types:
    - name: TagGroup
      role: semantic-tag-set
  functions:
    - name: ResolveTag
      role: tag-fallback-resolver
      signature: ResolveTag(tag, fallback string, group TagGroup) string
    - name: IsAllowedTag
      role: tag-validator
tag-groups:
  - name: TagGroupLayout
    allows: [div, section, article, aside, header, footer, main, nav, figure, search, hgroup]
    used-by: [ui.block, ui.box]
  - name: TagGroupStack
    allows: [div, ul, ol]
    used-by: [ui.stack]
  - name: TagGroupGroup
    allows: [div, fieldset, dl]
    used-by: [ui.group]
  - name: TagGroupList
    allows: [ul, ol, dl, menu]
    used-by: [ui.list]
  - name: TagGroupText
    allows: [p, blockquote, figcaption, address, pre, span, em, strong, small, abbr, cite, code, kbd, mark, time, data, var, samp, sub, sup, b, i, u, s, q, dfn, bdo, bdi, ins, del]
    used-by: [ui.text]
  - name: TagGroupContainer
    allows: [div, main, section]
    used-by: [ui.container]
  - name: TagGroupHeading
    allows: [h1, h2, h3, h4, h5, h6]
    used-by: [ui.title]
examples:
  - id: resolve.layout
semantics:
  invalid-tag: fallback
---

## Summary

Tags module restricts HTML tag names per primitive group.
ResolveTag returns fallback when tag is not allowed.

## Use Cases

- Block and Box pick landmark tags safely
- Text and Title pick semantic prose tags safely

## Semantics

- Source of truth is `utils/tags.json`; `tagsgen` emits `utils/tags.go` and `utils/tags.ts`
- TagGroup is an int enum in Go, a string union in TypeScript
- ResolveTag lowercases and trims the requested tag
- Invalid tags never render; fallback always wins

## Example resolve.layout

```go
tag := uiutils.ResolveTag("main", "div", uiutils.TagGroupLayout)
// tag == "main"

tag := uiutils.ResolveTag("table", "div", uiutils.TagGroupLayout)
// tag == "div"
```
