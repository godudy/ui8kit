package dashboard

import (
	"bytes"
	"context"
	"strings"
	"testing"
)

func TestPageRendersDefaultDashboardBlock(t *testing.T) {
	var buf bytes.Buffer
	if err := Page(DefaultPage()).Render(context.Background(), &buf); err != nil {
		t.Fatal(err)
	}
	html := buf.String()
	for _, want := range []string{
		"Component registry preview",
		"UI primitives",
		"Registry inventory",
		"ui.button",
		"Catalog snapshot",
		"Registry coverage",
		`<progress`,
		`<aside `,
		`<header `,
		`data-ui8kit="sheet"`,
		`id="dashboard-mobile-sheet-trigger"`,
		`id="dashboard-mobile-sheet-panel"`,
		`aria-label="Primary navigation"`,
		`aria-current="page"`,
		`<article`,
		`<section`,
		"Live component gallery",
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected rendered block to contain %q", want)
		}
	}
}
