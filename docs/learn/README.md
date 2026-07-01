# Learn

Split-view lessons for the FastyGo Templ registry. Each lesson mirrors a real
`examples/` scaffold so you can open the React and Go Templ files side by side
and see one design contract expressed in two syntaxes.

## Lessons

| # | Topic | React file | Templ file | Level |
|---|-------|------------|------------|-------|
| 01 | Hero block | [`examples/vite/src/blocks/home/hero.tsx`](../examples/vite/src/blocks/home/hero.tsx) | [`examples/templ/ui/blocks/home/hero.templ`](../examples/templ/ui/blocks/home/hero.templ) | Block |
| — | Button brick | [`ui/button/button.tsx`](../ui/button/button.tsx) | [`ui/button/button.templ`](../ui/button/button.templ) | Primitive |
| — | Badge brick | [`ui/badge/badge.tsx`](../ui/badge/badge.tsx) | [`ui/badge/badge.templ`](../ui/badge/badge.templ) | Primitive |
| — | Card composite | [`components/card/card.tsx`](../components/card/card.tsx) | [`components/card/card.templ`](../components/card/card.templ) | Composite |

Planned lessons (not yet written):

- 02 Sidebar — `sidebar.tsx` / `sidebar.templ`
- 03 Sheet mobile menu — `mobile-sheet.tsx` / `mobile-sheet.templ`
- 04 Layout grammar — `Block`, `Box`, `Stack`, `Group`

## How to use these lessons

1. Open the React file in the left pane of your editor.
2. Open the matching Templ file in the right pane.
3. Read the lesson `README.md` for annotated differences.
4. Try the exercises at the bottom of each lesson.

For onboarding context, start with [`coming-from-shadcn.md`](coming-from-shadcn.md).

## Related docs

- [`architecture.md`](architecture.md) — dual-stack brick contract
- [`coming-from-shadcn.md`](coming-from-shadcn.md) — shadcn migration guide
