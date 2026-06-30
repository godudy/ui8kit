# Dual-stack component library contract

> **Scope:** `github.com/fastygo/templ` — one design system, two runtimes (Go SSR + React CSR).  
> **Styling rule:** `Variant` / `Size` → CVA · everything else → raw Tailwind via `Class` · app linter (`ui8px`) enforces policy.  
> **Source of truth:** per-brick files colocated under `ui/*` and `components/*`.

---

## Goals

1. **One mental model** — props, variants, children, additive classes; only syntax differs between stacks.
2. **One contract** — `{name}.spec.md` is authoritative for API, semantics, and showcase.
3. **One variant map** — `{name}.variants.json` is the single CVA recipe for Go and React.
4. **One fixture set** — `{name}.data.json` drives docs, tests, and LLM examples.
5. **Thin runtimes** — `{name}.templ` and `{name}.tsx` implement behavior; they do not invent new props or classes.

---

## Per-brick file layout

```
ui/
  dialog/
    dialog.spec.md        # universal API + semantics + showcase index
    dialog.variants.json  # CVA map (shared by Go + React)
    dialog.data.json      # showcase props + sample copy (stack-neutral)
    dialog.templ          # Go / templ implementation
    dialog.tsx            # React implementation (optional until ported)
```

Composites (`components/card/`, `components/sheet/`, …) follow the same pattern.

### File roles

| File | Role | Edited by |
|------|------|-----------|
| `*.spec.md` | API contract, slots, semantics, showcase ids, human prose | authors / LLM |
| `*.variants.json` | Base + variant/size class maps | authors or extracted from spec |
| `*.data.json` | Machine-readable showcase payloads | authors / codegen |
| `*.templ` | SSR markup + Go props struct | implementers |
| `*.tsx` | CSR component + TS props | implementers |

**Rule:** If a prop or class string is not in `*.spec.md` + `*.variants.json`, it does not exist.

---

## Styling model (non-negotiable)

### CVA props (`cva: true` in spec)

- `Variant`, `Size`, and other keys listed in `variants.json` → `keys[]`
- Values MUST match `api.*.enum` in spec
- Implemented via `Compose(Variants, …)` in Go and `cva()` in React

### Raw Tailwind (`cva: false`)

- `Class` (Templ) / `className` (React) — **additive only**
- MUST NOT override variant/size utility chains (layout, colors, padding from CVA)
- Spacing, flex, grid, responsive utilities → always via `Class` / `className`, never as separate semantic props (`gap=`, `flex=`)

### App layer

- **Design tokens** (`--background`, `--primary`, …) live in the consuming app (`tweakcn.css`), not in the library
- **Class policy** — `ui8px` lint in Blank (SSR) and Blank-Vite (CSR); library ships no whitelist

---

## `*.spec.md` — universal contract

Evolution of the existing Templ spec format. YAML front matter is **target-neutral**; runtime-specific details go under `targets`.

### Required front matter (bricks)

```yaml
---
id: ui.dialog                    # stable id: ui.* | components.*
layer: primitive                 # primitive | composite | helper
kind: interactive                # action | layout | surface | …

targets:
  templ:
    package: github.com/fastygo/templ/ui/dialog
    facade: github.com/fastygo/templ/ui
    component: Dialog
  react:
    package: "@fastygo/templ-react/ui/dialog"   # or app-local path
    facade: "@fastygo/templ-react"
    component: Dialog

variants: dialog.variants.json   # relative to brick folder
data: dialog.data.json           # relative to brick folder

api:
  Variant:
    role: appearance
    type: string
    cva: true
    enum: [default, card, sheet]
    allow-list-source: dialog.variants.json#variant
    default: default
  Size:
    role: density
    type: string
    cva: true
    enum: [sm, default, lg, xl, full]
    allow-list-source: dialog.variants.json#size
    default: default
  Class:
    role: style-extension
    type: string
    cva: false
    templ: Class
    react: className
  Open:
    role: state
    type: bool
    cva: false
    default: false
  # … identity, a11y, behavior hooks

slots:
  default:
    required: true
    accepts: any

showcase:
  - id: variant.default
    ref: variant.default          # key in *.data.json
  - id: variant.sheet
    ref: variant.sheet

semantics:
  root: dialog
  behavior: native-dialog
---
```

### Two layers (unchanged)

| Layer | Key | Rule |
|-------|-----|------|
| **API** | `api:` | Full contract — complete enums, defaults |
| **Showcase** | `showcase:` | Curated previews — missing entry ≠ forbidden value |

### Prose sections (unchanged)

- `## Summary` — STE-style, max 15 words per sentence
- `## Use Cases`
- `## Semantics`
- `## Example {showcase.id}` — **one fence per target**

### Dual-target examples

