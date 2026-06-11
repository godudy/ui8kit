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
		"FastyGo app shell is ready",
		"Sidebar shell",
		"Header navigation",
		"Current layer",
		"github.com/fastygo/framework",
		"Catalog copy, not runtime code",
		"Shell readiness",
		`<progress`,
		`data-ui8kit="sheet"`,
		`id="dashboard-mobile-sheet-trigger"`,
		`id="dashboard-mobile-sheet-panel"`,
		`aria-label="Primary navigation"`,
		`aria-current="page"`,
		`<article`,
		`<section`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected rendered block to contain %q", want)
		}
	}
}
