package home

// PageProps describes a self-contained BuildY workspace catalog page.
type PageProps struct {
	Brand       string
	Workspace   string
	Prototype   string
	Sidebar     []NavItem
	HeaderNav   []NavItem
	Hero        HeroProps
	Tools       []ToolCard
	Showcase    ShowcaseProps
	Notice      NoticeProps
	ProfileName string
}

// NavItem describes a navigation item used by this catalog block.
type NavItem struct {
	Label string
	Href  string
	Icon  string
}

// HeroProps configures the command-center hero area.
type HeroProps struct {
	Title            string
	Subtitle         string
	Prompt           string
	PrimaryAction    string
	AttachmentLabel  string
	AssistantLabel   string
	ShortcutLabel    string
	SuggestionsLabel string
	Suggestions      []string
	Workflow         []WorkflowStep
}

// WorkflowStep describes a visual generation step.
type WorkflowStep struct {
	Label string
	Icon  string
}

// ToolCard describes one workflow card below the hero.
type ToolCard struct {
	Title       string
	Description string
	Icon        string
	Tone        string
}

// ShowcaseProps configures the showcase card grid.
type ShowcaseProps struct {
	Title       string
	Description string
	ActionLabel string
	Items       []ShowcaseItem
}

// ShowcaseItem describes a starter app preset.
type ShowcaseItem struct {
	Name         string
	Category     string
	Description  string
	Capabilities []string
	UseLabel     string
	PreviewLabel string
}

// NoticeProps configures the prototype mode notice.
type NoticeProps struct {
	Title       string
	Description string
	ActionLabel string
}
