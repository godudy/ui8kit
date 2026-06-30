# Dual-Stack Component Architecture

This repository is one design system with two runtimes:

- Go Templ for SSR.
- React TSX for SPA/Vite usage.

The design contract is shared. Runtime files are thin implementations of the
same contract.

## Source Of Truth

Each brick lives under `ui/<brick>/` or `components/<brick>/`:

```text
button.spec.md        # API, semantics, showcase, target metadata
button.variants.json  # shared variant recipe
button.data.json      # optional showcase fixtures
button.templ          # Go Templ runtime
button.tsx            # React runtime
```

If a prop, variant, semantic rule, or showcase state is not represented in the
spec and variant files, it is not part of the public contract.

## Runtime Parity

Templ and React use different syntax but the same concepts:

| Contract | Templ | React |
|----------|-------|-------|
| CSS extension | `Class` | `className` |
| Variant recipe | `Compose(*Variants, ...)` | `composeRecipe(recipe, ...)` |
| Children | `{ children... }` | `children` |
| Root delegation | `CardClasses(...)` on manual wrapper | `asChild` + `Slot` |
| Behavior hooks | `Behavior: "ui8kit"` | `behavior="ui8kit"` |

React may expose native React ergonomics (`htmlFor`, `onClick`, `ref`) where
Templ uses Go field names (`HTMLFor`, `Attrs`), but the rendered semantics and
variant choices must remain aligned.

## Variants

Variant class strings live only in `*.variants.json`.

Rules:

- `defaults[k]` must reference a real non-empty key in `byKey[k]`.
- Empty-string variant keys are forbidden.
- There is no universal `unstyled` escape hatch.
- If a new visual state is needed, add a named variant to the recipe.
- Caller `Class` / `className` is additive and merged last.

Validation:

```bash
go run ./.validate/cmd/variantcheck
bash .validate/scripts/validate-spec.sh --with-tests
```

## Layout Grammar

All runtimes follow the same layout grammar:

- `Block` opens a block exactly once per file.
- `Box` is an inner container.
- `Stack` is vertical rhythm.
- `Group` is horizontal grouping.
- Raw layout markup is not written directly in bricks or blocks.

See `.cursor/rules/templ-layout-grammar.mdc`.

## Test Contract

Specs may declare a React test target:

```yaml
targets:
  react:
    component: Sheet
    facade: '@fastygo/templ-react'
    test: ../../examples/vite/tests/sheet-ui8kit-contract.test.tsx
```

When `targets.react.test` is present, `validate-spec` requires the referenced
`.test.tsx` or `.test.ts` file to exist.

## Validation Pipeline

Use the combined check before considering architecture changes done:

```bash
bun run verify
```

This runs variant checks, block grammar checks, spec validation, React
typecheck, ui8px lint, ARIA manifest validation, focused React tests, and Go
tests.
