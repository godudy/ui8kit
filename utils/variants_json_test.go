package uiutils

import "testing"

func TestParseVariantRecipe(t *testing.T) {
	raw := []byte(`{
		"id": "ui.button",
		"base": "inline-flex",
		"keys": ["variant", "size"],
		"defaults": {"variant": "default", "size": "default"},
		"byKey": {
			"variant": {"default": "bg-primary"},
			"size": {"default": "h-10"}
		}
	}`)
	recipe, err := ParseVariantRecipe(raw)
	if err != nil {
		t.Fatal(err)
	}
	v := recipe.ToVariants()
	if v.Base != "inline-flex" {
		t.Fatalf("base=%q", v.Base)
	}
	got := Compose(v, map[string]string{"variant": "default", "size": "default"})
	if got != "inline-flex bg-primary h-10" {
		t.Fatalf("compose=%q", got)
	}
}
