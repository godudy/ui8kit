# Registry example page

Live composition of all phase-1 registry bricks. Uses **Block** for landmarks (`main`, `header`, `section`, `footer`) and **Box** / **Stack** for internal layout — see UI8Kit block/box semantics.

## Preview

From repo root:

```bash
bun run dev
```

Open http://127.0.0.1:8080/ — served by `cmd/server` with `/static/css/app.css`.

## Files

| File | Role |
|------|------|
| `page.templ` | Document shell + stylesheet link |
| `demo.templ` | `RegistryDemo()` composition |

Copy these into your app or use them as a reference when adding bricks.

```templ
import "github.com/fastygo/templ/ui"
import cmp "github.com/fastygo/templ/components"

@ui.Block(ui.BlockProps{Tag: "main"}) { … }
@cmp.Card(cmp.CardProps{}) { … }
```
