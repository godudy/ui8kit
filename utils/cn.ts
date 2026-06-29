/** Join non-empty class fragments with a single space (mirrors Go uiutils.Cn). */
export function cn(...classes: (string | undefined | null | false)[]): string {
  const parts: string[] = [];
  for (const c of classes) {
    if (typeof c === "string" && c.trim() !== "") {
      parts.push(c.trim());
    }
  }
  return parts.join(" ");
}
