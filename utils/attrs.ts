import type { HTMLAttributes } from "react";

export type AttrMap = Record<string, string | number | boolean | undefined>;

export function mergeAttrs(...parts: AttrMap[]): AttrMap {
  const out: AttrMap = {};
  for (const attrs of parts) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v !== undefined) out[k] = v;
    }
  }
  return out;
}

export function domAttrs(
  id?: string,
  role?: string,
  tabIndex?: string,
  attrs?: AttrMap
): AttrMap {
  const out = mergeAttrs(attrs ?? {});
  if (id?.trim()) out.id = id.trim();
  if (role?.trim()) out.role = role.trim();
  if (tabIndex?.trim()) out.tabIndex = tabIndex.trim();
  return out;
}

export function controlAttrs(
  id?: string,
  role?: string,
  tabIndex?: string,
  ariaLabel?: string,
  attrs?: AttrMap
): AttrMap {
  const out = domAttrs(id, role, tabIndex, attrs);
  delete out.id;
  if (ariaLabel?.trim()) out["aria-label"] = ariaLabel.trim();
  return out;
}

export function switchAttrs(
  checked: boolean,
  id?: string,
  role?: string,
  tabIndex?: string,
  ariaLabel?: string,
  attrs?: AttrMap
): AttrMap {
  const out = controlAttrs(id, role, tabIndex, ariaLabel, attrs);
  out.role = "switch";
  out["aria-checked"] = checked;
  return out;
}

export function ariaExpanded(value: boolean): AttrMap {
  return { "aria-expanded": value };
}

export function ariaControls(id?: string): AttrMap {
  if (!id?.trim()) return {};
  return { "aria-controls": id.trim() };
}

export function ariaCurrent(value?: string): AttrMap {
  if (!value?.trim()) return {};
  return { "aria-current": value.trim() };
}

export function ariaLive(value?: string): AttrMap {
  if (!value?.trim()) return {};
  return { "aria-live": value.trim() };
}

export function ariaModal(value: boolean): AttrMap {
  return { "aria-modal": value };
}

export function ariaLabel(value?: string): AttrMap {
  if (!value?.trim()) return {};
  return { "aria-label": value.trim() };
}

export function breadcrumbRootAttrs(
  ariaLabel?: string,
  dataUI8Kit?: string,
  attrs?: AttrMap
): AttrMap {
  const out = mergeAttrs(attrs ?? {});
  if (ariaLabel?.trim()) out["aria-label"] = ariaLabel.trim();
  if (dataUI8Kit?.trim()) out["data-ui8kit"] = dataUI8Kit.trim();
  return out;
}

export function breadcrumbItemAttrs(current: boolean): AttrMap {
  return current ? ariaCurrent("page") : {};
}

export function alertAttrs(role?: string, live?: string): AttrMap {
  return mergeAttrs(
    { role: role?.trim() || "status" },
    ariaLive(live?.trim() || "polite")
  );
}

export function spreadAttrs(map: AttrMap): HTMLAttributes<HTMLElement> {
  return map as HTMLAttributes<HTMLElement>;
}

export function defaultInputType(t?: string): string {
  return t?.trim() || "text";
}

export function defaultButtonType(t?: string): "button" | "submit" | "reset" {
  const v = t?.trim();
  if (v === "submit" || v === "reset") return v;
  return "button";
}

export function titleTag(order?: number): string {
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
    default:
      return "h2";
  }
}

export function textareaRows(rows?: number): number {
  return rows && rows > 0 ? rows : 4;
}
