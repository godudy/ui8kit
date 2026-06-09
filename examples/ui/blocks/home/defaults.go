package home

// DefaultPage returns English demo data for isolated catalog previews.
func DefaultPage() PageProps {
	return PageProps{
		Brand:       "BuildY",
		Workspace:   "My workspace",
		Prototype:   "Prototype mode",
		ProfileName: "Alex Developer",
		Sidebar: []NavItem{
			{Label: "Home", Href: "#home", Icon: "home"},
			{Label: "Models", Href: "#models", Icon: "box"},
			{Label: "Files", Href: "#files", Icon: "file"},
			{Label: "Data", Href: "#data", Icon: "database"},
			{Label: "Source", Href: "#source", Icon: "code"},
			{Label: "Reports", Href: "#reports", Icon: "chart"},
		},
		HeaderNav: []NavItem{
			{Label: "Documentation", Href: "#documentation", Icon: "book"},
			{Label: "Templates", Href: "#templates", Icon: "layout"},
			{Label: "Settings", Href: "#settings", Icon: "settings"},
		},
		Hero: HeroProps{
			Title:            "What do you want to create?",
			Subtitle:         "Describe your idea in natural language. BuildY will analyze, model, and generate a FastyGo prototype from mocks.",
			Prompt:           "Describe an application, landing page, CRM, CMS, or portal...",
			PrimaryAction:    "Generate prototype",
			AttachmentLabel:  "Attach",
			AssistantLabel:   "Refine",
			ShortcutLabel:    "Slash command",
			SuggestionsLabel: "Suggestions:",
			Suggestions: []string{
				"SaaS landing with CMS content",
				"Admin dashboard",
				"CRM workspace",
				"Content portal",
			},
			Workflow: []WorkflowStep{
				{Label: "Plan", Icon: "plan"},
				{Label: "Model", Icon: "model"},
				{Label: "Preview", Icon: "preview"},
				{Label: "Source", Icon: "source"},
				{Label: "Export", Icon: "export"},
			},
		},
		Tools: []ToolCard{
			{Title: "Request Plan", Description: "Turn a prompt into a structured request plan.", Icon: "list", Tone: "blue"},
			{Title: "CMS Model", Description: "Define content, fields, relations, and ownership.", Icon: "database", Tone: "green"},
			{Title: "Preview", Description: "Open a live behavior-aware preview.", Icon: "eye", Tone: "blue"},
			{Title: "Source Code", Description: "Generate ready Go and Templ source files.", Icon: "code", Tone: "muted"},
			{Title: "Change Review", Description: "Review changes in code, content, and schema.", Icon: "spark", Tone: "amber"},
			{Title: "Export", Description: "Export the source code or demo package.", Icon: "download", Tone: "blue"},
		},
		Showcase: ShowcaseProps{
			Title:       "Powerful starting points",
			Description: "Use any mock application as a starting point for your workspace.",
			ActionLabel: "All templates",
			Items: []ShowcaseItem{
				{Name: "AppCMS", Category: "CMS", Description: "Sites, pages, media, and taxonomies.", Capabilities: []string{"Content model", "Pages and navigation", "Media library"}, UseLabel: "Use", PreviewLabel: "Preview"},
				{Name: "AppCRM", Category: "CRM", Description: "Leads, contacts, deals, and activities.", Capabilities: []string{"People and contacts", "Funnels and stages", "Activity timeline"}, UseLabel: "Use", PreviewLabel: "Preview"},
				{Name: "AppSuite", Category: "Suite", Description: "Launcher and shared workspace tools.", Capabilities: []string{"Workspace switcher", "Product hub", "Role access"}, UseLabel: "Use", PreviewLabel: "Preview"},
				{Name: "Director", Category: "Ops", Description: "Operations dashboard and approvals.", Capabilities: []string{"Review operations", "Approvals and flows", "Status reports"}, UseLabel: "Use", PreviewLabel: "Preview"},
				{Name: "Contentor", Category: "Editorial", Description: "Planning, editing, and publishing.", Capabilities: []string{"Planning canvas", "Editorial process", "Publication workflow"}, UseLabel: "Use", PreviewLabel: "Preview"},
				{Name: "Webmaster", Category: "SEO", Description: "SEO, redirects, and site health.", Capabilities: []string{"Site monitoring", "Redirect control", "SEO optimization"}, UseLabel: "Use", PreviewLabel: "Preview"},
			},
		},
		Notice: NoticeProps{
			Title:       "You are in prototype mode",
			Description: "This block uses mock data only: no external services, no repositories, no billing. It is ideal for research and design.",
			ActionLabel: "Learn about prototype mode",
		},
	}
}
