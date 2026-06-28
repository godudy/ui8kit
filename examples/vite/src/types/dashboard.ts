export type NavItem = {
  Label: string;
  Href: string;
  Icon?: string;
};

export type HeroProps = {
  Eyebrow: string;
  Title: string;
  Description: string;
  PrimaryCTA: string;
  SecondaryCTA: string;
  Progress: string;
  ProgressLabel: string;
};

export type StatusCard = {
  Value: string;
  Title: string;
  Description: string;
  Meta: string;
  Icon: string;
  Tone: string;
};

export type LayerItem = {
  Name: string;
  Description: string;
  Status: string;
};

export type NoticeProps = {
  Title: string;
  Description: string;
};

export type DashboardPageProps = {
  Brand: string;
  Workspace: string;
  Status: string;
  ProfileName: string;
  Sidebar: NavItem[];
  HeaderNav: NavItem[];
  Hero: HeroProps;
  Cards: StatusCard[];
  Layers: LayerItem[];
  Notice: NoticeProps;
};
