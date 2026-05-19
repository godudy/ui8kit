# Templ component registry

shadcn-style **copy-paste** templ bricks for React developers onboarding to Go + templ.

## Layout

| Path | Role |
|------|------|
| [`utils/`](utils/) | **Only shared Go helpers** — CVA (`Compose`), `Cn`, attrs, ARIA, `tags.go`, form recipes |
| [`ui/`](ui/) | Primitives: button, badge, input, form, layout |
| [`components/`](components/) | Composites: card, alert, breadcrumb |
| [`components.json`](components.json) | Registry manifest (shadcn-style) |
| [`test/example/`](test/example/) | Live registry demo page (`Page`, `RegistryDemo`) |

No UI8Kit or Base dependency in default bricks. Optional Base adapters can be added per app at init time.

## Quick start

```bash
bun install
bun run dev
```

Open **http://127.0.0.1:8080/**

## Copy into your app

1. Copy [`utils/`](utils/) once (import `github.com/fastygo/templ/utils`, package `uiutils`).
2. Copy folders from `ui/button/`, `ui/input/`, `components/card/`, etc.
3. Update the `uiutils` import path in each `.templ` file to match your module.
4. Run `templ generate` and include `ui/**/*.templ` in your Tailwind `@source`.

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

## Scripts

| Script | Description |
|--------|-------------|
| `bun run templ` | Regenerate all `*_templ.go` |
| `bun run build:css` | Build Tailwind `app.css` |
| `bun run dev` | templ + css + preview server |
