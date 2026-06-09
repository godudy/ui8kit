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
		`data-ui8kit="sheet"`,
		`id="dashboard-mobile-sheet-trigger"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected rendered block to contain %q", want)
		}
	}
}
