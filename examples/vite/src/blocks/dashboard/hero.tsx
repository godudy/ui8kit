import {
  Badge,
  Block,
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  Progress,
  Stack,
  Text,
  Title,
} from "@registry/ui";
import type { HeroProps } from "../../types/dashboard";

export function DashboardHero({ hero }: { hero: HeroProps }) {
  return (
    <Block tag="section" className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Box className="border-b border-border bg-muted/40 px-6 py-4">
        <Group className="items-center justify-between gap-4">
          <Badge variant="outline">{hero.Eyebrow}</Badge>
          <Group className="items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="/home/">{hero.SecondaryCTA}</a>
            </Button>
            <Button asChild variant="default" size="sm">
              <a href="#gallery">{hero.PrimaryCTA}</a>
            </Button>
          </Group>
        </Group>
      </Box>
      <Box className="px-6 py-6">
        <Grid className="gap-8 md:grid-cols-[1fr_auto]">
          <GridCol>
            <Stack className="max-w-2xl gap-4">
              <Title as={1} className="text-3xl font-bold tracking-tight md:text-4xl">
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
    </Block>
  );
}
