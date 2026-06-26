# Behavior hooks and ARIA

> Companion to [`dual-stack-component-library.md`](./dual-stack-component-library.md).  
> Explains **opt-in client behavior**, **static accessibility**, and planned **ARIA contract** improvements across Go (templ) and React runtimes.  
> For the split with **`@ui8kit/aria`** (W3C APG behaviour vs registry markup), see [`ui8kit-aria-boundary.md`](./ui8kit-aria-boundary.md).

---

## Summary

Registry bricks are **framework-neutral by default**. They ship markup, CVA classes, and **static** accessibility semantics. **Client behavior** (open/close, focus trap, keyboard) is never implied unless the app opts in through explicit props such as `Behavior` or `DataUI8Kit`.

Static ARIA and identity props (`AriaLabel`, `AriaLabelledBy`, `ID`, …) are first-class API fields. Behavior hooks are a separate, optional layer that wires a brick to a client runtime (`@ui8kit/aria`, Radix, custom JS).

---

## Three layers (do not collapse)

| Layer | Purpose | Who owns it | Examples |
|-------|---------|-------------|----------|
| **1. Static semantics** | Correct roles and baseline a11y in HTML | Library (`utils`, brick markup) | `<dialog>`, `role="status"`, decorative `aria-hidden` |
| **2. Explicit ARIA props** | Named, typed props in spec `api:` | Author via props | `AriaLabel`, `AriaLabelledBy`, `AriaCurrent` |
| **3. Behavior hooks** | Opt-in markers for client JS | App chooses runtime | `Behavior: "ui8kit"`, `DataUI8Kit: "sheet"` |

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1 + 2 — always in brick (SSR-safe, no JS required)   │
│   variants.json + Class + explicit Aria* props + Attrs    │
└───────────────────────────────┬─────────────────────────────┘
                                │ optional
                                ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3 — behavior hooks (app enables per usage)            │
│   data-ui8kit*, Behavior enum, manifest / Radix / etc.      │
└─────────────────────────────────────────────────────────────┘
```

**Rule:** Layer 3 must never be required for Layer 1–2 to be valid, accessible HTML.

---

## What “opt-in” means

**Opt-in** = the brick does not emit behavior-hook attributes unless the caller passes a non-empty hook prop.

### `DataUI8Kit` (primitives / nav)

Used on `Dialog`, `Breadcrumb`, `Nav`, and similar bricks. When empty, **no** `data-ui8kit` attribute is rendered.

```go
// ui/dialog/dialog.templ — attribute only when set
if strings.TrimSpace(p.DataUI8Kit) != "" {
    attrs["data-ui8kit"] = p.DataUI8Kit
}
```

```templ
// Markup only — no client contract
@ui.Dialog(ui.DialogProps{AriaLabel: "Settings"}) { ... }

// App opts into a client pattern
@ui.Dialog(ui.DialogProps{AriaLabel: "Settings", DataUI8Kit: "dialog"}) { ... }
```

### `Behavior` (composites — Sheet family)

Used on `Sheet`, `SheetTrigger`, `SheetOverlay`, `SheetClose`. Only the value `"ui8kit"` activates dialog/sheet hooks; default is empty.

```go
// components/sheet/sheet.templ
if sheetBehavior(p.Behavior) == "ui8kit" {
    attrs["data-ui8kit"] = "sheet"
    attrs["data-ui8kit-dialog"] = true
}
```

```templ
// Static overlay markup — SSR works without JS
@cmp.Sheet(cmp.SheetProps{ID: "panel", AriaLabel: "Panel"}) { ... }

