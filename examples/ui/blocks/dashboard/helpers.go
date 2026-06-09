package dashboard

import (
	templpkg "github.com/a-h/templ"
	"github.com/fastygo/templ/ui"
	uiutils "github.com/fastygo/templ/utils"
)

const (
	dashboardSheetTriggerID = "dashboard-mobile-sheet-trigger"
	dashboardSheetPanelID   = "dashboard-mobile-sheet-panel"
	dashboardSheetTitleID   = "dashboard-mobile-sheet-title"
)

func iconToken(value string) string {
	if value == "" {
		return "*"
	}
	return value[:1]
}

func navButtonClass(active bool) string {
	base := "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
	if active {
		return uiutils.Cn(base, "bg-accent text-accent-foreground")
	}
	return uiutils.Cn(base, "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
}

func statusSurface(tone string) string {
	base := "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold"
	if tone == "muted" {
		return uiutils.Cn(base, "bg-muted text-muted-foreground")
	}
	return uiutils.Cn(base, "bg-accent text-accent-foreground")
}

func dashboardMenuButtonProps() ui.ButtonProps {
	return ui.ButtonProps{
		ID:        dashboardSheetTriggerID,
		Variant:   "outline",
		Size:      "icon",
		AriaLabel: "Open menu",
		Attrs: templpkg.Attributes{
			"data-ui8kit-dialog-open":   true,
			"data-ui8kit-dialog-target": dashboardSheetPanelID,
			"aria-haspopup":             "dialog",
			"aria-controls":             dashboardSheetPanelID,
			"aria-expanded":             "false",
		},
	}
}

func dashboardSheetRootProps() ui.BoxProps {
	return ui.BoxProps{
		Class: "fixed inset-y-0 left-0 z-50 w-full md:hidden",
		Attrs: templpkg.Attributes{
			"id":                 dashboardSheetPanelID,
			"data-ui8kit":        "sheet",
			"data-ui8kit-dialog": true,
			"role":               "dialog",
			"aria-modal":         "true",
			"aria-label":         "Navigation menu",
			"aria-labelledby":    dashboardSheetTitleID,
			"data-state":         "closed",
			"hidden":             true,
		},
	}
}

func dashboardSheetOverlayProps() ui.BoxProps {
	return ui.BoxProps{
		Class: "absolute inset-0 cursor-pointer bg-card/50",
		Attrs: templpkg.Attributes{
			"data-ui8kit-dialog-overlay": true,
			"data-ui8kit-dialog-close":   true,
			"data-ui8kit-dialog-target":  dashboardSheetPanelID,
		},
	}
}

func dashboardSheetCloseButtonProps() ui.ButtonProps {
	return ui.ButtonProps{
		Variant:   "outline",
		Size:      "icon",
		AriaLabel: "Close navigation menu",
		Attrs: templpkg.Attributes{
			"data-ui8kit-dialog-close":  true,
			"data-ui8kit-dialog-target": dashboardSheetPanelID,
		},
	}
}
