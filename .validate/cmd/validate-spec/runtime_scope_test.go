package main

import "testing"

func TestValidateRuntimeScopedAPIFieldsRequiresBoolean(t *testing.T) {
	doc := &specDoc{
		fm: map[string]any{
			"api": map[string]any{
				"Open": map[string]any{
					"react-only": "yes",
				},
			},
			"targets": map[string]any{
				"react": map[string]any{},
			},
		},
	}
	errs := validateRuntimeScopedAPIFields(doc, "demo.spec.md")
	if len(errs) == 0 {
		t.Fatal("expected react-only type validation error")
	}
}

func TestValidateRuntimeScopedAPIFieldsRequiresReactTarget(t *testing.T) {
	doc := &specDoc{
		fm: map[string]any{
			"api": map[string]any{
				"Open": map[string]any{
					"react-only": true,
				},
			},
		},
	}
	errs := validateRuntimeScopedAPIFields(doc, "demo.spec.md")
	if len(errs) == 0 {
		t.Fatal("expected missing targets.react error")
	}
}

func TestValidateRuntimeScopedAPIFieldsRejectsTemplPartLeak(t *testing.T) {
	doc := &specDoc{
		fm: map[string]any{
			"api": map[string]any{
				"Open": map[string]any{
					"react-only": true,
				},
			},
			"targets": map[string]any{
				"react": map[string]any{},
			},
			"parts": []any{
				map[string]any{
					"templ": "Sheet",
					"props": []any{"ID", "Open", "Class"},
				},
			},
		},
	}
	errs := validateRuntimeScopedAPIFields(doc, "demo.spec.md")
	if len(errs) == 0 {
		t.Fatal("expected parts[].props leak error")
	}
}
