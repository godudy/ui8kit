package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestValidateReactTestTarget_SkipsWhenLayerNotEnforced(t *testing.T) {
	doc := &specDoc{
		path: filepath.Join(t.TempDir(), "x.spec.md"),
		fm: map[string]any{
			"layer": "helper",
			"targets": map[string]any{
				"react": map[string]any{
					"component": "Foo",
				},
			},
		},
	}
	if errs := validateReactTestTarget(doc, "x.spec.md", t.TempDir()); len(errs) != 0 {
		t.Fatalf("expected no errors for non-enforced layer when test is absent, got %v", errs)
	}
}

func TestValidateReactTestTarget_RequiresTestForPrimitive(t *testing.T) {
	doc := &specDoc{
		path: filepath.Join(t.TempDir(), "x.spec.md"),
		fm: map[string]any{
			"layer": "primitive",
			"targets": map[string]any{
				"react": map[string]any{
					"component": "Foo",
				},
			},
		},
	}
	errs := validateReactTestTarget(doc, "x.spec.md", t.TempDir())
	if len(errs) != 1 {
		t.Fatalf("expected 1 error for missing test on primitive brick, got %d (%v)", len(errs), errs)
	}
}

func TestValidateReactTestTarget_RequiresTestForComposite(t *testing.T) {
	doc := &specDoc{
		path: filepath.Join(t.TempDir(), "x.spec.md"),
		fm: map[string]any{
			"layer": "composite",
			"targets": map[string]any{
				"react": map[string]any{
					"component": "Foo",
				},
			},
		},
	}
	errs := validateReactTestTarget(doc, "x.spec.md", t.TempDir())
	if len(errs) != 1 {
		t.Fatalf("expected 1 error for missing test on composite brick, got %d (%v)", len(errs), errs)
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
