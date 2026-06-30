package main

import "testing"

func TestIDPathMismatchAcceptsSimpleRecipeID(t *testing.T) {
	if warn := idPathMismatch("ui/button/button.variants.json", "ui.button"); warn != "" {
		t.Fatalf("expected no warning for simple recipe id, got %q", warn)
	}
}

func TestIDPathMismatchAcceptsMultiRecipeFolderID(t *testing.T) {
	cases := []struct {
		rel string
		id  string
	}{
		{"ui/form/legend.variants.json", "ui.form.legend"},
		{"ui/disclosure/summary.variants.json", "ui.disclosure.summary"},
		{"components/nav/nav-link.variants.json", "components.nav.link"},
	}

	for _, tc := range cases {
		if warn := idPathMismatch(tc.rel, tc.id); warn != "" {
			t.Fatalf("expected no warning for %s id %s, got %q", tc.rel, tc.id, warn)
		}
	}
}

func TestIDPathMismatchWarnsOnUnrelatedID(t *testing.T) {
	if warn := idPathMismatch("ui/button/button.variants.json", "ui.badge"); warn == "" {
		t.Fatal("expected warning for unrelated recipe id")
	}
}
