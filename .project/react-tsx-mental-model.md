# Templ to React mental model

This registry now keeps the same contract for both runtimes:

- `*.spec.md`, `*.variants.json`, and `*.data.json` stay authoritative.
- React keeps colocated recipes (`import recipe from "./x.variants.json"`), just like Templ uses generated `*Variants`.
- `Class` in Templ maps to `className` in React.
- `Tag` in Templ maps to `tag` in React.
- Static markup stays static: React does not need behavior hooks unless the component explicitly opts into them (`Sheet` with `behavior="ui8kit"`).

## Primitive example

```templ
import "github.com/fastygo/templ/ui"

@ui.Button(ui.ButtonProps{
  Variant: "outline",
  Size: "sm",
  Class: "w-full",
}) {
  Save
}
```

```tsx
import { Button } from "@fastygo/templ-react/ui";

<Button variant="outline" size="sm" className="w-full">
  Save
</Button>;
```

## Composite example

```templ
import cmp "github.com/fastygo/templ/components"

@cmp.Card(cmp.CardProps{Tag: "article", Variant: "accent"}) {
  @cmp.CardHeader(cmp.CardHeaderProps{}) {
    @cmp.CardTitle(cmp.CardTitleProps{Order: 3}, "Revenue")
  }
}
```

```tsx
import { Card, CardHeader, CardTitle } from "@fastygo/templ-react/components";

<Card tag="article" variant="accent">
  <CardHeader>
    <CardTitle order={3}>Revenue</CardTitle>
  </CardHeader>
</Card>;
```

## Notes for shadcn-style usage

- Use native React props first (`ComponentPropsWithoutRef<"button">` style ergonomics).
- Prefer direct JSX and local `Tag` resolution over wrapper abstractions.
- Keep `className` merged last in each component so app overrides remain predictable.
- Use `className` for custom layout utilities; variant props stay bounded to the spec contract.
