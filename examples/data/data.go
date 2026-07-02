// Package data owns the demo fixture JSON and block-level variant JSON for
// both the Go Templ and React Vite examples (and any future runtime example,
// e.g. Svelte or Vue). Fixtures and variant maps live here (not next to the
// block specs, and not inside any single runtime's example tree) so every
// stack reads them from one authoritative, runtime-neutral path. Go's
// //go:embed cannot cross package boundaries, so block packages consume
// these as byte slices rather than embedding locally.
//
// When you add a new block fixture:
//  1. Drop the JSON into this directory.
//  2. Add a `//go:embed <file>` binding below.
//  3. In the block's spec.md, set `data-package`/`data-var` (fixtures) or
//     `variants-package`/`variants-var` (block variant maps) so `blockgen`
//     wires the generated `page_gen.go` to the symbol here.
//
// A new runtime example (e.g. examples/svelte/) should alias or import
// directly from this package's JSON files — never from another runtime's
// example folder (e.g. examples/templ/ or examples/vite/).
package data

import _ "embed"

//go:embed home.data.json
var HomeDataJSON []byte

//go:embed dashboard.data.json
var DashboardDataJSON []byte

//go:embed home.variants.json
var HomeVariantsJSON []byte

//go:embed dashboard.variants.json
var DashboardVariantsJSON []byte
