package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestValidateVariantJSONFileRejectsBrokenDefaults(t *testing.T) {
	repo := t.TempDir()
	dir := filepath.Join(repo, "ui", "demo")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(dir, "demo.variants.json")
	body := `{
  "id": "ui.demo",
  "base": "flex",
  "keys": ["variant"],
  "defaults": {"variant": ""},
  "byKey": {"variant": {"default": "bg-card"}}
}`
	if err := os.WriteFile(path, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
	errs := validateVariantJSONFile(repo, path)
	if len(errs) == 0 {
		t.Fatal("expected validation error for empty defaults variant")
	}
	if !strings.Contains(errs[0].message, "empty-string") {
		t.Fatalf("unexpected error: %+v", errs[0])
	}
}

func TestValidateVariantJSONFileRejectsKeysByKeyMismatch(t *testing.T) {
	repo := t.TempDir()
	dir := filepath.Join(repo, "components", "demo")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(dir, "demo.variants.json")
	body := `{
  "id": "components.demo",
  "base": "rounded",
  "keys": ["size"],
  "defaults": {"size": "sm"},
  "byKey": {
    "variant": {"default": "bg-card"},
    "size": {"sm": "h-8"}
  }
}`
	if err := os.WriteFile(path, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
	errs := validateVariantJSONFile(repo, path)
	if len(errs) == 0 {
		t.Fatal("expected keys/byKey mismatch error")
	}
	var found bool
	for _, e := range errs {
		if strings.Contains(e.message, "keys is missing") {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("expected keys/byKey mismatch, got: %+v", errs)
	}
}
