# UI brick variants bridge

> Companion to [`dual-stack-component-library.md`](./dual-stack-component-library.md).

## Summary

Each `ui/<brick>/` folder owns a colocated `*.variants.json` recipe. Go runtimes load recipes through generated `brick_gen.go` files produced by `variantgen`.

## Pipeline

```bash
bun run generate
```

Runs:

1. `go run ./.validate/cmd/variantgen` — embed JSON → `ui/*/brick_gen.go`
2. `go run ./.validate/cmd/blockgen` — example blocks
3. `go tool templ generate ./...`

## File roles

| File | Role |
|------|------|
| `{brick}.variants.json` | Shared CVA recipe (Go + future React) |
| `{brick}.data.json` | Stack-neutral showcase fixtures |
| `{brick}.spec.md` | API contract with `variants:` / `data:` paths |
| `brick_gen.go` | Generated embed + `*Variants` var (do not edit) |
| `{brick}.templ` | Thin runtime; uses `Compose(*Variants, …)` |

## Go usage

```go
// brick_gen.go (generated)
var ButtonVariants = uiutils.MustParseVariantRecipe(buttonVariantsJSON).ToVariants()

// button.templ
return uiutils.Compose(ButtonVariants, map[string]string{
    "variant": p.Variant,
    "size":    p.Size,
}, p.Class)
```

## Authoring helpers

- `go run ./.validate/cmd/datagen` — lift `showcase[].props` into `*.data.json`
- `go run ./.validate/cmd/specmigrate` — add dual-stack front matter to legacy specs (one-time)

## Validation

`validate-spec` checks `allow-list-source: {file}.variants.json#{key}` against `api.enum` and ensures `data` refs match showcase ids.
