package uiutils

import "testing"

func TestResolveTagLayout(t *testing.T) {
	if got := ResolveTag("", "div", TagGroupLayout); got != "div" {
		t.Fatalf("empty: got %q", got)
	}
	if got := ResolveTag("section", "div", TagGroupLayout); got != "section" {
		t.Fatalf("section: got %q", got)
	}
	if got := ResolveTag("table", "div", TagGroupLayout); got != "div" {
		t.Fatalf("disallowed: got %q", got)
	}
}

func TestResolveTagStack(t *testing.T) {
	if got := ResolveTag("ul", "div", TagGroupStack); got != "ul" {
		t.Fatalf("ul: got %q", got)
	}
}

func TestResolveTagGroup(t *testing.T) {
	if got := ResolveTag("fieldset", "div", TagGroupGroup); got != "fieldset" {
		t.Fatalf("fieldset: got %q", got)
	}
}
