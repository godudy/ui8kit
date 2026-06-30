# Coming from shadcn

This registry keeps the shadcn mental model: props, variants, children,
composition, `cn`, and `asChild`. The differences are intentional and are
mainly about dual-runtime parity (Templ + React).

## Layout grammar

Every block opens with `Block`. `Box` is internal-only and intentionally
restricted to non-landmark tags. `Stack` is vertical flow; `Group` is
horizontal grouping.

See [`.cursor/rules/templ-layout-grammar.mdc`](../.cursor/rules/templ-layout-grammar.mdc).

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

## Layout primitive tag policy

| Primitive | Default tag | Allowed `tag` values | Notes |
|-----------|-------------|----------------------|-------|
| `Block` | `div` | Any layout landmark (`aside`, `section`, `header`, `nav`, …) | Opens a block; flexible because widget files may use any container |
| `Box` | `div` | `div` only | Inner container; no landmarks |
| `Stack` | `div` | `div`, `ul`, `ol` | Vertical flex; landmarks belong on `Block` |
| `Group` | `div` | `div`, `fieldset`, `dl` | Horizontal flex; use `fieldset` for related form controls |

`Block` and `Box` stay flexible on purpose — a sidebar widget in its own file
may need any container tag. `Stack` and `Group` are stricter so landmarks are
not duplicated through the wrong primitive.

## Inline vs Text

- `<Text>` renders `<p>` (block). Use for paragraphs and field labels.
- `<Inline>` renders `<span>` (inline). Use inside `Stack` / `Group` when the
  wrapper is already a block.
- `<Text tag="span">` no longer exists — use `<Inline>` instead.

## Variants and `cn`

- Variant and size classes live in colocated `*.variants.json` files.
- Both Templ and React consume the same recipe source.
- `cn` is `clsx + tailwind-merge`, and caller `className` still wins.

### Skipping variants

Pass `variant="unstyled"` to skip recipe variant classes entirely (the recipe
`base` string still applies). Use it when you want to supply all visual classes
through `className` alone:

```tsx
<Button variant="unstyled" className="rounded-full p-2">
  Custom
</Button>
```

## `asChild`

Clickable bricks support `asChild` through a shared `Slot`:

```tsx
<Button asChild variant="outline" size="sm">
  <a href="/docs">Learn more</a>
</Button>
```

`SheetTrigger` and `SheetClose` also support `asChild` for anchor triggers.

## Headings

Use `H1`...`H6` when heading level is static:

```tsx
<H1>Catalog</H1>
<H2>Templates</H2>
<H3>Card title</H3>
```

Use `Title as={n}` only when heading level is dynamic at runtime.

## Card compound API

`Card` supports both named exports and compound members:

```tsx
<Card variant="default">
  <Card.Header>
    <Card.Title>Revenue</Card.Title>
  </Card.Header>
  <Card.Content>...</Card.Content>
</Card>
```

Named exports (`CardHeader`, `CardTitle`, `CardContent`, etc.) remain available.

## Behavior hooks (`ui8kit`)

`Sheet` with `behavior="ui8kit"` emits `data-ui8kit-*` hook attributes.
Open/close runtime is owned by `@ui8kit/aria` on **both** Templ and React —
no `useState` / `onOpenChange` on Sheet parts.

### Sheet open contract

`open` on `Sheet`, `SheetTrigger`, and `SheetOverlay` sets **initial** SSR
state only (`hidden`, `data-state`, `aria-expanded`). When `behavior="ui8kit"`,
React freezes those attributes on the first commit; `@ui8kit/aria` owns all
runtime toggling. Do not bind `open` to changing React state.

`Dialog` (center modal) still accepts `open` / `onOpenChange` for native
`<dialog>` control. See [`ui8kit-aria-boundary.md`](./ui8kit-aria-boundary.md).

```tsx
<Sheet id="nav-panel" behavior="ui8kit" aria-label="Navigation">
  <SheetOverlay target="nav-panel" behavior="ui8kit" />
  <SheetContent>…</SheetContent>
</Sheet>
<SheetTrigger target="nav-panel" behavior="ui8kit">Open</SheetTrigger>
```

## Two runtimes, one design

- Go (`examples/templ`) covers SSR.
- React (`examples/vite`) covers SPA.
- Both consume the same specs and recipes (`*.spec.md`, `*.variants.json`,
  `*.data.json`) and the same design tokens.
