# Examples

Optional **local preview** for registry bricks. Not part of the copy-paste library — each consumer app owns its own tokens, Tailwind pipeline, and server.

## Preview server

From the **repository root**:

```bash
cd examples
bun install
bun run dev
```

Open http://127.0.0.1:8080/

Or without Bun scripts:

```bash
go tool templ generate ./examples
cd examples
npx @tailwindcss/cli -i ./web/static/css/input.css -o ./web/static/css/app.css --minify
bun build scripts/ui8kit-entry.mjs --outfile web/static/js/ui8kit.js --minify
go run -mod=mod ./cmd/server
```

The server lives at [`cmd/server/main.go`](cmd/server/main.go). It serves `examples.Page()` and static files from `examples/web/static/`.

## UI8Kit ARIA runtime (preview only)

The examples preview loads a **dialog-only** [`@ui8kit/aria`](https://www.npmjs.com/package/@ui8kit/aria) bundle so mobile Sheet menus (burger trigger, overlay, close) work in the browser. This runtime is **not** part of the copy-paste library — copied bricks stay opt-in via `Behavior: "ui8kit"` or `DataUI8Kit` props.

| File | Role |
|------|------|
| [`scripts/ui8kit-entry.mjs`](scripts/ui8kit-entry.mjs) | Registers the `dialog` pattern and calls `init()` |
| [`web/static/js/ui8kit.js`](web/static/js/ui8kit.js) | Generated bundle (`bun run build:js`) |
| [`web/static/js/manifest.json`](web/static/js/manifest.json) | Subset runtime metadata (`patterns: ["dialog"]`) |

Rebuild after changing the entry or upgrading `@ui8kit/aria`:

```bash
bun run build:js
```

## Tailwind CLI (shadcn-compatible tokens)

Registry components use semantic utilities (`bg-background`, `text-muted-foreground`, `border-border`, …). Your app must define matching CSS variables — the same model as [shadcn/ui](https://ui.shadcn.com/docs/theming).

1. Install Tailwind v4 CLI in your app (or use this folder’s `package.json` as a reference).
2. Create `input.css` with `@import "tailwindcss"` and `@source` globs that include:
   - vendored or module paths to `github.com/fastygo/templ/ui/**` and `components/**`
   - your own `.templ` / `*_templ.go` files
3. Add a `tokens.css` (or merge into `input.css`) with `:root` variables and `@theme inline` mappings — see [`web/static/css/tokens.css`](web/static/css/tokens.css) for a minimal wireframe set.
4. Build: `tailwindcss -i input.css -o app.css --minify`

Example `@source` paths (adjust to your layout):

```css
@import "tailwindcss";
@source "../../../ui/**/*.templ";
@source "../../../ui/**/*_templ.go";
@source "../../../components/**/*.templ";
@source "../../../components/**/*_templ.go";

@import "./tokens.css";
```

Replace token values per brand; the library does not ship a canonical theme.

## Files

| File | Role |
|------|------|
| `page.templ` | Document shell + CSS and UI8Kit script tags |
| `demo.templ` | `RegistryDemo()` composition |
| `cmd/server/main.go` | Minimal HTTP preview |
| `scripts/ui8kit-entry.mjs` | Dialog-only `@ui8kit/aria` entry |
| `web/static/css/input.css` | Tailwind entry + `@source` for this demo |
| `web/static/css/tokens.css` | Example shadcn-style CSS variables (demo only) |
| `web/static/js/ui8kit.js` | Generated ARIA runtime (preview only) |
| `web/static/js/manifest.json` | Subset pattern manifest for the preview bundle |

```templ
import "github.com/fastygo/templ/ui"
import cmp "github.com/fastygo/templ/components"

@ui.Block(ui.BlockProps{Tag: "main"}) { … }
@cmp.Card(cmp.CardProps{}) { … }
```
