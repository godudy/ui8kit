# `@ui8kit/aria` boundary

> Companion to [`dual-stack-component-library.md`](./dual-stack-component-library.md) and [`behavior-hooks-and-aria.md`](./behavior-hooks-and-aria.md).  
> Clarifies **why the Templ registry does not implement every W3C APG pattern** — and where client behaviour lives instead.

---

## Summary

`github.com/fastygo/templ` owns **markup structure, CVA styling, and static accessibility** (roles, labels, baseline HTML semantics).

[`@ui8kit/aria`](https://www.npmjs.com/package/@ui8kit/aria) owns **client-side interaction** for composite widgets: focus management, keyboard routing, ARIA state sync, and APG-style behaviour — bound to explicit `data-ui8kit*` DOM contracts.

The registry does **not** try to be a full W3C pattern catalog. It emits hooks only when an app opts in; the app (or preview) registers **only the patterns it actually ships in JS**.

---

## Two packages, one pipeline

```text
┌──────────────────────────────────────────────────────────────────┐
│ github.com/fastygo/templ (this repo)                             │
│  • ui/ + components/ bricks                                      │
│  • utils/ — Cn, Compose, static Aria* helpers                    │
│  • *.spec.md — API, semantics, showcase                          │
│  • Layer 1–2: SSR-safe HTML + typed a11y props                   │
│  • Layer 3 (optional): Behavior / DataUI8Kit → data-ui8kit* attrs  │
└────────────────────────────┬─────────────────────────────────────┘
                             │ markup contract only
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ @ui8kit/aria (npm — devDep in examples/, dep in consumer apps)   │
│  • TypeScript behaviour layer                                    │
│  • registerPattern({ name, init }) + getNamespace().init()         │
│  • Per-pattern bundles: dialog, tabs, combobox, menu, …          │
│  • Unit + E2E + a11y tests live in the aria package, not templ   │
└──────────────────────────────────────────────────────────────────┘
```

From `@ui8kit/aria` docs (`docs/why.md` in the package):

> Go templ + UI8Kit describe **structure and styling contracts**; this library owns **focus management, keyboard routing, and ARIA state sync**.

That split is intentional: server templates stay declarative; behavioural complexity stays in one versioned JS package.

---

## What `@ui8kit/aria` provides

The package ships **11 APG-aligned patterns** (see `docs/patterns/README.md` in `@ui8kit/aria`):

| Pattern | npm export | APG area |
|---------|------------|----------|
| Accordion | `@ui8kit/aria/accordion` | Expand/collapse sections |
| Alert | `@ui8kit/aria/alert` | Live regions |
| Combobox | `@ui8kit/aria/combobox` | Input + listbox |
| Dialog | `@ui8kit/aria/dialog` | Modal, sheet, alertdialog |
| Disclosure | `@ui8kit/aria/disclosure` | Show/hide trigger |
| Listbox | `@ui8kit/aria/listbox` | Options list |
| Menu | `@ui8kit/aria/menu` | Menu container |
| Menu button | `@ui8kit/aria/menubutton` | Button opens menu |
| Switch | `@ui8kit/aria/switch` | `role="switch"` |
| Tabs | `@ui8kit/aria/tabs` | Tablist + panels |
| Tooltip | `@ui8kit/aria/tooltip` | Hover/focus disclosure |

Each pattern documents:

- links to the **W3C APG** pattern;
- the **`data-ui8kit*` DOM contract** (e.g. `docs/patterns/dialog.md` in the package);
- implementation and tests under `src/patterns/<name>/` in the aria repo.

**Consumption modes** (package `README.md`):

1. **Pure ESM** — `registerPattern(dialog)` + `init()`; tree-shake unused patterns.
2. **Per-pattern side-effect** — `import '@ui8kit/aria/dialog'`.
3. **Full bundle** — `import '@ui8kit/aria/all'` or IIFE CDN → all patterns + `window.ui8kit`.

Importing the pure entry has **no side effects** on `window` until `getNamespace()` runs in a browser — SSR-safe for Go apps that load JS only on the client.

---

## What this registry provides (and does not)

### In scope (always)

- Semantic HTML and static ARIA via `utils` + typed props (`AriaLabel`, `AriaCurrent`, …).
- CVA appearance (`Variant`, `Size`) and additive `Class`.
- Documented `semantics` in `*.spec.md`.
- Optional **hook attributes** when `Behavior: "ui8kit"` or `DataUI8Kit` is set.

### Out of scope (by design)

- Focus traps, roving tabindex, arrow-key handlers, `aria-expanded` toggling at runtime.
- Implementing every APG pattern inside `.templ` files.
- Runtime validation of full W3C behaviour in the Go module.
- Shipping a canonical JS bundle with the copy-paste library.

Bricks like `ui/disclosure` or native `<dialog>` may use **static** semantics only. Full APG behaviour for disclosures, tabs, menus, etc. is added when the app registers the matching `@ui8kit/aria` pattern (or uses another CSR library such as Radix on the React side).

---

## Subset bundling: only what the app needs

`@ui8kit/aria` is designed for **incremental registration** — you do not load all 11 patterns unless you import `/all`.

### Templ `examples/` preview (this repo)

The local preview registers **dialog only**:

```js
// examples/scripts/ui8kit-entry.mjs
import { getNamespace, registerPattern, dialog } from "@ui8kit/aria";

registerPattern(dialog);
getNamespace().init();
```

Manifest ([`examples/web/static/js/manifest.json`](../examples/web/static/js/manifest.json)):

```json
{
  "ariaMode": "subset",
  "patterns": ["dialog"]
}
```

That is enough for **Sheet** demos (`Behavior: "ui8kit"` → `data-ui8kit="sheet"` + dialog pattern). The dialog pattern also covers sheet-shaped surfaces (`docs/patterns/dialog.md` in `@ui8kit/aria`).

`ui8px validate aria` in this repo checks **examples markup against this manifest** — not against the full APG catalog. A passing check means: *hooks in the preview match the patterns we actually bundle*, not *every W3C widget is covered*.

### Consumer apps (e.g. Blank)

Same model at app level:

1. Choose bricks + opt-in hooks in templ markup.
2. Build a **subset bundle** — register only patterns present in the UI.
3. Commit `manifest.json` listing those pattern names.
4. Run `ui8px validate aria` on app templ paths.

Add a pattern when you add UI that needs it — e.g. `registerPattern(tabs)` when tabbed chrome ships, not when the registry adds a static `Block`.

---

## Mapping: brick → aria pattern (when needed)

| Registry surface | Static layer (templ) | Client pattern (if interactive) |
|------------------|----------------------|----------------------------------|
| `components/sheet` + `Behavior: "ui8kit"` | `role="dialog"`, labels, hook attrs | `@ui8kit/aria/dialog` (sheet variant) |
| `ui/dialog` + `DataUI8Kit` | native `<dialog>` or hooks | `@ui8kit/aria/dialog` |
| `ui/disclosure` | `<details>` / static expanded | `@ui8kit/aria/disclosure` (if JS-driven) |
| `ui/switch` | checkbox + `SwitchAttrs` | `@ui8kit/aria/switch` (if not native) |
| Tabs (future app chrome) | tab markup + ARIA props | `@ui8kit/aria/tabs` |
| Combobox / select (future) | `ui/select` static | `@ui8kit/aria/combobox` or native `<select>` |

The registry documents **hook shape** in specs; `@ui8kit/aria` documents **runtime behaviour** and tests it.

---

## Dual-stack (React CSR)

On the React side, the same boundary applies:

| Layer | Go SSR | React CSR |
|-------|--------|-----------|
| Structure + classes | `*.templ` + `Class` | `*.tsx` + `className` |
| Static a11y | `utils` ARIA helpers | props / `lib/attrs` |
| Client behaviour | `@ui8kit/aria` subset bundle | Radix, React Aria, or `@ui8kit/aria` ESM |

Parity target: **equivalent user-facing accessibility**, not identical `data-ui8kit` attributes on every stack.

---

## Where tests live

| Concern | Tested in |
|---------|-----------|
| Spec API, enums, showcase | `github.com/fastygo/templ` — `.validate/validate-spec` |
| Tailwind class policy | `github.com/fastygo/templ` — `ui8px lint` |
| Markup ↔ registered patterns | Consumer / `examples` — `ui8px validate aria` + `manifest.json` |
| Keyboard, focus, APG behaviour | `@ui8kit/aria` — vitest, Playwright, `@a11y` |

Do not duplicate aria’s E2E suite inside the templ registry. Fix interaction bugs in `@ui8kit/aria`; fix hook markup and static semantics in templ bricks.

---

## Authoring rules

1. **Default bricks** — no `data-ui8kit` unless spec documents opt-in (`Behavior`, `DataUI8Kit`).
2. **New interactive widget in an app** — add aria pattern to JS bundle + manifest before enabling hooks on markup.
3. **Do not** embed aria source or reimplement pattern logic in `ui/` or `components/`.
4. **Do** link brick specs to the aria pattern doc when `Behavior: "ui8kit"` is used (e.g. Sheet → dialog pattern).
5. **React port** — use framework-idiomatic behaviour; refer to the same APG semantics, not necessarily `data-ui8kit`.

---

## Related docs

| Document | Role |
|----------|------|
| [`behavior-hooks-and-aria.md`](./behavior-hooks-and-aria.md) | Three layers: static / explicit Aria* / hooks |
| [`dual-stack-component-library.md`](./dual-stack-component-library.md) | Brick files, CVA, dual-target |
| [`examples/README.md`](../examples/README.md) | Preview server + ui8kit bundle |
| `@ui8kit/aria` `docs/README.md` | Canonical aria package docs (install dep to read locally) |
| `@ui8kit/aria` `docs/patterns/README.md` | APG index + DOM contracts |

---

## FAQ

**Why doesn’t `validate:aria` list every APG pattern?**  
Because the registry doesn’t ship every pattern — only the app’s **registered subset** must match markup.

**Is the templ library incomplete without all patterns?**  
No. Copy-paste bricks are complete for **static** use. Full APG behaviour is an **app concern**, composed via `@ui8kit/aria` (or CSR equivalents).

**When do I add a pattern to the bundle?**  
When you add UI that uses its `data-ui8kit` contract — not when a primitive is merely listed in the registry.

**Sheet uses dialog pattern?**  
Yes. `data-ui8kit="sheet"` is handled by the dialog pattern implementation; see aria `docs/patterns/dialog.md`.
