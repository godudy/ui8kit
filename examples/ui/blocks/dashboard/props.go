package dashboard

// PageProps describes a self-contained dashboard catalog page.
type PageProps struct {
	Brand       string
	Workspace   string
	Status      string
	ProfileName string
	Sidebar     []NavItem
	HeaderNav   []NavItem
	Hero        HeroProps
	Cards       []StatusCard
	Layers      []LayerItem
	Notice      NoticeProps
}

// NavItem describes a local navigation item.
type NavItem struct {
	Label string
	Href  string
	Icon  string
}

// HeroProps configures the main dashboard intro.
type HeroProps struct {
	Eyebrow     string
	Title       string
	Description string
	PrimaryCTA  string
	SecondaryCTA string
}

// StatusCard describes one current app-shell capability.
type StatusCard struct {
	Title       string
	Description string
	Meta        string
	Icon        string
	Tone        string
}

// LayerItem describes one technical layer visible in the current app.
type LayerItem struct {
	Name        string
	Description string
	Status      string
}

// NoticeProps configures the footer notice.
type NoticeProps struct {
	Title       string
	Description string
}
