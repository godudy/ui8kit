# Templ component registry

> **Not [a-h/templ](https://github.com/a-h/templ).** This repository is a separate **component library** for Go UI: copy-paste `.templ` bricks, helpers, and specs. It is built **on top of** Adrian Hacker's excellent [templ](https://github.com/a-h/templ) project and uses the official code generator [`github.com/a-h/templ/cmd/templ`](https://github.com/a-h/templ) (via `go tool templ` in `go.mod`). We are grateful for that foundation — templ's design and tooling make a typed, server-rendered component workflow practical.
>
> The module path is **`github.com/fastygo/templ`** so imports read naturally in application code — for example `import "github.com/fastygo/templ/ui"` and `import cmp "github.com/fastygo/templ/components"`. That name reflects **where these components live**, not a claim to be the templ language or compiler. When you need templ itself, depend on **`github.com/a-h/templ`**; when you need this registry, depend on **`github.com/fastygo/templ`**.

shadcn-style **copy-paste** Templ bricks for building Go interfaces with a familiar component workflow.
The registry keeps the ergonomics React developers expect — props, variants, children, composition, and small colocated examples — while staying server-rendered, Go-native, and easy to copy into an app. The goal is not to recreate React in Go, but to bring its useful component discipline to Templ: predictable APIs, composable primitives, and application-owned styling.

## Layout

| Path | Role |
|------|------|
| [`utils/`](utils/) | **Only shared Go helpers** — CVA (`Compose`), `Cn`, attrs, ARIA, `tags.go`, form recipes |
| [`ui/`](ui/) | Primitives: button, badge, input, form controls, layout, media, links, dialog, disclosure |
| [`components/`](components/) | Composites: card, alert, breadcrumb, sheet, nav, icon badge |
| [`components.json`](components.json) | Registry manifest (shadcn-style) |
| [`examples/`](examples/) | Optional local preview (server, Tailwind, dialog-only `@ui8kit/aria` for Sheet demos) |
| [`.validate/docs/component.spec.template.md`](.validate/docs/component.spec.template.md) | Spec template: `api` + `showcase` per brick |
| [`.validate/docs/README.md`](.validate/docs/README.md) | Local `validate-spec` command and registry checks |
| [`.cursor/rules/templ-component-spec.mdc`](.cursor/rules/templ-component-spec.mdc) | Authoring rule for specs and STE comments |
| [`.cursor/rules/`](.cursor/rules/) | Agent rules — registry structure, ui8px, ARIA, examples, validation |
| [`.ui8px/policy/`](.ui8px/policy/) | Tailwind class policy (`ui/`, `components/`, `utils/`, `examples/`) |
| [`.project/go-module-publishing.md`](.project/go-module-publishing.md) | `go get` vs npm, `export-ignore`, release |
| [`.project/dual-stack-component-library.md`](.project/dual-stack-component-library.md) | Dual-stack brick contract |
| [`.project/ui8kit-aria-boundary.md`](.project/ui8kit-aria-boundary.md) | `@ui8kit/aria` vs registry — APG subset |
| [`.project/behavior-hooks-and-aria.md`](.project/behavior-hooks-and-aria.md) | Opt-in behavior hooks, static ARIA |
| [`utils/utils.spec.md`](utils/utils.spec.md) | Helper module export catalog (classes, attrs, recipes) |

Default bricks avoid app-specific runtime dependencies. Behavior hooks such as `data-ui8kit` are opt-in per component, so each consuming app can choose its own client layer.

## Copy into your app

1. Copy [`utils/`](utils/) once (import `github.com/fastygo/templ/utils`, package `uiutils`).
2. Copy folders from `ui/button/`, `ui/input/`, `components/card/`, etc.
3. Update the `uiutils` import path in each `.templ` file to match your module.
4. Run `templ generate` and include `ui/**/*.templ` in your Tailwind `@source`.
5. Define **your own** shadcn-compatible CSS variables (`--background`, `--primary`, …) in the consuming app — the library does not ship tokens.

## Local preview

See [`examples/README.md`](examples/README.md) for a minimal preview server and Tailwind setup.

## Usage

**Facade (recommended):**

```templ
import "github.com/fastygo/templ/ui"
import cmp "github.com/fastygo/templ/components"

@ui.Button(ui.ButtonProps{Variant: "outline", Size: "sm"}) {
  Save
}
@cmp.Card(cmp.CardProps{Variant: "default"}) {
  …
}
```

**Granular (optional):**

```templ
import "your/module/ui/button"

@button.Button(button.ButtonProps{Variant: "outline", Size: "sm"}) {
  Save
}
```

- **Variants:** `ButtonVariants` + `ButtonClasses(props)` — same mental model as `buttonVariants()` in React.
- **className:** `Class` field (additive; do not override size/variant utilities).
- **children:** `{ children... }` in the component body.
- **attrs:** `Attrs templ.Attributes` plus `ID`, `AriaLabel`, `Href`, etc.

## Generate templ

From the repository root:

```bash
go tool templ generate ./...
```

Or per package, e.g. `go tool templ generate ./ui/button`.

## Validate specs

Before CI, run the full registry check:

```bash
bun install
bun run verify
```

Or step by step:

```bash
bash .validate/scripts/validate-spec.sh --with-tests
bun run lint:ui8px
bun run validate:aria
go test ./...
```

`lint:ui8px` covers **`ui/`**, **`components/`**, **`utils/`**, and **`examples/`** against [`.ui8px/policy/`](.ui8px/policy/).

See [`.validate/docs/README.md`](.validate/docs/README.md) for spec checks and `components.json` alias expectations.

## License

MIT — see [LICENSE](LICENSE). Copyright (c) FastyGo.

This registry depends on [a-h/templ](https://github.com/a-h/templ); use and attribution for that project follow its own license and documentation.