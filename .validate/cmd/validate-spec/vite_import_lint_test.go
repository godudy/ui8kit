package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestValidateViteImportStyleRejectsMixedImportModes(t *testing.T) {
	repo := t.TempDir()
	path := filepath.Join(repo, "examples", "vite", "src", "blocks", "home", "page.tsx")
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	content := `import { Button } from "@registry/ui";
import data from "../../../../templ/ui/blocks/home/home.variants.json";
`
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
	errs := validateViteImportStyle(repo)
	if len(errs) == 0 {
		t.Fatal("expected mixed import style lint error")
	}
}

func TestValidateViteImportStyleAllowsAliasWithShortRelative(t *testing.T) {
	repo := t.TempDir()
	path := filepath.Join(repo, "examples", "vite", "src", "blocks", "home", "page.tsx")
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	content := `import { Button } from "@registry/ui";
import { helper } from "../../lib/helpers";
`
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		t.Fatal(err)
	}
	errs := validateViteImportStyle(repo)
	if len(errs) != 0 {
		t.Fatalf("unexpected lint errors: %+v", errs)
	}
}
