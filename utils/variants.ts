import { cn } from "./cn";
import type { RecipeKey, VariantRecipe } from "./recipe-types";

export type { RecipeKey, VariantRecipe };

export type Variants = {
  id?: string;
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

export function recipeToVariants<R extends VariantRecipe>(recipe: R): Variants {
  return {
    id: recipe.id,
    base: recipe.base,
    keys: recipe.keys,
    defaults: recipe.defaults ?? {},
    byKey: recipe.byKey,
  };
}

/**
 * Merge base, variant selections, and optional tail classes.
 * Mirrors Go `utils.Compose`. The id from the recipe is preserved on the
 * `Variants` shape so the dev-mode error reports a real id instead of "?".
 */
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
        `[compose] unknown variant "${choice}" for key "${key}" (recipe id: ${String(v.id ?? "?")})`
      );
    }
    // Unknown choices are silently dropped in production to avoid leaking
    // typos into the DOM as literal class names.
  }
  return cn(...parts, ...extra);
}

/**
 * Selection type for `composeRecipe`. Each key in the recipe's `byKey` maps
 * to its literal-union `RecipeKey` (or `undefined`).
 */
export type RecipeSelection<R extends VariantRecipe> = {
  [K in keyof R["byKey"] & string]?: RecipeKey<R, K>;
};

/**
 * Compose classes from a typed recipe. Generic over `R` so `selection` is
 * checked against the recipe's literal keys — no `as VariantRecipe` casts.
 */
export function composeRecipe<R extends VariantRecipe>(
  recipe: R,
  selection: RecipeSelection<R>,
  ...extra: (string | undefined | null | false)[]
): string {
  return compose(recipeToVariants(recipe), selection as Record<string, string>, ...extra);
}

/**
 * Derived literal-union types for every dimension in a recipe.
 *   type ButtonKeys = RecipeKeys<typeof buttonRecipe>;
 *   // ^? { variant: "default" | "destructive" | ...; size: "default" | ... }
 */
export type RecipeKeys<R extends VariantRecipe> = {
  [K in keyof R["byKey"] & string]: RecipeKey<R, K>;
};

/**
 * Identity helper that narrows a JSON-imported recipe to `VariantRecipe` and
 * exposes the derived literal-union types via `keys`. Use it to drop the
 * `type X = RecipeKey<typeof recipe, "x">` triplet from each brick file:
 *
 *   const { recipe, keys } = defineRecipe(buttonRecipe);
 *   type ButtonVariant = typeof keys.variant;
 *   type ButtonSize = typeof keys.size;
 *
 * `keys` is a phantom object — its runtime value is empty; only its type
 * (derived from `R`) is meaningful.
 */
export function defineRecipe<R extends VariantRecipe>(recipe: R): {
  recipe: R;
  keys: RecipeKeys<R>;
} {
  return { recipe, keys: {} as RecipeKeys<R> };
}
