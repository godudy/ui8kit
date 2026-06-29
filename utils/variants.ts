import { cn } from "./cn";
import type { VariantRecipe } from "./recipe-types";

export type { VariantRecipe };

export type Variants = {
  base: string;
  keys: string[];
  defaults: Record<string, string>;
  byKey: Record<string, Record<string, string>>;
};

function isDevEnv(): boolean {
  try {
    const env = (import.meta as unknown as { env?: { DEV?: boolean } }).env;
    if (env && typeof env.DEV === "boolean") return env.DEV;
  } catch {
    // import.meta may be unavailable in some contexts
  }
  return false;
}

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
    } else if (isDevEnv()) {
      throw new Error(
        `[compose] unknown variant "${choice}" for key "${key}" (recipe id: ${String((v as Variants & { id?: string }).id ?? "?")})`
      );
    }
    // Unknown choices are silently dropped in production to avoid leaking
    // typos into the DOM as literal class names.
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
