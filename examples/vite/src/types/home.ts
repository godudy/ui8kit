export type NavItem = {
  Label: string;
  Href: string;
  Icon?: string;
};

export type HeroProps = {
  Title: string;
  Subtitle: string;
  Prompt: string;
  PrimaryAction: string;
  AttachmentLabel: string;
  AssistantLabel: string;
  ShortcutLabel: string;
  SuggestionsLabel: string;
  Suggestions: string[];
  Workflow: WorkflowStep[];
};

export type WorkflowStep = {
  Label: string;
  Icon: string;
};

export type ToolCard = {
  Title: string;
  Description: string;
  Icon: string;
  Tone: string;
};

export type ShowcaseItem = {
  Name: string;
  Category: string;
  Description: string;
  Capabilities: string[];
  UseLabel: string;
  PreviewLabel: string;
};

export type ShowcaseProps = {
  Title: string;
  Description: string;
  ActionLabel: string;
  Items: ShowcaseItem[];
};

export type NoticeProps = {
  Title: string;
  Description: string;
  ActionLabel: string;
};

export type HomePageProps = {
  Brand: string;
  Workspace: string;
  Prototype: string;
  ProfileName: string;
  Sidebar: NavItem[];
  HeaderNav: NavItem[];
  Hero: HeroProps;
  Tools: ToolCard[];
  Showcase: ShowcaseProps;
  Notice: NoticeProps;
};
