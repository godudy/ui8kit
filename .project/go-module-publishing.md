# Go module publishing vs React (npm)

> Companion to [`dual-stack-component-library.md`](./dual-stack-component-library.md).  
> Clarifies **what `go get` / `go mod vendor` ship**, what **npm** ships, and **how to control** the Go module zip without confusing the two runtimes.

---

## Summary

`github.com/fastygo/templ` is a **Go module** (`go.mod`). React bricks (`*.tsx`) and npm tooling live in the **same git repo** for authoring, but they are **not** delivered through `go mod download` as JavaScript dependencies.

- **Go consumers** — `go get`, `go mod vendor`, `import "github.com/fastygo/templ/ui"`.
- **React consumers** — `npm install` (future package, e.g. `@fastygo/templ-react`) or copy-paste from the repo.
- **Shared contract** — `*.spec.md`, `*.variants.json`, `*.data.json` in git; both runtimes implement the same design rules.

`release.yml` and [`scripts/release.sh`](../scripts/release.sh) **tag and index the Go module**; they do **not** filter which files enter the module zip. Use **`.gitattributes` `export-ignore`** for that.

---

## Two delivery channels

```text
                    ┌─────────────────────────────┐
                    │  One git repo (authoring)    │
                    │  ui/button/                  │
                    │    button.spec.md            │
                    │    button.variants.json      │
                    │    button.templ              │
                    │    button.tsx   (optional)   │
                    └───────────┬─────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              ▼                                   ▼
   ┌──────────────────────┐         ┌──────────────────────┐
   │ Go module (proxy)     │         │ npm package (future)  │
   │ go get …/templ@v1.2.3 │         │ npm i @fastygo/…      │
   └──────────────────────┘         └──────────────────────┘
              │                                   │
              ▼                                   ▼
   Blank, SSR apps                      Blank-Vite, CSR apps
   templ generate + @source            Vite + import Button
```

| Question | Answer |
|----------|--------|
| Does React ride along with `go mod vendor`? | **No** — vendor copies **Go modules** only. npm is never pulled by `go mod`. |
| Can `.tsx` files appear in the Go module zip? | **Yes**, if committed at the tag and **not** listed in `export-ignore`. Go ignores them; they are dead files in the module cache. |
| Does `release.yml` strip React from the Go zip? | **No** — it creates a GitHub Release and triggers `proxy.golang.org` indexing for the **git tag as archived**. |
| How do we keep the Go zip lean? | **`.gitattributes` `export-ignore`** on paths that Go consumers do not need. |

---

## What Go consumers receive today

Module path ([`go.mod`](../go.mod)):

```go
module github.com/fastygo/templ
```

After:

```bash
go get github.com/fastygo/templ@v0.1.2
# or in the app repo:
go mod vendor
```

they get a zip of **everything committed at that tag** (minus `export-ignore`), typically:

| Included (useful to Go) | Usually excluded |
|-------------------------|------------------|
| `ui/`, `components/`, `utils/` — `.templ`, `*_templ.go`, `.spec.md` | `node_modules/` (`.gitignore`) |
| `go.mod`, `go.sum`, `LICENSE` | Uncommitted local files |
| `*.variants.json` when added | Paths with `export-ignore` (recommended) |

Example: Blank vendors the library under `vendor/github.com/fastygo/templ/` — bricks and specs, **not** `examples/`, **not** npm artifacts from this repo.

Application usage:

```go
import "github.com/fastygo/templ/ui"
import cmp "github.com/fastygo/templ/components"
```

Plus `go tool templ generate` and Tailwind `@source` globs pointing at the module or vendor tree. **No React build step** is required for Go-only apps.

---

## What React consumers need

React bricks are **not** imported via Go:

```ts
// future — separate npm surface
import { Button } from "@fastygo/templ-react/ui/button";
```

They need:

- published **npm package** (or copy-paste `*.tsx` + `variants` from the repo);
- app-owned **tokens** (`tweakcn.css` / CSS variables);
- **Vite** (or similar) — not `go mod`.

Shared **design contract** (`*.spec.md`, `*.variants.json`) stays in git; Go and npm releases should bump versions in lockstep when the contract changes.

---

## How Go publishing works in this repo

### Tag + push

[`scripts/release.sh`](../scripts/release.sh):

```bash
./scripts/release.sh 0.2.0
git push origin v0.2.0
```

