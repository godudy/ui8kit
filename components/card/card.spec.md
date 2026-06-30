---
id: components.card
layer: composite
kind: surface
package: github.com/fastygo/templ/components/card
facade: github.com/fastygo/templ/components
parts:
  - templ: Card
    props: [Class, Variant, Attrs]
  - templ: CardHeader
    props: [Class, Attrs]
    slot: header
  - templ: CardTitle
    props: [Class, As, Attrs]
    slot: title
  - templ: CardDescription
    props: [Class, Attrs]
    slot: description
  - templ: CardContent
    props: [Class, Attrs]
    slot: content
  - templ: CardFooter
    props: [Class, Attrs]
    slot: footer
api:
  Class:
    role: style-extension
    type: string
  Variant:
    role: appearance
    type: string
    enum: [default, raised, kpi, muted, ghost, compact, flat, accent]
    allow-list-source: card.variants.json#variant
    default: default
  AsChild:
    role: composition
    type: bool
    default: false
  Attrs:
    role: html-attrs
    type: templ.Attributes
  As:
    role: heading-level
    type: int
    enum: [1, 2, 3, 4, 5, 6]
    applies-to: CardTitle
    default: 2
showcase:
  - id: variant.default
    props: { Variant: default }
  - id: variant.raised
    props: { Variant: raised }
  - id: variant.kpi
    props: { Variant: kpi }
  - id: variant.muted
    props: { Variant: muted }
  - id: variant.ghost
    props: { Variant: ghost }
  - id: variant.compact
    props: { Variant: compact }
  - id: variant.flat
    props: { Variant: flat }
  - id: variant.accent
    props: { Variant: accent }
  - id: layout.header-only
    parts: [Card, CardHeader, CardTitle]
  - id: title.as-h3
    props: { Variant: default }
    parts: [Card, CardHeader, CardTitle]
  - id: composition.aschild-section
    props: { AsChild: true, Variant: default }
semantics:
  root: div
  role: none
  behavior: static
  title-root: h1 | h2 | h3 | h4 | h5 | h6
  description-root: p

---
## Summary

Card groups related content in one bordered surface.
Card uses header, content, and footer slots.
For semantic root elements (section, article), use `asChild` (React) or `CardClasses` (Go).

## Use Cases

- Show a form inside a panel
- Show KPI metrics in a dashboard block
- Show article preview with title and actions

## Semantics

- Card root is a `<div>` by default; for semantic roots use `asChild` (React) or wrap manually with `CardClasses` (Go)
- CardTitle maps As to h1-h6 (default h2)
- CardDescription renders a p element
- Card parts compose in document order

## Example variant.default

```templ
import "github.com/fastygo/templ/ui"
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "default"}) {
		@cmp.CardHeader(cmp.CardHeaderProps{}) {
			@cmp.CardTitle(cmp.CardTitleProps{As: 2}) { { "Card title" } }
			@cmp.CardDescription(cmp.CardDescriptionProps{}) { { "Short supporting text." } }
		}
		@cmp.CardContent(cmp.CardContentProps{}) {
			@ui.Text(ui.TextProps{}) { { "Main card body." } }
		}
		@cmp.CardFooter(cmp.CardFooterProps{}) {
			@ui.Button(ui.ButtonProps{Variant: "outline", Size: "sm"}) {
				Action
			}
		}
	}
}
```

## Example variant.raised

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "raised"}) {
		@cmp.CardContent(cmp.CardContentProps{}) {
			Raised surface
		}
	}
}
```

## Example variant.kpi

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "kpi"}) {
		@cmp.CardHeader(cmp.CardHeaderProps{}) {
			@cmp.CardTitle(cmp.CardTitleProps{As: 2}) { { "Revenue" } }
		}
		@cmp.CardContent(cmp.CardContentProps{}) {
			$12,450
		}
	}
}
```

## Example variant.muted

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "muted"}) {
		@cmp.CardContent(cmp.CardContentProps{}) {
			Muted surface
		}
	}
}
```

## Example variant.ghost

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "ghost"}) {
		@cmp.CardContent(cmp.CardContentProps{}) {
			Ghost dashed border
		}
	}
}
```

## Example variant.compact

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "compact"}) {
		@cmp.CardContent(cmp.CardContentProps{}) {
			Compact padding
		}
	}
}
```

## Example variant.flat

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "flat"}) {
		@cmp.CardContent(cmp.CardContentProps{}) {
			Flat no shadow
		}
	}
}
```

## Example variant.accent

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{Variant: "accent"}) {
		@cmp.CardContent(cmp.CardContentProps{}) {
			Accent highlight
		}
	}
}
```

## Example layout.header-only

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{}) {
		@cmp.CardHeader(cmp.CardHeaderProps{}) {
			@cmp.CardTitle(cmp.CardTitleProps{As: 2}) { { "Title only" } }
		}
	}
}
```

## Example title.as-h3

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	@cmp.Card(cmp.CardProps{}) {
		@cmp.CardHeader(cmp.CardHeaderProps{}) {
			@cmp.CardTitle(cmp.CardTitleProps{As: 3}) { { "Nested section title" } }
		}
	}
}
```

## Example composition.aschild-section

React only — `asChild` merges Card classes onto the child section:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@registry/components";

export function Example() {
  return (
    <Card asChild variant="default">
      <section>
        <CardHeader>
          <CardTitle as={2}>Section card</CardTitle>
          <CardDescription>Semantic root via asChild.</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
      </section>
    </Card>
  );
}
```

Go equivalent — use `CardClasses` on a manual wrapper:

```templ
import cmp "github.com/fastygo/templ/components"

templ Example() {
	<section class={ cmp.CardClasses(cmp.CardProps{Variant: "default"}) }>
		@cmp.CardHeader(cmp.CardHeaderProps{}) {
			@cmp.CardTitle(cmp.CardTitleProps{As: 2}) { { "Section card" } }
		}
		@cmp.CardContent(cmp.CardContentProps{}) {
			Body
		}
	</section>
}
```
