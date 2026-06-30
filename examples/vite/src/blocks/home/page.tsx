import homeVariants from "@blocks/home-variants";
import { defaultHomePage } from "../../data/home";
import { blockVariant } from "../../lib/block-variant";
import {
  navIconLetter,
  navIconVariant,
  showcaseIconLetter,
  toolIconLetter,
  workflowStepLabel,
  workflowStepVariant,
} from "../../lib/helpers";
import type { HeroProps, HomePageProps, NoticeProps, ShowcaseItem, ShowcaseProps, ToolCard, NavItem as NavItemData } from "../../types/home";
import {
  Alert,
  Card,
  CardContent,
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
  H1,
  H2,
  H3,
  Inline,
  Stack,
  Text,
  Textarea,
} from "@registry/ui";

const homeSheetTriggerID = "home-mobile-sheet-trigger";
const homeSheetPanelID = "home-mobile-sheet-panel";
const homeSheetTitleID = "home-mobile-sheet-title";

function CatalogPrimaryNav({ items, className }: { items: NavItemData[]; className?: string }) {
  return (
    <Nav aria-label="Primary navigation" className={className}>
      <NavList className="px-2">
        {items.map((item, index) => (
          <NavItem key={item.Label}>
            <NavLink href={item.Href} active={index === 0} aria-label={item.Label}>
              <IconBadge size="sm" variant={navIconVariant(index === 0)}>{navIconLetter(item.Icon)}</IconBadge>
              {item.Label}
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}

function CatalogHeaderNav({ items, className }: { items: NavItemData[]; className?: string }) {
  return (
    <Nav aria-label="Header navigation" className={className}>
      <NavList className="px-2">
        {items.map((item) => (
          <NavItem key={item.Label}>
            <NavLink href={item.Href} variant="ghost" size="sm">{item.Label}</NavLink>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
}

function CatalogMobileSheet({ props }: { props: HomePageProps }) {
  return (
    <Sheet
      id={homeSheetPanelID}
      side="left"
      size="default"
      variant="card"
      behavior="ui8kit"
      aria-label="Navigation menu"
      aria-labelledby={homeSheetTitleID}
      className="md:hidden max-h-dvh overflow-y-auto p-0"
    >
      <SheetOverlay
        target={homeSheetPanelID}
        behavior="ui8kit"
        className="cursor-pointer bg-background/80"
      />
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle id={homeSheetTitleID} className="text-sm font-medium">{props.Brand}</SheetTitle>
          <SheetClose
            target={homeSheetPanelID}
            behavior="ui8kit"
            variant="outline"
            size="icon"
            aria-label="Close navigation menu"
          >
            ×
          </SheetClose>
        </SheetHeader>
        <CatalogPrimaryNav items={props.Sidebar} className="mt-4" />
        <CatalogHeaderNav items={props.HeaderNav} className="mt-4 border-t border-border pt-4" />
      </SheetContent>
    </Sheet>
  );
}

function CatalogSidebar({ props }: { props: HomePageProps }) {
  return (
    <Block tag="aside" className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <Box className="flex h-16 items-center gap-4 border-b border-border px-4">
        <IconBadge size="sm" variant="accent">BY</IconBadge>
        <Stack className="gap-0">
          <Inline className="text-sm font-semibold tracking-tight">{props.Brand}</Inline>
          <Inline className="text-xs text-muted-foreground">Workspace catalog</Inline>
        </Stack>
      </Box>
      <Box className="flex-1 py-2">
        <CatalogPrimaryNav items={props.Sidebar} />
      </Box>
      <Box className="border-t border-border p-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href="/">Dashboard block</a>
        </Button>
      </Box>
    </Block>
  );
}

function CatalogHeader({ props }: { props: HomePageProps }) {
  return (
    <Block
      tag="header"
      className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-sm"
    >
      <Group className="col-start-1 items-center gap-2 justify-self-start">
        <SheetTrigger
          id={homeSheetTriggerID}
          target={homeSheetPanelID}
          behavior="ui8kit"
          variant="outline"
          size="icon"
          aria-label="Open menu"
        >
          ☰
        </SheetTrigger>
        <Button asChild variant="outline" size="sm">
          <a href="#workspace">{props.Workspace}</a>
        </Button>
      </Group>
      <Nav className="col-start-2 hidden justify-self-center md:block">
        <NavList orientation="horizontal">
          {props.HeaderNav.map((item) => (
            <NavItem key={item.Label}>
              <NavLink href={item.Href} variant="ghost" size="sm">{item.Label}</NavLink>
            </NavItem>
          ))}
        </NavList>
      </Nav>
      <Group className="col-start-3 items-center justify-end gap-2 justify-self-end">
        <Badge variant="secondary">{props.Prototype}</Badge>
        <Button asChild variant="ghost" size="sm">
          <a href="#profile">{props.ProfileName}</a>
        </Button>
      </Group>
    </Block>
  );
}

function HeroChat({ hero }: { hero: HeroProps }) {
  return (
    <Block tag="section" className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Grid className="gap-0 md:grid-cols-2">
        <GridCol>
          <Box className="border-b border-border p-6 md:border-b-0 md:border-r">
            <Stack className="gap-6">
              <Stack className="gap-2">
                <Badge variant="outline">AI workspace</Badge>
                <H1 className="text-3xl font-bold tracking-tight md:text-4xl">{hero.Title}</H1>
                <Text className="text-sm leading-relaxed text-muted-foreground md:text-base">{hero.Subtitle}</Text>
              </Stack>
              <Box className="rounded-lg border border-border bg-background p-4 shadow-sm">
                <Textarea
                  name="prompt"
                  placeholder={hero.Prompt}
                  rows={4}
                  className="min-h-28 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Group className="mt-4 items-center justify-between gap-2">
                  <Group className="items-center gap-2">
                    <Button variant="outline" size="sm" aria-label={hero.AttachmentLabel}>+</Button>
                    <Button variant="outline" size="sm" aria-label={hero.AssistantLabel}>AI</Button>
                    <Button variant="ghost" size="sm" aria-label={hero.ShortcutLabel}>/</Button>
                  </Group>
                  <Button variant="default" size="sm">{hero.PrimaryAction}</Button>
                </Group>
              </Box>
              <Stack className="gap-2">
                <Text className="text-xs font-medium text-muted-foreground">{hero.SuggestionsLabel}</Text>
                <Group className="flex flex-wrap gap-2">
                  {hero.Suggestions.map((suggestion) => (
                    <Badge key={suggestion} variant="secondary">{suggestion}</Badge>
                  ))}
                </Group>
              </Stack>
            </Stack>
          </Box>
        </GridCol>
        <GridCol>
          <Box className="bg-muted/30 p-6">
            <Stack className="gap-4">
              <Text className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workflow</Text>
              {hero.Workflow.map((step, index) => (
                <Group
                  key={step.Label}
                  className="items-center gap-4 rounded-md border border-border bg-card px-4 py-4 shadow-sm"
                >
                  <IconBadge
                    size="sm"
                    variant={workflowStepVariant(index)}
                  >
                    {workflowStepLabel(index)}
                  </IconBadge>
                  <Text className="text-sm font-medium">{step.Label}</Text>
                </Group>
              ))}
            </Stack>
          </Box>
        </GridCol>
      </Grid>
    </Block>
  );
}

function ToolCards({ items }: { items: ToolCard[] }) {
  return (
    <Grid className="gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <GridCol key={item.Title}>
          <Card asChild variant="default" className="h-full hover:bg-muted/20">
            <article>
            <CardContent className="p-6">
              <Group className="items-start gap-4">
                <IconBadge
                  size="default"
                  className={blockVariant(homeVariants, "toolTone", item.Tone)}
                >
                  {toolIconLetter(item.Icon)}
                </IconBadge>
                <Stack className="gap-2">
                  <Text className="text-sm font-semibold">{item.Title}</Text>
                  <Text className="text-xs leading-relaxed text-muted-foreground">{item.Description}</Text>
                </Stack>
              </Group>
            </CardContent>
            </article>
          </Card>
        </GridCol>
      ))}
    </Grid>
  );
}

function ShowcaseCardView({ item }: { item: ShowcaseItem }) {
  return (
    <Card asChild variant="raised" className="h-full">
      <article>
      <CardContent className="p-6">
        <Stack className="gap-4">
          <Box className="flex h-28 items-center justify-center rounded-md border border-dashed border-border bg-muted/50">
            <IconBadge size="lg" variant="accent">{showcaseIconLetter(item.Name)}</IconBadge>
          </Box>
          <Group className="items-start justify-between gap-4">
            <Stack className="gap-2">
              <H3 className="text-base font-semibold">{item.Name}</H3>
              <Text className="text-sm leading-relaxed text-muted-foreground">{item.Description}</Text>
            </Stack>
            <Badge variant="outline">{item.Category}</Badge>
          </Group>
          <Stack className="gap-2">
            {item.Capabilities.map((capability) => (
              <Group key={capability} className="items-center gap-2">
                <IconBadge size="xs" variant="secondary">✓</IconBadge>
                <Text className="text-xs text-muted-foreground">{capability}</Text>
              </Group>
            ))}
          </Stack>
          <Group className="gap-2">
            <Button asChild variant="default" size="sm">
              <a href="#use">{item.UseLabel}</a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="#preview">{item.PreviewLabel}</a>
            </Button>
          </Group>
        </Stack>
      </CardContent>
      </article>
    </Card>
  );
}

function ShowcaseGrid({ showcase }: { showcase: ShowcaseProps }) {
  return (
    <Stack className="gap-6">
      <Group className="items-end justify-between gap-4">
        <Stack className="gap-2">
          <H2 className="text-xl font-semibold tracking-tight">{showcase.Title}</H2>
          <Text className="text-sm text-muted-foreground">{showcase.Description}</Text>
        </Stack>
        <Button asChild variant="outline" size="sm">
          <a href="#templates">{showcase.ActionLabel}</a>
        </Button>
      </Group>
      <Grid className="gap-4 md:grid-cols-2 xl:grid-cols-3">
        {showcase.Items.map((item) => (
          <GridCol key={item.Name}>
            <ShowcaseCardView item={item} />
          </GridCol>
        ))}
      </Grid>
    </Stack>
  );
}

function PrototypeNotice({ notice }: { notice: NoticeProps }) {
  return (
    <Alert variant="default" role="status" aria-live="polite">
      <Group className="items-center justify-between gap-4 flex-wrap">
        <Stack className="gap-2">
          <Text className="text-sm font-semibold">{notice.Title}</Text>
          <Text className="text-sm text-muted-foreground">{notice.Description}</Text>
        </Stack>
        <Button asChild variant="outline" size="sm">
          <a href="#prototype-mode">{notice.ActionLabel}</a>
        </Button>
      </Group>
    </Alert>
  );
}

export type HomePageViewProps = {
  props: HomePageProps;
};

export function HomePageView({ props }: HomePageViewProps) {
  return (
    <Block tag="main" className="min-h-screen bg-muted/30 text-foreground">
      <CatalogMobileSheet props={props} />
      <Group className="min-h-screen w-full items-stretch">
        <CatalogSidebar props={props} />
        <Box className="flex min-w-0 flex-1 flex-col bg-background">
          <CatalogHeader props={props} />
          <Box className="flex flex-1 flex-col gap-8 p-4 md:p-8">
            <HeroChat hero={props.Hero} />
            <ToolCards items={props.Tools} />
            <ShowcaseGrid showcase={props.Showcase} />
            <PrototypeNotice notice={props.Notice} />
          </Box>
        </Box>
      </Group>
    </Block>
  );
}

export function HomePage() {
  const props = defaultHomePage;
  return <HomePageView props={props} />;
}
