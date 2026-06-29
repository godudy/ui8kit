export const TagGroup = {
  Layout: "Layout",
  BlockText: "BlockText",
  Inline: "Inline",
  Heading: "Heading",
  List: "List",
  ListItem: "ListItem",
  Form: "Form",
  FormControl: "FormControl",
  FormLabel: "FormLabel",
  Table: "Table",
  TableSection: "TableSection",
  TableRow: "TableRow",
  TableCell: "TableCell",
  TableColumn: "TableColumn",
  Media: "Media",
  Disclosure: "Disclosure",
  Stack: "Stack",
  Group: "Group",
  Text: "Text",
  Container: "Container",
} as const;

export type TagGroup = (typeof TagGroup)[keyof typeof TagGroup];

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

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const listTags = new Set(["ul", "ol", "dl", "menu"]);
const listItemTags = new Set(["li", "dt", "dd"]);
const formTags = new Set(["form", "fieldset"]);
const formControlTags = new Set([
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
]);
const formLabelTags = new Set(["label", "legend"]);
const tableSectionTags = new Set(["thead", "tbody", "tfoot"]);
const tableCellTags = new Set(["th", "td"]);
const tableColumnTags = new Set(["colgroup", "col"]);
const mediaTags = new Set(["img", "picture", "source"]);
const disclosureTags = new Set(["details", "summary"]);
const containerTags = new Set(["div", "main", "section"]);

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
      return oneOf(t, headingTags);
    case TagGroup.List:
      return oneOf(t, listTags);
    case TagGroup.ListItem:
      return oneOf(t, listItemTags);
    case TagGroup.Form:
      return oneOf(t, formTags);
    case TagGroup.FormControl:
      return oneOf(t, formControlTags);
    case TagGroup.FormLabel:
      return oneOf(t, formLabelTags);
    case TagGroup.Table:
      return t === "table";
    case TagGroup.TableSection:
      return oneOf(t, tableSectionTags);
    case TagGroup.TableRow:
      return t === "tr";
    case TagGroup.TableCell:
      return oneOf(t, tableCellTags);
    case TagGroup.TableColumn:
      return oneOf(t, tableColumnTags);
    case TagGroup.Media:
      return oneOf(t, mediaTags);
    case TagGroup.Disclosure:
      return oneOf(t, disclosureTags);
    case TagGroup.Stack:
      return layoutTags.has(t) || t === "ul" || t === "ol";
    case TagGroup.Group:
      return layoutTags.has(t) || t === "fieldset";
    case TagGroup.Text:
      return blockTextTags.has(t) || inlineTags.has(t);
    case TagGroup.Container:
      return oneOf(t, containerTags);
    default:
      return false;
  }
}

export function resolveTag(tag: string | undefined, fallback: string, group: TagGroup): string {
  const t = tag?.trim().toLowerCase() ?? "";
  if (!t) return fallback;
  return isAllowedTag(t, group) ? t : fallback;
}
