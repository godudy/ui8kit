package dashboard

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
