# @ui8kit/core — Tests & Dev Playground

This folder supports two workflows:

1) **Dev Playground (browser)** — quickly view components while developing
2) **TDD (Vitest)** — write tests first for new logic/components, then implement

## Commands

Run from repository root:

```bash
# Browser playground (Vite, root=tests/)
bun run test:dev

# TDD loop
bun run test:watch

# One-off test run (CI style)
bun run test:run

# Coverage
bun run test:coverage
```

## Folder structure (minimal)

```
tests/
├── components/             # Component tests (TDD)
│   ├── Button.test.tsx
│   └── Card.test.tsx
├── setup/                  # Vitest setup (jsdom shims)
│   └── test-setup.ts
├── utils/                  # Shared test helpers
│   └── test-utils.tsx
├── styles/                 # Playground styles (Tailwind)
│   └── test-styles.css
├── config/                 # Tailwind/PostCSS config for playground
│   ├── postcss.config.js
│   ├── tailwind.config.tests.js
│   └── tsconfig.tests.json
├── index.html              # Playground HTML entry
└── main.tsx                # Playground React entry (Button/Card demos)
```

## Single source of truth (configs)

- **Vite playground**: `vite.test-dev.config.ts` (root config)
- **Vitest**: `vitest.config.ts` (root config)

## TDD policy (how we work)

- For any new logic or a new component:
  - **write a failing test first** (in `tests/components/`)
  - then implement the change in `src/`
  - make the test pass

## Writing tests

Use the shared render helper:

```tsx
import { render, screen } from '@tests/utils/test-utils';
import { Button } from '@/components/ui/Button';

it('renders a button', () => {
  render(<Button>Click</Button>);
  expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
});
```

### Why tests import from `src` (and not from `@ui8kit/core`)

For TDD we prefer importing the **exact module under test** from `src` (via `@/` aliases).
If you import from `@ui8kit/core`, the barrel exports can load many unrelated modules, which:
- makes coverage noisy,
- makes tests slower,
- and can hide what you're actually testing.

Use `@ui8kit/core` only for higher-level "consumer-like" integration tests.