```markdown
## Example variant.default

```templ
import "github.com/fastygo/templ/ui"

templ Example() {
  @ui.Dialog(ui.DialogProps{AriaLabel: "Dialog"}) {
    @ui.Text(ui.TextProps{}, "Dialog body.")
  }
}
```

```tsx
import { Dialog } from "@fastygo/templ-react/ui/dialog";

export function Example() {
  return (
    <Dialog aria-label="Dialog">
      Dialog body.
    </Dialog>
  );
}
```
```

React fence is optional until `*.tsx` exists; validator warns, does not fail.

---

## `*.variants.json` — shared CVA schema

Single recipe consumed by Go (`uiutils.Variants`) and React (`class-variance-authority`).

```json
{
  "$schema": "../../schemas/variants.schema.json",
  "id": "ui.dialog",
  "base": "m-auto rounded-lg border border-border bg-background text-foreground shadow-lg backdrop:bg-background/80",
  "keys": ["variant", "size"],
  "defaults": {
    "variant": "default",
    "size": "default"
  },
  "byKey": {
    "variant": {
      "default": "",
      "card": "bg-card text-card-foreground",
      "sheet": "min-h-screen rounded-none"
    },
    "size": {
      "sm": "w-full max-w-sm",
      "default": "w-full max-w-lg",
      "lg": "w-full max-w-2xl",
      "xl": "w-full max-w-4xl",
      "full": "h-full w-full max-w-none"
    }
  }
}
```

### Rules

1. Every key in `keys[]` MUST have a matching `api.*` field with `cva: true`.
2. Every value in `api.*.enum` MUST exist in `byKey.{key}`.
3. `base` MUST NOT duplicate per-variant utilities already in `byKey`.
4. Go and React MUST NOT hardcode class strings that belong in this file.

### Go usage

```go
var DialogVariants = uiutils.VariantsFromFile("dialog.variants.json") // or embed
// DialogClasses(p) = Compose(DialogVariants, selection, p.Class)
```

### React usage

```ts
import recipe from "./dialog.variants.json";
export const dialogVariants = cvaFromRecipe(recipe); // thin helper
// className={cn(dialogVariants({ variant, size }), className)}
```

---

## `*.data.json` — showcase fixtures

Stack-neutral props and sample content for docs, tests, and LLM.

```json
{
  "$schema": "../../schemas/data.schema.json",
  "id": "ui.dialog",
  "showcase": {
    "variant.default": {
      "props": {
        "Variant": "default",
        "Size": "default",
        "AriaLabel": "Dialog"
      },
      "children": {
        "text": "Dialog body."
      }
    },
    "variant.sheet": {
      "props": {
        "Variant": "sheet",
        "Size": "full",
        "AriaLabel": "Panel"
      },
      "children": {
        "text": "Panel body."
      }
    }
  }
}
```

### Rules

1. Keys MUST match `showcase[].ref` (or `showcase[].id`) in spec.
2. `props` use **canonical PascalCase** names from `api:` (codegen maps to `className`, `href`, etc.).
3. `children` describes slot content abstractly; each runtime renders it idiomatically.
4. Render tests in Go and React assert the same **computed class string** for each showcase entry.

---

## Naming map (canonical → runtime)

| Spec (canonical) | Templ | React |
|------------------|-------|-------|
| `Class` | `Class` | `className` |
| `Tag` | `Tag` | `tag` |
| `Variant` | `Variant` | `variant` |
| `Size` | `Size` | `size` |
| `Href` | `Href` | `href` |
| `ID` | `ID` | `id` |
| `AriaLabel` | `AriaLabel` | `aria-label` |
| `Attrs` | `templ.Attributes` | `HTMLAttributes` / spread |

Spec authors always use **PascalCase** in `api` and `*.data.json`.

---

## Runtime implementation rules

### `*.templ` (Go SSR)

- Props struct fields mirror `api:` (PascalCase)
- `*Classes(props)` = `Compose(variants, selection, props.Class)` only
- No inline Tailwind outside `*.variants.json`. There is no `unstyled` escape hatch — add a new named variant when needed
- Behavior hooks (`DataUI8Kit`, `Behavior`) are **opt-in** — default bricks stay framework-neutral (see [`behavior-hooks-and-aria.md`](./behavior-hooks-and-aria.md))
- Children via `{ children... }`

### `*.tsx` (React CSR)

- Props interface from spec (`VariantProps` from CVA + non-CVA fields)
- `forwardRef` where the root is a DOM element
- `className` merged after CVA: `cn(variants({ variant, size }), className)`
- Interactive behavior (open state, focus trap) may use Radix or `@ui8kit/aria` — **semantics** in spec, implementation per stack
- No utility-prop layer (`gap=`, `flex=` as props) — use `className`

---

## Repository layout (library root)

