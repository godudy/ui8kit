type VariantRecipe = {
  byKey?: Record<string, Record<string, string>>;
  defaults?: Record<string, string>;
};

export function blockVariant(recipe: VariantRecipe, key: string, value: string): string {
  const choices = recipe.byKey?.[key];
  if (!choices) return "";
  if (choices[value]) return choices[value];
  return recipe.defaults?.[key] ?? "";
}
