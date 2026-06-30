# Coming From shadcn

The registry keeps the familiar shadcn ergonomics: props, variants, children,
`cn`, and `asChild`. The differences exist to support both Go Templ SSR and
React TSX from the same contract.

## Main Differences

| shadcn habit | Registry rule |
|--------------|---------------|
| Components are React-only | Every brick has a runtime-neutral spec |
| Variants live in TS | Variants live in colocated `*.variants.json` |
| `className` can do everything | `Class` / `className` is additive; named variants carry design intent |
| Raw `<div>` layout is common | Use `Block`, `Box`, `Stack`, `Group` |
| Client behavior often lives in React | APG behavior lives in `@ui8kit/aria` and is opt-in |

## Layout Grammar

Use layout primitives instead of raw container markup:

```tsx
<Block tag="aside" className="hidden w-64 md:flex md:flex-col">
  <Box className="flex h-16 items-center gap-4 border-b">
    <IconBadge size="sm" variant="accent">BY</IconBadge>
    <Stack className="gap-0">
      <Inline className="text-sm font-semibold">Brand</Inline>
      <Inline className="text-xs text-muted-foreground">Workspace catalog</Inline>
    </Stack>
  </Box>
</Block>
```

Choose primitives by intent:

- `Block` starts a file/block exactly once. It may default to `<div>` when the
  widget is not a landmark.
- `Box` is an inner non-landmark container.
- `Stack` is vertical flow.
- `Group` is horizontal grouping, or `fieldset` for related form controls.

See `.cursor/rules/templ-layout-grammar.mdc`.

## Text And Headings

- `Text` renders paragraph text.
- `Inline` renders inline `<span>` text.
- Use heading helpers (`H1`-`H6`) or the documented `Title` API instead of
  ad-hoc heading order props.

## Variants

There is no `unstyled` variant.

If an appearance does not fit:

1. Add a named variant to `*.variants.json`.
2. Or use `asChild` and take responsibility for the child element's classes.

The first option is preferred because it keeps tokens and examples centralized.

## `asChild`

React uses Radix-style `asChild` composition for roots and triggers:

```tsx
<Button asChild variant="outline" size="sm">
  <a href="/docs">Docs</a>
</Button>
```

The Go side uses generated class helpers when a semantic wrapper is required:

```templ
<article class={ cmp.CardClasses(cmp.CardProps{Variant: "default"}) }>
  ...
</article>
```

## Card

Use named exports only:

```tsx
<Card variant="default">
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

Dot notation (`Card.Header`) is intentionally not supported. One composition
style is easier for junior developers, reviewers, and LLMs.

## Sheet

`Sheet` is declarative markup plus `@ui8kit/aria` behavior:

```tsx
<Sheet id="mobile-panel" behavior="ui8kit" aria-label="Navigation menu">
  <SheetOverlay target="mobile-panel" behavior="ui8kit" />
  <SheetContent>...</SheetContent>
</Sheet>
```

Do not write custom React state logic for runtime open/close. `open` is only
initial SSR state when `behavior="ui8kit"` is active.

## Feature Parity TSX <-> Templ

| Feature | TSX | Templ | Workaround |
|---------|-----|-------|------------|
| `asChild` / `Slot` | yes | no | use `XClasses(p)` on a manual semantic wrapper |
| `forwardRef` | yes | n/a | SSR has no refs |
| `onClick` / events | yes | n/a | SSR is event-free; use `ui8kit` ARIA hooks for behavior |
| children API | `{children}` | `{ children... }` | same model |

## Naming Conversion

| TSX prop | Templ field | Rule |
|----------|-------------|------|
| `className` | `Class` | special case (drop "Name", PascalCase) |
| `tag` | `Tag` | PascalCase |
| `htmlFor` | `HTMLFor` | acronym uppercased |
| `aria-label` | `AriaLabel` | kebab -> PascalCase |
| `data-ui8kit` | `DataUI8Kit` | kebab + acronym uppercased |

## Test Contract

New React-capable bricks should declare their test target in the spec:

```yaml
targets:
  react:
    component: Sheet
    facade: '@fastygo/templ-react'
    test: ../../examples/vite/tests/sheet-ui8kit-contract.test.tsx
```

`validate-spec` verifies that the referenced test exists.
