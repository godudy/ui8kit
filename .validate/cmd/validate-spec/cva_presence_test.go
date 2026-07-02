package main

import "testing"

func TestValidateCVAPresence_PassesWhenTrue(t *testing.T) {
	doc := &specDoc{
		fm: map[string]any{
			"api": map[string]any{
				"Variant": map[string]any{"cva": true},
			},
		},
	}
	if errs := validateCVAPresence(doc, "x.spec.md"); len(errs) != 0 {
		t.Fatalf("expected no errors for cva: true, got %v", errs)
	}
}

func TestValidateCVAPresence_PassesWhenFalse(t *testing.T) {
	doc := &specDoc{
		fm: map[string]any{
			"api": map[string]any{
				"Class": map[string]any{"cva": false},
			},
		},
	}
	if errs := validateCVAPresence(doc, "x.spec.md"); len(errs) != 0 {
		t.Fatalf("expected no errors for cva: false, got %v", errs)
	}
}

func TestValidateCVAPresence_FailsWhenMissing(t *testing.T) {
	doc := &specDoc{
		fm: map[string]any{
			"api": map[string]any{
				"Class": map[string]any{"role": "style-extension"},
			},
		},
	}
	errs := validateCVAPresence(doc, "x.spec.md")
	if len(errs) != 1 {
		t.Fatalf("expected 1 error for missing cva, got %d (%v)", len(errs), errs)
	}
}

func TestValidateCVAPresence_SkipsSpecsWithoutAPIBlock(t *testing.T) {
	doc := &specDoc{
		fm: map[string]any{
			"exports": []any{"Helper"},
		},
	}
	if errs := validateCVAPresence(doc, "x.spec.md"); len(errs) != 0 {
		t.Fatalf("expected no errors for spec without api block, got %v", errs)
	}
}
