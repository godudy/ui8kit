package home

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

func toolIconLetter(icon string) string {
	icon = strings.TrimSpace(icon)
	if icon == "" {
		return "•"
	}
	return strings.ToUpper(string([]rune(icon)[0]))
}

func workflowStepLabel(index int) string {
	return string(rune('1' + index))
}

func workflowStepVariant(index int) string {
	if index == 0 {
		return "accent"
	}
	return "secondary"
}

func showcaseIconLetter(name string) string {
	name = strings.TrimSpace(name)
	if name == "" {
		return "?"
	}
	return strings.ToUpper(string([]rune(name)[0]))
}
