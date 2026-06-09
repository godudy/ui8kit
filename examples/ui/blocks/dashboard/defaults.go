package dashboard

// DefaultPage returns English demo data for the FastyGo dashboard catalog block.
func DefaultPage() PageProps {
	return PageProps{
		Brand:       "FastyGo",
		Workspace:   "Application workspace",
		Status:      "Prototype shell",
		ProfileName: "Developer",
		Sidebar: []NavItem{
			{Label: "Home", Href: "#home", Icon: "home"},
			{Label: "Sample", Href: "#sample", Icon: "box"},
			{Label: "Routes", Href: "#routes", Icon: "route"},
			{Label: "Assets", Href: "#assets", Icon: "file"},
			{Label: "Tests", Href: "#tests", Icon: "check"},
		},
		HeaderNav: []NavItem{
			{Label: "Documentation", Href: "#documentation"},
			{Label: "Templates", Href: "#templates"},
			{Label: "Settings", Href: "#settings"},
		},
		Hero: HeroProps{
			Eyebrow:      "Current application layer",
			Title:        "FastyGo app shell is ready",
			Description:  "This catalog block mirrors the current app layer: sidebar navigation, header navigation, a content area, static routes, assets, and render tests.",
			PrimaryCTA:   "Open workspace",
			SecondaryCTA: "View routes",
		},
		Cards: []StatusCard{
			{Title: "Sidebar shell", Description: "Desktop sidebar with primary navigation and active state.", Meta: "layout", Icon: "s", Tone: "default"},
			{Title: "Header navigation", Description: "Separate top navigation that moves into the mobile menu group.", Meta: "navigation", Icon: "h", Tone: "default"},
			{Title: "Static assets", Description: "CSS, theme script, and UI behavior bundles are served by the app.", Meta: "assets", Icon: "a", Tone: "muted"},
			{Title: "Render tests", Description: "Wireframe render tests cover the shell, sheet hooks, and visible copy.", Meta: "testing", Icon: "t", Tone: "muted"},
		},
		Layers: []LayerItem{
			{Name: "github.com/fastygo/framework", Description: "HTTP host, routes, locales, static assets.", Status: "wired"},
			{Name: "github.com/fastygo/templ", Description: "Templ primitives and composites used by the app shell.", Status: "wired"},
			{Name: "internal/ui/layout", Description: "Runtime sidebar, header, mobile sheet, footer, and shell props.", Status: "runtime"},
			{Name: "internal/fixtures", Description: "English and Russian locale fixtures for visible copy.", Status: "runtime"},
		},
		Notice: NoticeProps{
			Title:       "Catalog copy, not runtime code",
			Description: "This block is a portable snapshot of the current FastyGo app layer. It duplicates shell ideas intentionally and does not import runtime layout or fixtures.",
		},
	}
}
