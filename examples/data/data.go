// Package data owns the demo fixture JSON for both the Go Templ and React
// Vite examples. Fixtures live here (not next to the block specs) so both
// stacks read them from one authoritative path. Go's //go:embed cannot cross
// package boundaries, so block packages consume these as byte slices rather
// than embedding locally.
//
// When you add a new block fixture:
//  1. Drop the JSON into this directory.
//  2. Add a `//go:embed <file>` binding below.
//  3. In the block's spec.md, set `data-package` and `data-var` so
//     `blockgen` wires the generated `page_gen.go` to the symbol here.
package data

import _ "embed"

//go:embed home.data.json
var HomeDataJSON []byte

//go:embed dashboard.data.json
var DashboardDataJSON []byte
