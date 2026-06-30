import { type ReactNode } from "react";
import { Badge, Group, Stack, Text, Title } from "@registry/ui";

export function GallerySection({ children }: { children: ReactNode }) {
  return (
    <Stack className="gap-4">
      <Group className="items-end justify-between gap-4">
        <Stack className="gap-2">
          <Title as={2} className="text-lg font-semibold tracking-tight">
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
