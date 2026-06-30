import { type ReactNode } from "react";
import { Block, Box, Group } from "@registry/ui";
import { defaultDashboardPage } from "../../data/dashboard";
import { DashboardHeader } from "./header";
import { DashboardHero } from "./hero";
import { DashboardMobileSheet } from "./mobile-sheet";
import { DashboardNotice } from "./notice";
import { DashboardSidebar } from "./sidebar";
import { GallerySection } from "./gallery";
import { LayerTable } from "./layer-table";
import { StatusCards } from "./status-cards";

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
