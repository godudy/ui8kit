# Documentation

Long-lived project documentation lives here. Cursor/LLM operating rules live in
`.cursor/rules`; machine-readable brick contracts live in colocated
`*.spec.md`, `*.variants.json`, and `*.data.json` files.

## Guides

- [`architecture.md`](architecture.md) — dual-stack component contract for Go
  Templ SSR and React TSX.
- [`aria.md`](aria.md) — static ARIA, behavior hooks, `@ui8kit/aria`, and the
  Sheet dialog contract.
- [`coming-from-shadcn.md`](coming-from-shadcn.md) — onboarding notes for
  developers familiar with shadcn.
- [`publishing.md`](publishing.md) — Go module vs future npm delivery model.

## Rule Files

Use `.cursor/rules` for agent-facing operational guidance:

- `templ-registry-structure.mdc`
- `templ-component-spec.mdc`
- `templ-layout-grammar.mdc`
- `templ-atomic-ui8px.mdc`
- `templ-aria.mdc`
- `templ-react-port.mdc`
- `templ-validation-testing.mdc`
- `templ-spec-driver.mdc`
