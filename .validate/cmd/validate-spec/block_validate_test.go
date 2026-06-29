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
	path := filepath.Join(repoRoot, "examples", "templ", "ui", "blocks", "home", "home.spec.md")
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

func TestValidateVariantsRejectsEmptyStringKey(t *testing.T) {
	dir := t.TempDir()
	specDir := filepath.Join(dir, "demo")
	if err := os.MkdirAll(specDir, 0o755); err != nil {
		t.Fatal(err)
	}
	variantsPath := filepath.Join(specDir, "demo.variants.json")
	if err := os.WriteFile(variantsPath, []byte(`{
  "byKey": {
    "size": { "": "h-10", "default": "h-10" }
  },
  "defaults": { "size": "default" }
}`), 0o644); err != nil {
		t.Fatal(err)
	}
	specPath := filepath.Join(specDir, "demo.spec.md")
	specBody := `---
id: ui.demo
layer: primitive
kind: styled
package: example/demo
facade: example/demo
templ: Demo
variants: demo.variants.json
api:
  Size:
    cva: true
    type: string
    role: density
    allow-list-source: demo.variants.json#size
    enum: [default]
    default: default
semantics:
  root: div
---

## Summary

Demo for empty-string key rejection.

## Use Cases

- Validate byKey

## Semantics

- Root div

## Example default

` + "```templ\nimport \"example/demo\"\n\n" + `templ Example() {
	@demo.Demo(demo.DemoProps{})
}
` + "```\n"
	if err := os.WriteFile(specPath, []byte(specBody), 0o644); err != nil {
		t.Fatal(err)
	}
	doc, err := loadSpec(specPath)
	if err != nil {
		t.Fatal(err)
	}
	errs := validateVariantsFile(doc, "demo.spec.md", specDir, "demo.variants.json")
	if len(errs) == 0 {
		t.Fatal("expected empty-string byKey error")
	}
	if !strings.Contains(errs[0].message, "empty-string key") {
		t.Fatalf("unexpected error: %v", errs[0])
	}
}

func TestValidateVariantsRejectsMissingDefault(t *testing.T) {
	dir := t.TempDir()
	specDir := filepath.Join(dir, "demo")
	if err := os.MkdirAll(specDir, 0o755); err != nil {
		t.Fatal(err)
	}
	variantsPath := filepath.Join(specDir, "demo.variants.json")
	if err := os.WriteFile(variantsPath, []byte(`{
  "byKey": {
    "size": { "default": "h-10", "lg": "h-12" }
  },
  "defaults": { "size": "missing-key" }
}`), 0o644); err != nil {
		t.Fatal(err)
	}
	specPath := filepath.Join(specDir, "demo.spec.md")
	specBody := `---
id: ui.demo
layer: primitive
kind: styled
package: example/demo
facade: example/demo
templ: Demo
variants: demo.variants.json
api:
  Size:
    cva: true
    type: string
    role: density
    allow-list-source: demo.variants.json#size
    enum: [default, lg]
    default: default
semantics:
  root: div
---

## Summary

Demo for missing-default rejection.

## Use Cases

- Validate defaults

## Semantics

- Root div

## Example default

` + "```templ\nimport \"example/demo\"\n\n" + `templ Example() {
	@demo.Demo(demo.DemoProps{})
}
` + "```\n"
	if err := os.WriteFile(specPath, []byte(specBody), 0o644); err != nil {
		t.Fatal(err)
	}
	doc, err := loadSpec(specPath)
	if err != nil {
		t.Fatal(err)
	}
	errs := validateVariantsFile(doc, "demo.spec.md", specDir, "demo.variants.json")
	if len(errs) == 0 {
		t.Fatal("expected defaults[k] not found error")
	}
	if !strings.Contains(errs[0].message, "not found in byKey") {
		t.Fatalf("unexpected error: %v", errs[0])
	}
}
