package dashboard

// Twin: examples/vite/src/lib/helpers.ts
// Both files implement the same block-level presentation helpers
// for the two runtimes. Keep function names, signatures, and
// returned enum strings identical. When you edit one, update
// the twin and the associated *_test.tsx/*_test.go if present.

import "strings"

func navIconLetter(icon string) string {
	icon = strings.TrimSpace(icon)
	if icon == "" {
		return "•"
	}
	return strings.ToUpper(string([]rune(icon)[0]))
}

func navIconVariant(active bool) string {
	if active {
		return "accent"
	}
	return "secondary"
}
