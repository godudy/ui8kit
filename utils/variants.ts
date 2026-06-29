import { cn } from "./cn";

/** JSON shape for `*.variants.json` (shared with Go variantgen). */
export type VariantRecipe = {
  id: string;
  base: string;
  keys: string[];
  defaults: Record<string, string>;
  byKey: Record<string, Record<string, string>>;
};

export type Variants = {
  base: string;
  keys: string[];
  defaults: Record<string, string>;
  byKey: Record<string, Record<string, string>>;
};

export function recipeToVariants(recipe: VariantRecipe): Variants {
  return {
    base: recipe.base,
    keys: recipe.keys,
    defaults: recipe.defaults ?? {},
    byKey: recipe.byKey,
  };
}

/** Merge base, variant selections, and optional tail classes (mirrors Go Compose). */
export function compose(
  v: Variants,
  selection: Record<string, string>,
  ...extra: (string | undefined | null | false)[]
): string {
  const parts: string[] = [];
  if (v.base.trim() !== "") {
    parts.push(v.base.trim());
  }
  for (const key of v.keys) {
    const choices = v.byKey[key];
    if (!choices) continue;
    let choice = (selection[key] ?? "").trim();
    if (!choice) {
      choice = (v.defaults[key] ?? "").trim();
    }
    if (!choice) continue;
    const cls = choices[choice];
    if (cls !== undefined) {
      if (cls.trim() !== "") parts.push(cls.trim());
    } else {
      parts.push(choice);
    }
  }
  return cn(...parts, ...extra);
}

export function composeRecipe(
  recipe: VariantRecipe,
  selection: Record<string, string>,
  ...extra: (string | undefined | null | false)[]
): string {
  return compose(recipeToVariants(recipe), selection, ...extra);
}
