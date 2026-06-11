package examples

import (
	"bytes"
	"context"
	"strings"
	"testing"
)

func TestPageLinksUI8KitRuntime(t *testing.T) {
	var buf bytes.Buffer
	if err := Page().Render(context.Background(), &buf); err != nil {
		t.Fatal(err)
	}
	html := buf.String()
	for _, want := range []string{
		`/static/js/ui8kit.js`,
		`data-ui8kit="sheet"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected Page() to contain %q", want)
		}
	}
}

func TestHomePageLinksUI8KitRuntime(t *testing.T) {
	var buf bytes.Buffer
	if err := HomePage().Render(context.Background(), &buf); err != nil {
		t.Fatal(err)
	}
	html := buf.String()
	for _, want := range []string{
		`/static/js/ui8kit.js`,
		`data-ui8kit="sheet"`,
	} {
		if !strings.Contains(html, want) {
			t.Fatalf("expected HomePage() to contain %q", want)
		}
	}
}
