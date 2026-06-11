package dashboard

const (
	dashboardSheetTriggerID = "dashboard-mobile-sheet-trigger"
	dashboardSheetPanelID   = "dashboard-mobile-sheet-panel"
	dashboardSheetTitleID   = "dashboard-mobile-sheet-title"
)

func statusIconBadgeVariant(tone string) string {
	if tone == "muted" {
		return "default"
	}
	return "accent"
}
