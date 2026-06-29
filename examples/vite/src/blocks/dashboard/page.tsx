import type { ReactNode } from "react";
import dashboardVariants from "../../../../templ/ui/blocks/dashboard/dashboard.variants.json";
import { defaultDashboardPage } from "../../data/dashboard";
import { blockVariant } from "../../lib/block-variant";
import { navIconLetter, navIconVariant } from "../../lib/helpers";
import type { DashboardPageProps, HeroProps, LayerItem, NoticeProps, StatusCard, NavItem as NavItemData } from "../../types/dashboard";
import {
  Alert,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  IconBadge,
  Nav,
  NavItem,
  NavLink,
  NavList,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@registry/components";
import {
  Badge,
  Block,
  Box,
  Button,
  Group,
  Grid,
  GridCol,
  Progress,
  Stack,
  Text,
  Title,
} from "@registry/ui";

const dashboardSheetTriggerID = "dashboard-mobile-sheet-trigger";
const dashboardSheetPanelID = "dashboard-mobile-sheet-panel";
const dashboardSheetTitleID = "dashboard-mobile-sheet-title";

function DashboardPrimaryNav({ items, className }: { items: NavItemData[]; className?: string }) {
  return (
    <Nav aria-label="Primary navigation" className={className}>
      <NavList gap="sm" className="px-2">
        {items.map((item, index) => (
          <NavItem key={item.Label}>
            <NavLink href={item.Href} active={index === 0} aria-label={item.Label}>
              <IconBadge
                text={navIconLetter(item.Icon)}
                size="sm"
                variant={navIconVariant(index === 0)}
              />
              {item.Label}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}

function DashboardHeaderNav({ items, className }: { items: NavItemData[]; className?: string }) {
  return (
    <Nav aria-label="Header navigation" className={className}>
      <NavList gap="sm" className="px-2">
        {items.map((item) => (
          <NavItem key={item.Label}>
            <NavLink href={item.Href} variant="ghost" size="sm">{item.Label}</NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}

function DashboardMobileSheet({ props }: { props: DashboardPageProps }) {
  return (
    <Sheet
      id={dashboardSheetPanelID}
      side="left"
      size="default"
      variant="card"
      behavior="ui8kit"
      aria-label="Navigation menu"
      aria-labelledby={dashboardSheetTitleID}
      className="md:hidden max-h-dvh overflow-y-auto p-0"
    >
      <SheetOverlay
        for={dashboardSheetPanelID}
        behavior="ui8kit"
        className="cursor-pointer bg-background/80"
      />
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle id={dashboardSheetTitleID} className="text-sm font-medium">
            {props.Brand}
          </SheetTitle>
          <SheetClose
            for={dashboardSheetPanelID}
            behavior="ui8kit"
            variant="outline"
            size="icon"
            aria-label="Close navigation menu"
          >
            ×
          </SheetClose>
        </SheetHeader>
        <DashboardPrimaryNav items={props.Sidebar} className="mt-4" />
        <DashboardHeaderNav items={props.HeaderNav} className="mt-4 border-t border-border pt-4" />
      </SheetContent>
    </Sheet>
  );
}

function DashboardSidebar({ props }: { props: DashboardPageProps }) {
  return (
    <Box
      tag="aside"
      className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col"
    >
      <Box className="flex h-16 items-center gap-4 border-b border-border px-4">
        <IconBadge text="U8" size="sm" variant="accent" />
        <Stack className="gap-0">
          <Text tag="span" className="text-sm font-semibold tracking-tight">{props.Brand}</Text>
          <Text tag="span" className="text-xs text-muted-foreground">Templ registry</Text>
        </Stack>
      </Box>
      <Box className="flex-1 py-2">
        <DashboardPrimaryNav items={props.Sidebar} />
      </Box>
      <Box className="border-t border-border p-4">
        <Button href="/home/" variant="outline" size="sm" className="w-full">
          Open home block
        </Button>
      </Box>
    </Box>
  );
}

function DashboardHeader({ props }: { props: DashboardPageProps }) {
  return (
    <Box
      tag="header"
      className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-sm"
    >
      <Group className="col-start-1 items-center gap-2 justify-self-start">
        <SheetTrigger
          id={dashboardSheetTriggerID}
          for={dashboardSheetPanelID}
          behavior="ui8kit"
          variant="outline"
          size="icon"
          aria-label="Open menu"
        >
          ☰
        </SheetTrigger>
        <Button href="#gallery" variant="outline" size="sm">{props.Workspace}</Button>
      </Group>
      <Nav className="col-start-2 hidden justify-self-center md:block">
        <NavList orientation="horizontal" gap="sm">
          {props.HeaderNav.map((item) => (
            <NavItem key={item.Label}>
              <NavLink href={item.Href} variant="ghost" size="sm">{item.Label}</NavLink>
            </NavItem>
          ))}
        </NavList>
      </Nav>
      <Group className="col-start-3 items-center justify-end gap-2 justify-self-end">
        <Badge variant="secondary">{props.Status}</Badge>
        <Button href="#profile" variant="ghost" size="sm">{props.ProfileName}</Button>
      </Group>
    </Box>
  );
}

function DashboardHero({ hero }: { hero: HeroProps }) {
  return (
    <Box tag="section" className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Box className="border-b border-border bg-muted/40 px-6 py-4">
        <Group className="items-center justify-between gap-4">
          <Badge variant="outline">{hero.Eyebrow}</Badge>
          <Group className="items-center gap-2">
            <Button variant="outline" size="sm" href="/home/">{hero.SecondaryCTA}</Button>
            <Button variant="default" size="sm" href="#gallery">{hero.PrimaryCTA}</Button>
          </Group>
        </Group>
      </Box>
      <Box className="px-6 py-6">
        <Grid className="gap-8 md:grid-cols-[1fr_auto]">
          <GridCol>
            <Stack className="max-w-2xl gap-4">
              <Title order={1} className="text-3xl font-bold tracking-tight md:text-4xl">
                {hero.Title}
              </Title>
              <Text className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {hero.Description}
              </Text>
            </Stack>
          </GridCol>
          <GridCol>
            <Box className="rounded-md border border-border bg-background p-4 md:w-64">
              <Stack className="gap-2">
                <Group className="items-center justify-between gap-2">
                  <Text className="text-xs font-medium text-muted-foreground">{hero.ProgressLabel}</Text>
                  <Text className="text-xs font-semibold">{hero.Progress}%</Text>
                </Group>
                <Progress value={hero.Progress} max="100" variant="default" />
              </Stack>
            </Box>
          </GridCol>
        </Grid>
      </Box>
    </Box>
  );
}

function StatusCards({ items }: { items: StatusCard[] }) {
  return (
    <Grid className="gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <GridCol key={item.Title}>
          <Card tag="article" variant="default" className="h-full transition-colors hover:bg-muted/20">
            <CardContent className="p-6">
              <Stack className="gap-4">
                <Group className="items-start justify-between gap-4">
                  <IconBadge
                    text={item.Icon}
                    size="default"
                    variant={blockVariant(dashboardVariants, "statusTone", item.Tone)}
                  />
                  <Badge variant="outline" size="sm">{item.Meta}</Badge>
                </Group>
                <Stack className="gap-2">
                  <Text className="text-2xl font-bold tracking-tight">{item.Value}</Text>
                  <Text className="text-sm font-semibold">{item.Title}</Text>
                  <Text className="text-xs leading-relaxed text-muted-foreground">{item.Description}</Text>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </GridCol>
      ))}
    </Grid>
  );
}

function LayerStatusBadge({ status }: { status: string }) {
  if (status === "primitive") return <Badge variant="default">primitive</Badge>;
  if (status === "composite") return <Badge variant="secondary">composite</Badge>;
  if (status === "block") return <Badge variant="outline">block</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

function LayerTable({ items }: { items: LayerItem[] }) {
  return (
    <Card tag="section" variant="default">
      <CardHeader>
        <CardTitle order={2}>Registry inventory</CardTitle>
        <CardDescription>
          Public bricks included in this preview and how they layer together.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Stack className="gap-2">
          {items.map((item) => (
            <Group
              key={item.Name}
              className="items-center justify-between gap-4 rounded-md border border-border bg-muted/20 px-4 py-4"
            >
              <Stack className="gap-2 min-w-0">
                <Text className="text-sm font-medium font-mono">{item.Name}</Text>
                <Text className="text-xs text-muted-foreground">{item.Description}</Text>
              </Stack>
              <LayerStatusBadge status={item.Status} />
            </Group>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function GallerySection({ children }: { children: ReactNode }) {
  return (
    <Stack className="gap-4">
      <Group className="items-end justify-between gap-4">
        <Stack className="gap-2">
          <Title order={2} className="text-lg font-semibold tracking-tight">
            Live component gallery
          </Title>
          <Text className="text-sm text-muted-foreground">
            Interactive samples from ui/* and components/* — buttons, forms, alerts, sheets.
          </Text>
        </Stack>
        <Badge variant="outline">Scroll to explore</Badge>
      </Group>
      {children}
    </Stack>
  );
}

function DashboardNotice({ notice }: { notice: NoticeProps }) {
  return (
    <Alert variant="warning" role="status" aria-live="polite">
      <Stack className="gap-2">
        <Text className="text-sm font-semibold">{notice.Title}</Text>
        <Text className="text-sm">{notice.Description}</Text>
      </Stack>
    </Alert>
  );
}

export function DashboardPage({ children }: { children?: ReactNode }) {
  const props = defaultDashboardPage;

  return (
    <Block tag="main" className="min-h-screen bg-muted/30 text-foreground">
      <DashboardMobileSheet props={props} />
      <Group className="min-h-screen w-full items-stretch">
        <DashboardSidebar props={props} />
        <Box className="flex min-w-0 flex-1 flex-col bg-background">
          <DashboardHeader props={props} />
          <Box className="flex flex-1 flex-col gap-8 p-4 md:p-8">
            <DashboardHero hero={props.Hero} />
            <StatusCards items={props.Cards} />
            <LayerTable items={props.Layers} />
            <GallerySection>{children}</GallerySection>
            <DashboardNotice notice={props.Notice} />
          </Box>
        </Box>
      </Group>
    </Block>
  );
}
