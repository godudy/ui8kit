package home

const (
	homeSheetTriggerID = "home-mobile-sheet-trigger"
	homeSheetPanelID   = "home-mobile-sheet-panel"
	homeSheetTitleID   = "home-mobile-sheet-title"
)

func toolIconBadgeVariant(tone string) string {
	switch tone {
	case "muted":
		return "default"
	case "green", "amber":
		return "secondary"
	default:
		return "accent"
	}
}
