package main

// validateCVAPresence enforces that every field under a spec's `api:` block
// declares an explicit `cva: true` or `cva: false`.
//
// This is required for both primitive (`ui/*.spec.md`) and composite
// (`components/*.spec.md`) specs: `cva` tells a code generator (Templ, React,
// or a future Svelte/Vue runtime) whether the field feeds a `*.variants.json`
// recipe (`cva: true`) or is a plain HTML/identity/behavior prop that must be
// forwarded as-is (`cva: false`). Specs without an `api:` block (helper-layer
// specs like utils/*.spec.md) are skipped.
func validateCVAPresence(doc *specDoc, rel string) []validationError {
	api, _ := doc.fm["api"].(map[string]any)
	if api == nil {
		return nil
	}
	var errs []validationError
	for field, raw := range api {
		fm, _ := raw.(map[string]any)
		if fm == nil {
			continue
		}
		if _, ok := fm["cva"].(bool); ok {
			continue
		}
		errs = append(errs, validationError{rel, field, `missing required cva: true|false`})
	}
	return errs
}