// Blank-style mobile nav — app loads ui8kit.js + manifest
@cmp.Sheet(cmp.SheetProps{ID: "panel", Behavior: "ui8kit", AriaLabel: "Menu"}) { ... }
```

See [`components/sheet/sheet.spec.md`](../components/sheet/sheet.spec.md) — `Behavior` is `role: behavior-hook`, `enum: ["", ui8kit]`, `default: ""`.

---

## What “framework-neutral” means

A default brick:

- does **not** depend on `@ui8kit/aria`, React, Radix, or any bundled client script;
- does **not** assume hydration or CSR;
- renders **valid static HTML** with Tailwind + documented semantics;
- leaves **how** to add interactivity to the consuming app.

| Consumer | Typical choice for Layer 3 |
|----------|----------------------------|
| Go SSR (Blank) | `Behavior: "ui8kit"` + committed `ui8kit.js` + `manifest.json` |
| React CSR (Blank-Vite) | Radix Dialog / Sheet, or local state — no `data-ui8kit` required |
| Static site | Layers 1–2 only |
| Custom stack | `Attrs` / spread props for app-specific `data-*` |

The library documents **semantics** in `*.spec.md`; each runtime implements behavior idiomatically.

---

## Static ARIA today (`utils`)

Shared helpers live in [`utils/utils.go`](../utils/utils.go) and are catalogued in [`utils/utils.spec.md`](../utils/utils.spec.md).

| Helper | Attribute | Typical use |
|--------|-----------|-------------|
| `AriaLabel` | `aria-label` | Icon-only controls |
| `AriaExpanded` | `aria-expanded` | Disclosures, triggers |
| `AriaControls` | `aria-controls` | Trigger → panel id |
| `AriaCurrent` | `aria-current` | Nav, breadcrumb active item |
| `AriaLive` | `aria-live` | Alert regions |
| `AriaModal` | `aria-modal` | Modal roots |
| `AriaPressed` | `aria-pressed` | Toggle buttons |
| `AriaHasPopup` | `aria-haspopup` | Menu / dialog triggers |
| `ControlAttrs` | id, role, tabindex, aria-label | Form controls |
| `SwitchAttrs` | role=switch, aria-checked | Switch on checkbox |
| `AlertAttrs` | role=status, aria-live=polite | Alert composite |
| `BreadcrumbRootAttrs` | aria-label, optional data-ui8kit | Breadcrumb nav |
| `BreadcrumbItemAttrs` | aria-current=page | Active crumb |

Bricks also declare **explicit props** on their struct when semantics are component-specific, for example:

- `Dialog`: `AriaLabel`, `AriaLabelledBy`, `AriaDescribedBy`
- `Sheet` parts: `AriaLabel`, `AriaLabelledBy`, `AriaDescribedBy`, `Open`
- `Button`: `AriaLabel`, disabled-link `aria-disabled`
- `Nav` / `NavLink`: `AriaCurrent`, `AriaLabel`

Escape hatch: `Attrs templ.Attributes` (Go) / HTML attribute spread (React) for rare attributes not yet in the typed API.

---

## Spec authoring: prop roles

When extending `api:` in `*.spec.md`, classify accessibility-related fields:

| `role` in spec | Meaning | CVA? | Example |
|----------------|---------|------|---------|
| `accessible-name` | Layer 2 — explicit naming | no | `AriaLabel` |
| `accessible-description` | Layer 2 — describedby | no | `AriaDescribedBy` |
| `landmark` / `identity` | Layer 1–2 | no | `ID`, `Tag` |
| `state` | Layer 2 — reflects UI state in HTML | no | `Open`, `Disabled` |
| `behavior-hook` | Layer 3 — client runtime | no | `Behavior`, `DataUI8Kit` |
| `html-attrs` | Layer 2 escape hatch | no | `Attrs` |

Document in `## Semantics`:

- which root element is used (`semantics.root`, `root-when-href`, …);
- which ARIA props are required for which showcase;
- that behavior hooks are optional and what they emit when enabled.

---

## Dual-stack (templ + React)

| Concern | Go / templ | React |
|---------|------------|-------|
| Static semantics | Native elements + utils helpers | Same roles/attrs on DOM |
| Explicit `Aria*` props | PascalCase struct fields | `aria-*` or `ariaLabel` per naming map |
| `Behavior` / `DataUI8Kit` | Emits `data-ui8kit*` when set | Usually **omitted** — use Radix/hooks instead |
| Focus trap, open state | Client script or native `<dialog>` | Component library state |

**Parity target:** same **accessible name**, **roles**, and **visibility** for each `*.data.json` showcase — not identical `data-*` hooks across stacks.

React `*.tsx` implementations should not hardcode `data-ui8kit` unless the app explicitly mirrors the Go SSR contract (e.g. shared markup snapshots).

---

## Known gaps and planned improvements

ARIA support is **good for static SSR** but **not yet uniform** across all bricks. Expect incremental hardening.

### 1. Inconsistent explicit props

