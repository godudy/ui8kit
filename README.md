# Templ component registry

shadcn-style **copy-paste** templ bricks for React developers onboarding to Go + templ.

## Layout

| Path | Role |
|------|------|
| [`utils/`](utils/) | **Only shared Go helpers** — CVA (`Compose`), `Cn`, attrs, ARIA, `tags.go`, form recipes |
| [`ui/`](ui/) | Primitives: button, badge, input, form, layout |
| [`components/`](components/) | Composites: card, alert, breadcrumb |
| [`components.json`](components.json) | Registry manifest (shadcn-style) |
| [`examples/`](examples/) | Optional local preview (server + Tailwind demo — not part of the library) |
| [`.validate/docs/component.spec.template.md`](.validate/docs/component.spec.template.md) | Spec template: `api` + `showcase` per brick |
| [`.validate/docs/README.md`](.validate/docs/README.md) | Local `validate-spec` command and registry checks |
| [`.cursor/rules/templ-component-spec.mdc`](.cursor/rules/templ-component-spec.mdc) | Authoring rule for specs and STE comments |
| [`utils/utils.spec.md`](utils/utils.spec.md) | Helper module export catalog (classes, attrs, recipes) |

No UI8Kit or Base dependency in default bricks. Optional Base adapters can be added per app at init time.

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

Before CI, run the component spec validator:

```bash
bash .validate/scripts/validate-spec.sh --with-tests
```

See [`.validate/docs/README.md`](.validate/docs/README.md) for checks and `components.json` alias expectations.
