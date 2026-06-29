# Component spec template (machine-readable)

Copy to `{package}/{name}.spec.md` next to `{name}.templ`.
Use Controlled English (STE-style): short sentences, active voice, one meaning per word.

See also: [`.cursor/rules/templ-component-spec.mdc`](../../.cursor/rules/templ-component-spec.mdc).

## Two layers

| Layer | Key | Rule |
|-------|-----|------|
| API | `api:` | Full contract — complete enums, defaults, sources |
| Showcase | `showcase:` | Curated examples only — not exhaustive |

LLM and parsers: **`api` is authoritative** for allowed values. **`showcase` is preview catalog**.

## Validation rules

1. File name MUST be `{templ-basename}.spec.md` in the same directory as `{templ-basename}.templ`.
2. YAML front matter MUST parse as a single document.
3. Required keys: `id`, `layer`, `kind`, `package`, `facade`, `api`, `showcase`, `semantics`.
   Helper modules (`layer: helper`) use `exports` instead of `api`/`showcase`; see [`utils/utils.spec.md`](../../utils/utils.spec.md).
4. Primitives MUST set `templ: {ComponentName}`. Composites MUST set `parts[]` instead of `templ`.
5. Every `showcase[].id` MUST have matching `## Example {id}` with one fence (`templ` or `go` for helpers).
6. Every `## Example {id}` MUST reference an `id` listed in `showcase[]`.
7. Optional `allow-list-source` on an api field MUST match code (`utils/tags.go`, variant recipes in `utils/utils.go`).
8. Summary sentences MUST NOT exceed 15 words each.
9. Prose sections allowed: `Summary`, `Use Cases`, `Semantics` only.

**Showcase coverage:** `showcase` does not need to list every `api.*.enum` value. Missing from showcase ≠ forbidden.

## Blank template (primitive)

```markdown
---
id: ui.example
layer: primitive
kind: action
package: github.com/fastygo/templ/ui/example
facade: github.com/fastygo/templ/ui
templ: Example
api:
  Variant:
    role: appearance
    type: string
    enum: [default, secondary]
    default: default
  Class:
    role: style-extension
    type: string
slots:
  default:
    required: true
    accepts: text
showcase:
  - id: variant.default
    props: { Variant: default }
  - id: variant.secondary
    props: { Variant: secondary }
semantics:
  root: button
  role: button
  behavior: interactive
---

## Summary

Example triggers one user action.
Example uses variant presets for appearance.

## Use Cases

- One primary action on a form
- One secondary action in a toolbar

## Semantics

- Root element is button
- Example has button role when interactive
- Children provide visible label text

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Example(ui.ExampleProps{Variant: "default"}) {
		Default
	}
}
```

## Example variant.secondary

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
	@ui.Example(ui.ExampleProps{Variant: "secondary"}) {
		Secondary
	}
}
```
```

## Tag-based primitive (allow-list)

```markdown
---
id: ui.block
layer: primitive
kind: layout
api:
  Tag:
    role: landmark-tag
    type: string
    enum: [div, main, header, section, footer, nav, article, aside, figure]
    default: div
    allow-list-source: utils.tags.TagGroupLayout
showcase:
  - id: tag.main
    props: { Tag: main }
---
```

## Composite template

```markdown
---
id: components.example
layer: composite
kind: surface
parts:
  - templ: Example
    props: [Class, Variant]
showcase:
  - id: variant.default
    props: { Variant: default }
  - id: layout.standard
    parts: [Example, ExampleHeader, ExampleContent]
---
```

## Field reference

| Key | Type | Notes |
|-----|------|-------|
| `api` | map | Full prop contract — **complete** enums |
| `showcase` | list | `{ id, props?, parts? }` — curated previews only |
| `allow-list-source` | string | Link to `utils.tags.*` or recipe in `utils/utils.go` |
| `parts` | list | Composite sub-components |
| `semantics` | map | Root, role, behavior |

## Showcase id convention

| Prefix | Use |
|--------|-----|
| `variant.*` | Appearance preset |
| `size.*` | Density preset |
| `tag.*` | Root tag selection |
| `state.*` | Interaction state |
| `layout.*` | Composite composition |
| `order.*` | Heading level |
| `composition.aschild-*` | `asChild` Slot composition (React) or `*Classes` manual wrap (Go) |

## `AsChild` prop (composition)

Components that support element substitution expose `AsChild: true`:

- **React**: when `asChild` is set, the component renders a `Slot` that merges its props (className via `cn`, ref, event handlers) onto its single child element. Use this to swap the root element (e.g., `<Button asChild><a href="/x">x</a></Button>`).
- **Go `templ`**: there is no `cloneElement` equivalent. Go consumers wrap manually using the component's `*Classes` helper (e.g., `<a href="/x" class={ ui.ButtonClasses(p) }>x</a>`).

Spec API declaration:

```yaml
api:
  AsChild:
    role: composition
    type: bool
    default: false
```


## Sync with `.templ` source

- `/** */` on component MUST match `## Summary`.
- `//` prop comments MUST list values from `api.*.enum`.
- Docgen reads `{name}.spec.md` as source of truth; `.templ` implements it.