```
templ/
  .project/
    dual-stack-component-library.md    # brick contract (variants, data, dual-target)
    behavior-hooks-and-aria.md       # opt-in behavior, static ARIA, planned a11y work
    ui8kit-aria-boundary.md          # @ui8kit/aria vs registry — subset APG patterns
    go-module-publishing.md          # go get vs npm, export-ignore, release.yml
    schemas/
      variants.schema.json
      data.schema.json
      spec.schema.json
  utils/                               # shared Go helpers (Cn, Compose, attrs)
  ui/                                  # primitives — one folder per brick
  components/                          # composites
  components.json                      # registry manifest (shadcn-style)
  .validate/                           # spec + json validators
```

---

## Validation pipeline

Run before merge:

```bash
# 1. Spec structure + showcase ↔ examples
bash .validate/scripts/validate-spec.sh

# 2. variants.json ↔ api.enum ↔ Go/React implementations
go run ./.validate/cmd/validate-variants

# 3. data.json ↔ showcase refs
go run ./.validate/cmd/validate-data

# 4. Class parity on showcase entries (optional, when both runtimes exist)
go test ./... -run Showcase
# vitest run --project react-bricks
```

### CI guarantees

- `api.*.enum` ↔ `variants.json` ↔ `allow-list-source`
- `showcase[].id` ↔ `## Example {id}` ↔ `data.json` key
- Same computed classes for each showcase ref in Templ and React
- `ui8px` passes in reference apps (Blank SSR, Blank-Vite CSR)

---

## Migration from current Templ bricks

For each existing brick (e.g. `ui/dialog/`):

1. **Extract** inline `*Variants` var from `*_templ.go` / `.templ` → `dialog.variants.json`
2. **Extend** `dialog.spec.md` with `targets`, `variants`, `data`, `cva: true/false` on api fields
3. **Add** `dialog.data.json` from existing `showcase[].props`
4. **Wire** Go to load/embed JSON via `blockgen` → `page_gen.go` (or React equivalent later)
5. **Add** `dialog.tsx` when React port starts — same folder, same contract
6. **Delete** duplicate class strings from implementation files

Priority order: `button`, `stack`, `block`, `box`, `text`, `title`, `card`, `badge`, `sheet`, then form controls.

---

## LLM authoring checklist

When creating or editing a brick:

1. Read this file and `.cursor/rules/templ-component-spec.mdc`
2. Edit `*.spec.md` first — API and semantics
3. Edit `*.variants.json` — only CVA keys listed in spec
4. Edit `*.data.json` — showcase payloads
5. Implement `*.templ` — no new props, no stray classes
6. Implement `*.tsx` — mirror semantics, React idioms only for DOM/events
7. Add dual `## Example` fences when both runtimes exist
8. Run validators + ui8px in the reference app

For example blocks under `examples/templ/ui/blocks/`:

1. Edit `*.spec.md`, `*.data.json`, `*.variants.json`, `props.go`, `page.templ`.
2. Run `bun run generate` — emits `page_gen.go` and `page_templ.go`.
3. Do not hand-edit generated glue files.

**Forbidden:**

- Semantic layout props (`gap`, `padding`, `flex` as component API)
- Duplicate variant enums not in spec
- Hardcoded Tailwind in `.templ` / `.tsx` that belongs in `*.variants.json`
- App-specific tokens inside the library

---

## Reference brick: `ui/dialog/`

| File | Status |
|------|--------|
| `dialog.spec.md` | exists — add `targets`, `variants`, `data`, `cva` flags |
| `dialog.variants.json` | **create** — extract from `DialogVariants` in `dialog.templ` |
| `dialog.data.json` | **create** — from showcase props in spec |
| `dialog.templ` | exists — load variants from JSON |
| `dialog.tsx` | **create** when React stack is added |

---

## New workspace bootstrap

Minimal context for a clean LLM session:

1. Clone / vendor **`github.com/fastygo/templ`** (`go.mod` only — no React UI repo)
2. Add **`Templ/.project/dual-stack-component-library.md`** (this file)
3. Point agents at: `*.spec.md` → `*.variants.json` → `*.data.json` → runtime files
4. Reference apps (Blank SSR, Blank-Vite CSR) consume the library + own `tweakcn.css` + `ui8px`

Only syntax differs. The contract does not.
```

---

## Also add (optional small schemas)

**`.project/schemas/variants.schema.json`** — minimal:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id", "base", "keys", "defaults", "byKey"],
  "properties": {
    "id": { "type": "string" },
    "base": { "type": "string" },
    "keys": { "type": "array", "items": { "type": "string" } },
    "defaults": { "type": "object", "additionalProperties": { "type": "string" } },
    "byKey": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "additionalProperties": { "type": "string" }
      }
    }
  }
}
```