Some bricks use typed `Aria*` fields; others rely only on `Attrs` or inline attribute logic. **Goal:** every interactive brick lists required a11y props in `api:` and implements them the same way.

| Gap | Direction |
|-----|-----------|
| Missing `AriaDescribedBy` on some primitives | Add to spec + struct where dialogs/forms need it |
| Mixed naming (`DataUI8Kit` vs `Behavior`) | Document in spec; consider unifying under `Behavior` enum long-term |
| `AriaLabelledBy` vs `AriaLabel` mutual exclusivity | Document in semantics; optional validator rule |

### 2. No shared `aria` recipe file (yet)

Variants live in `*.variants.json`. **Proposed:** optional `*.aria.json` or an `aria:` block in spec for static attribute recipes (e.g. alert defaults, decorative icon pattern) shared by Go and React codegen.

### 3. Validator coverage

Today [`.validate/`](../.validate/docs/README.md) checks enums and showcase fences. **Planned:**

- `api` fields with `role: accessible-name` must appear on interactive `kind` bricks;
- `showcase` entries that use icon-only buttons must include `AriaLabel` in `*.data.json`;
- `Behavior: ui8kit` showcase must list expected `data-*` keys for SSR snapshot tests.

### 4. Utils helper parity for React

Go has `AriaExpanded`, `MergeAttrs`, etc. **Planned:** thin `lib/attrs.ts` (or generated from `utils.spec.md`) so React bricks use the same attribute merge order as Go.

### 5. Native `<dialog>` vs overlay composites

`ui/dialog` uses native `<dialog>`; `components/sheet` uses `role="dialog"` on a div-like surface. Specs must keep semantics honest per brick — do not assume one dialog model for all overlays.

### 6. Behavior hook registry

`Behavior` currently allows `ui8kit` only on Sheet. **Future:** document allowed hook values in a small registry (e.g. `.project/behavior-hooks.json`) so apps and validators know which manifest entries each enum value requires.

---

## Implementation checklist (authors)

When adding or changing a brick:

1. Define **Layer 1–2** in `*.spec.md` (`semantics`, explicit `Aria*` in `api:`).
2. Implement static attrs in `*.templ` / `*.tsx` using `utils` helpers — not ad-hoc string keys unless new.
3. Add **Layer 3** only if the brick participates in a documented client pattern; default must be off.
4. Add showcase + `*.data.json` entries that prove accessible names for non-text children.
5. If using `Behavior: "ui8kit"`, reference the app manifest (Blank: `web/static/js/manifest.json`) in app docs — not in the brick library.
6. For React port, re-read `## Semantics` — implement behavior with Radix/state, not by copying every `data-ui8kit` attribute unless required.

---

## Related files

| File | Role |
|------|------|
| [`go-module-publishing.md`](./go-module-publishing.md) | `go get` vs npm, `export-ignore`, release |
| [`dual-stack-component-library.md`](./dual-stack-component-library.md) | Overall brick contract |
| [`ui8kit-aria-boundary.md`](./ui8kit-aria-boundary.md) | `@ui8kit/aria` vs registry — APG subset bundles |
| [`utils/utils.spec.md`](../utils/utils.spec.md) | Helper export catalog |
| [`components/sheet/sheet.spec.md`](../components/sheet/sheet.spec.md) | `Behavior` behavior-hook reference |
| [`ui/dialog/dialog.spec.md`](../ui/dialog/dialog.spec.md) | `DataUI8Kit` + native dialog semantics |
| [`.cursor/rules/templ-component-spec.mdc`](../.cursor/rules/templ-component-spec.mdc) | Spec authoring rules |

---

## FAQ

**Why not always use `data-ui8kit`?**  
It couples markup to one client bundle. SSR libraries should stay copy-paste friendly and runtime-agnostic.

**Is `Attrs` a replacement for typed ARIA?**  
No. `Attrs` is an escape hatch. Common accessibility fields belong in `api:` as typed props so specs, codegen, and tests stay strict.

**Will React bricks use `Behavior: "ui8kit"`?**  
Usually no. The same spec `semantics` apply; React implements Layer 3 with idiomatic CSR patterns. Parity is user-visible accessibility, not identical attributes.

**When is improving ARIA support expected?**  
As bricks gain `*.variants.json` / dual-stack ports, each `*.spec.md` should be audited for complete `Aria*` coverage and validator rules above.