Creates annotated tag `v0.2.0` for `$(go list -m)` → `github.com/fastygo/templ`.

### CI ([`.github/workflows/release.yml`](../.github/workflows/release.yml))

On push tag `v*`:

1. GitHub Release (release notes).
2. `GOPROXY=proxy.golang.org go list -m "${MODULE}@${TAG}"` — warms the public module proxy.

The workflow does **not**:

- run `npm publish`;
- strip files from the module;
- split Go vs React artifacts.

Those are separate steps (below).

---

## Controlling the Go module zip: `export-ignore`

The Go module proxy builds the zip from **`git archive` at the tag**. Git respects **`export-ignore`** in [`.gitattributes`](../.gitattributes) (add when dual-stack files land in the repo).

Recommended exclusions from the **Go module zip** (keep in git for dev):

```gitattributes
# Dev / preview — not needed in go get zip
examples/           export-ignore
.github/            export-ignore
.cursor/            export-ignore
.project/           export-ignore
.validate/          export-ignore

# Node tooling — never in module (node_modules already gitignored)
package.json        export-ignore
bun.lock            export-ignore
node_modules/       export-ignore

# React runtime — ship via npm, not go get
**/*.tsx            export-ignore
```

| Location | In git clone | In Go module zip (`go get`) |
|----------|--------------|-----------------------------|
| `ui/button/button.templ` | yes | yes |
| `ui/button/button.spec.md` | yes | yes (docs for humans/LLM) |
| `ui/button/button.variants.json` | yes | yes |
| `ui/button/button.tsx` | yes | **no** (with `export-ignore`) |
| `examples/` | yes | **no** |
| `.project/` | yes | **no** |

**Rule:** `export-ignore` affects **module consumers** (proxy zip), not your local clone.

---

## Monorepo layout (recommended)

Single repo for authoring; two publish surfaces:

```text
github.com/fastygo/templ/
  go.mod                          # Go module root
  ui/ … components/ … utils/      # in Go zip
  package.json                    # root tooling (ui8px, verify) — export-ignore
  react/                          # optional: npm package root — export-ignore entire dir
    package.json
    src/ui/button/Button.tsx
  .gitattributes                  # export-ignore rules
```

Alternative: npm package name `@fastygo/templ-react` from `react/` subfolder, versioned independently but tagged together in changelog.

---

## `release.yml` — what to add later (optional)

| Job | Purpose |
|-----|---------|
| `bun run verify` | spec + ui8px + aria + tests before tag (manual or on tag) |
| `npm publish` in `react/` | React surface, separate from Go proxy |
| Checksum / version sync | same semver on Go tag and npm when contract changes |

None of this replaces `export-ignore` for the Go zip.

---

## FAQ

**Will `go mod download` install `@ui8kit/aria`?**  
No. `@ui8kit/aria` is npm-only. Go apps add it in **their** `package.json` (see [`ui8kit-aria-boundary.md`](./ui8kit-aria-boundary.md)).

**Should `*.spec.md` be in the Go zip?**  
Yes, unless you prefer a slimmer module — they are small and useful for vendored copy-paste workflows. Optional `export-ignore` on `**/*.spec.md` if size matters.

**Can one tag publish both Go and npm?**  
Yes — same git tag, two jobs: proxy indexes Go module; `npm publish` reads from `react/` (or root package with `files` whitelist in `package.json`).

**Does dual-stack mean one `go.mod` import for React?**  
No. Dual-stack means **one design contract**, **two runtimes**. Go import path stays `github.com/fastygo/templ/...`; React uses npm (or copy-paste), not `go mod`.

---

## Related docs

| File | Role |
|------|------|
| [`dual-stack-component-library.md`](./dual-stack-component-library.md) | Per-brick files, CVA, spec |
| [`behavior-hooks-and-aria.md`](./behavior-hooks-and-aria.md) | Static ARIA + opt-in hooks in bricks |
| [`ui8kit-aria-boundary.md`](./ui8kit-aria-boundary.md) | `@ui8kit/aria` vs registry |
| [`../README.md`](../README.md) | Copy-paste and validate commands |
| [`../scripts/release.sh`](../scripts/release.sh) | Tag helper |
| [`../.github/workflows/release.yml`](../.github/workflows/release.yml) | Release + Go proxy |
