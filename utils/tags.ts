export enum TagGroup {
  Layout,
  BlockText,
  Inline,
  Heading,
  List,
  ListItem,
  Form,
  FormControl,
  FormLabel,
  Table,
  TableSection,
  TableRow,
  TableCell,
  TableColumn,
  Media,
  Disclosure,
  Stack,
  Group,
  Text,
  Container,
}

const layoutTags = new Set([
  "div",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "main",
  "nav",
  "figure",
  "search",
  "hgroup",
]);

const blockTextTags = new Set(["p", "blockquote", "figcaption", "address", "pre"]);
const inlineTags = new Set([
  "span",
  "em",
  "strong",
  "small",
  "abbr",
  "cite",
  "code",
  "kbd",
  "mark",
  "time",
  "data",
  "var",
  "samp",
  "sub",
  "sup",
  "b",
  "i",
  "u",
  "s",
  "q",
  "dfn",
  "bdo",
  "bdi",
  "ins",
  "del",
]);

function oneOf(tag: string, options: Set<string>): boolean {
  return options.has(tag);
}

export function isAllowedTag(tag: string, group: TagGroup): boolean {
  const t = tag.trim().toLowerCase();
  switch (group) {
    case TagGroup.Layout:
      return oneOf(t, layoutTags);
    case TagGroup.BlockText:
      return oneOf(t, blockTextTags);
    case TagGroup.Inline:
      return oneOf(t, inlineTags);
    case TagGroup.Heading:
      return oneOf(t, new Set(["h1", "h2", "h3", "h4", "h5", "h6"]));
    case TagGroup.List:
      return oneOf(t, new Set(["ul", "ol", "dl", "menu"]));
    case TagGroup.ListItem:
      return oneOf(t, new Set(["li", "dt", "dd"]));
    case TagGroup.Form:
      return oneOf(t, new Set(["form", "fieldset"]));
    case TagGroup.FormControl:
      return oneOf(
        t,
        new Set([
          "input",
          "textarea",
          "select",
          "button",
          "option",
          "optgroup",
          "datalist",
          "output",
          "meter",
          "progress",
        ])
      );
    case TagGroup.FormLabel:
      return oneOf(t, new Set(["label", "legend"]));
    case TagGroup.Table:
      return t === "table";
    case TagGroup.TableSection:
      return oneOf(t, new Set(["thead", "tbody", "tfoot"]));
    case TagGroup.TableRow:
      return t === "tr";
    case TagGroup.TableCell:
      return oneOf(t, new Set(["th", "td"]));
    case TagGroup.TableColumn:
      return oneOf(t, new Set(["colgroup", "col"]));
    case TagGroup.Media:
      return oneOf(t, new Set(["img", "picture", "source"]));
    case TagGroup.Disclosure:
      return oneOf(t, new Set(["details", "summary"]));
    case TagGroup.Stack:
      return layoutTags.has(t) || t === "ul" || t === "ol";
    case TagGroup.Group:
      return layoutTags.has(t) || t === "fieldset";
    case TagGroup.Text:
      return blockTextTags.has(t) || inlineTags.has(t);
    case TagGroup.Container:
      return oneOf(t, new Set(["div", "main", "section"]));
    default:
      return false;
  }
}

export function resolveTag(tag: string | undefined, fallback: string, group: TagGroup): string {
  const t = tag?.trim().toLowerCase() ?? "";
  if (!t) return fallback;
  return isAllowedTag(t, group) ? t : fallback;
}
