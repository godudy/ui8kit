package home

import (
	"bytes"
	"context"
	"strings"
	"testing"
)

func TestPageRendersDefaultCatalogBlock(t *testing.T) {
	var buf bytes.Buffer
	if err := Page(DefaultPage()).Render(context.Background(), &buf); err != nil {
		t.Fatal(err)
	}
	html := buf.String()
	for _, want := range []string{
		"What do you want to create?",
		"Generate prototype",
		"Powerful starting points",
		"You are in prototype mode",
		"Documentation",
		"AppCMS",
		`data-ui8kit="sheet"`,
		`id="home-mobile-sheet-trigger"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected rendered block to contain %q", want)
		}
	}
}
