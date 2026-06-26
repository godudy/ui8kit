package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestValidateBlockDataRefs(t *testing.T) {
	repoRoot, err := findRepoRoot()
	if err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(repoRoot, "examples", "ui", "blocks", "home", "home.spec.md")
	doc, err := loadSpec(path)
	if err != nil {
		t.Fatal(err)
	}
	rel, _ := filepath.Rel(repoRoot, path)
	errs := validateBlockContract(doc, rel, repoRoot)
	for _, e := range errs {
		t.Errorf("%s", e.Error())
	}
}

func TestValidateBlockDataMissingRef(t *testing.T) {
	dir := t.TempDir()
	specDir := filepath.Join(dir, "demo")
	if err := os.MkdirAll(specDir, 0o755); err != nil {
		t.Fatal(err)
	}
	dataPath := filepath.Join(specDir, "demo.data.json")
	if err := os.WriteFile(dataPath, []byte(`{"showcase":{"default":{"props":{}}}}`), 0o644); err != nil {
		t.Fatal(err)
	}
	specPath := filepath.Join(specDir, "demo.spec.md")
	specBody := `---
id: blocks.demo
layer: catalog-block
kind: page-scaffold
package: example/demo
facade: example/demo
data: demo.data.json
api:
  PageProps:
    role: page-data
showcase:
  - id: default
    ref: missing
semantics:
  root: main
---

## Summary

Demo block for validation tests.

## Use Cases

- Validate data refs

## Semantics

- Root element is main

## Example default

` + "```templ\nimport \"example/demo\"\n\n" + `templ Example() {
	@demo.Page(demo.DefaultPage())
}
` + "```\n"
	if err := os.WriteFile(specPath, []byte(specBody), 0o644); err != nil {
		t.Fatal(err)
	}
	doc, err := loadSpec(specPath)
	if err != nil {
		t.Fatal(err)
	}
	errs := validateDataRefs(doc, "demo.spec.md", specDir, "demo.data.json")
	if len(errs) == 0 {
		t.Fatal("expected missing showcase ref error")
	}
	if !strings.Contains(errs[0].message, "missing") {
		t.Fatalf("unexpected error: %v", errs[0])
	}
}
