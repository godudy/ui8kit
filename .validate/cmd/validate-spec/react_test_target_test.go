package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestValidateReactTestTarget_SkipsWhenAbsent(t *testing.T) {
	doc := &specDoc{
		path: filepath.Join(t.TempDir(), "x.spec.md"),
		fm: map[string]any{
			"targets": map[string]any{
				"react": map[string]any{
					"component": "Foo",
				},
			},
		},
	}
	if errs := validateReactTestTarget(doc, "x.spec.md", t.TempDir()); len(errs) != 0 {
		t.Fatalf("expected no errors when targets.react.test is absent, got %v", errs)
	}
}

func TestValidateReactTestTarget_RejectsBadSuffix(t *testing.T) {
	dir := t.TempDir()
	doc := &specDoc{
		path: filepath.Join(dir, "x.spec.md"),
		fm: map[string]any{
			"targets": map[string]any{
				"react": map[string]any{
					"test": "./foo.txt",
				},
			},
		},
	}
	errs := validateReactTestTarget(doc, "x.spec.md", dir)
	if len(errs) != 1 {
		t.Fatalf("expected 1 error for bad suffix, got %d (%v)", len(errs), errs)
	}
}

func TestValidateReactTestTarget_RejectsMissingFile(t *testing.T) {
	dir := t.TempDir()
	doc := &specDoc{
		path: filepath.Join(dir, "x.spec.md"),
		fm: map[string]any{
			"targets": map[string]any{
				"react": map[string]any{
					"test": "./missing.test.tsx",
				},
			},
		},
	}
	errs := validateReactTestTarget(doc, "x.spec.md", dir)
	if len(errs) != 1 {
		t.Fatalf("expected 1 error for missing file, got %d (%v)", len(errs), errs)
	}
}

func TestValidateReactTestTarget_AcceptsExistingFile(t *testing.T) {
	dir := t.TempDir()
	testFile := filepath.Join(dir, "x.test.tsx")
	if err := os.WriteFile(testFile, []byte("// stub"), 0o644); err != nil {
		t.Fatal(err)
	}
	doc := &specDoc{
		path: filepath.Join(dir, "x.spec.md"),
		fm: map[string]any{
			"targets": map[string]any{
				"react": map[string]any{
					"test": "./x.test.tsx",
				},
			},
		},
	}
	if errs := validateReactTestTarget(doc, "x.spec.md", dir); len(errs) != 0 {
		t.Fatalf("expected no errors for existing test, got %v", errs)
	}
}
