export function navIconLetter(icon?: string): string {
  const trimmed = (icon ?? "").trim();
  if (!trimmed) return "•";
  return trimmed[0].toUpperCase();
}

export function navIconVariant(active?: boolean): string {
  return active ? "accent" : "secondary";
}

export function toolIconLetter(icon?: string): string {
  return navIconLetter(icon);
}

export function workflowStepLabel(index: number): string {
  return String.fromCharCode("1".charCodeAt(0) + index);
}

export function workflowStepVariant(index: number): string {
  return index === 0 ? "accent" : "secondary";
}

export function showcaseIconLetter(name?: string): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "?";
  return trimmed[0].toUpperCase();
}
