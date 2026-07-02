package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestValidateReactTestDescribe_NoOpWhenNoTestDeclared(t *testing.T) {
	doc := &specDoc{
		path: filepath.Join(t.TempDir(), "x.spec.md"),
		fm: map[string]any{
			"id": "ui.button",
		},
	}
	if errs := validateReactTestDescribe(doc, "x.spec.md", t.TempDir()); len(errs) != 0 {
		t.Fatalf("expected no errors when targets.react.test is absent, got %v", errs)
	}
}

func TestValidateReactTestDescribe_PassesOnMatchingID(t *testing.T) {
	dir := t.TempDir()
	testFile := filepath.Join(dir, "x.test.tsx")
	if err := os.WriteFile(testFile, []byte(`describe("ui/button", () => {});`), 0o644); err != nil {
		t.Fatal(err)
	}
	doc := &specDoc{
		path: filepath.Join(dir, "x.spec.md"),
		fm: map[string]any{
			"id": "ui.button",
			"targets": map[string]any{
				"react": map[string]any{
					"test": "./x.test.tsx",
				},
			},
		},
	}
	if errs := validateReactTestDescribe(doc, "x.spec.md", dir); len(errs) != 0 {
		t.Fatalf("expected no errors for matching describe, got %v", errs)
	}
}

func TestValidateReactTestDescribe_FailsWhenDescribeMissing(t *testing.T) {
	dir := t.TempDir()
	testFile := filepath.Join(dir, "x.test.tsx")
	if err := os.WriteFile(testFile, []byte(`describe("ui/other", () => {});`), 0o644); err != nil {
		t.Fatal(err)
	}
	doc := &specDoc{
		path: filepath.Join(dir, "x.spec.md"),
		fm: map[string]any{
			"id": "ui.button",
			"targets": map[string]any{
				"react": map[string]any{
					"test": "./x.test.tsx",
				},
			},
		},
	}
	errs := validateReactTestDescribe(doc, "x.spec.md", dir)
	if len(errs) != 1 {
		t.Fatalf("expected 1 error for missing describe, got %d (%v)", len(errs), errs)
	}
}

func TestValidateReactTestDescribe_OverrideMatch(t *testing.T) {
	dir := t.TempDir()
	testFile := filepath.Join(dir, "x.test.tsx")
	if err := os.WriteFile(testFile, []byte(`describe("Sheet ui8kit markup contract", () => {});`), 0o644); err != nil {
		t.Fatal(err)
	}
	doc := &specDoc{
		path: filepath.Join(dir, "x.spec.md"),
		fm: map[string]any{
			"id": "components.sheet",
			"targets": map[string]any{
				"react": map[string]any{
					"test":     "./x.test.tsx",
					"describe": "Sheet ui8kit markup contract",
				},
			},
		},
	}
	if errs := validateReactTestDescribe(doc, "x.spec.md", dir); len(errs) != 0 {
		t.Fatalf("expected no errors for matching override, got %v", errs)
	}
}

func TestValidateReactTestDescribe_OverrideMismatch(t *testing.T) {
	dir := t.TempDir()
	testFile := filepath.Join(dir, "x.test.tsx")
	if err := os.WriteFile(testFile, []byte(`describe("Something else", () => {});`), 0o644); err != nil {
		t.Fatal(err)
	}
	doc := &specDoc{
		path: filepath.Join(dir, "x.spec.md"),
		fm: map[string]any{
			"id": "components.sheet",
			"targets": map[string]any{
				"react": map[string]any{
					"test":     "./x.test.tsx",
					"describe": "Sheet ui8kit markup contract",
				},
			},
		},
	}
	errs := validateReactTestDescribe(doc, "x.spec.md", dir)
	if len(errs) != 1 {
		t.Fatalf("expected 1 error for mismatched override, got %d (%v)", len(errs), errs)
	}
}
