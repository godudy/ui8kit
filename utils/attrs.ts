export function defaultInputType(t?: string): string {
  return t?.trim() || "text";
}

export function defaultButtonType(t?: string): "button" | "submit" | "reset" {
  const v = t?.trim();
  if (v === "submit" || v === "reset") return v;
  return "button";
}

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function titleTag(order?: HeadingLevel): string {
  switch (order) {
    case 1:
      return "h1";
    case 3:
      return "h3";
    case 4:
      return "h4";
    case 5:
      return "h5";
    case 6:
      return "h6";
    case 2:
    default:
      return "h2";
  }
}

export function textareaRows(rows?: number): number {
  return rows && rows > 0 ? rows : 4;
}
