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
go run -mod=mod ./cmd/server
```

The server lives at [`cmd/server/main.go`](cmd/server/main.go). It serves `examples.Page()` and static files from `examples/web/static/`.

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
| `page.templ` | Document shell + stylesheet link |
| `demo.templ` | `RegistryDemo()` composition |
| `cmd/server/main.go` | Minimal HTTP preview |
| `web/static/css/input.css` | Tailwind entry + `@source` for this demo |
| `web/static/css/tokens.css` | Example shadcn-style CSS variables (demo only) |

```templ
import "github.com/fastygo/templ/ui"
import cmp "github.com/fastygo/templ/components"

@ui.Block(ui.BlockProps{Tag: "main"}) { … }
@cmp.Card(cmp.CardProps{}) { … }
```
