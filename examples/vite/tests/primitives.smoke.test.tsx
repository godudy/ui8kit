/**
 * Smoke coverage for every ui/* primitive.
 *
 * Each brick spec under ui/ declares `targets.react.test:` pointing here.
 * The point of these tests is to catch:
 *   - broken imports / removed exports
 *   - variant JSON that no longer resolves (throws in dev via composeRecipe)
 *   - tag policy regressions
 *   - basic aria / behavior-hook contract
 *
 * When adding a new primitive, add one describe() below and add
 * `targets.react.test: ../../examples/vite/tests/primitives.smoke.test.tsx`
 * to the primitive's spec.md.
 */
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";

import { Badge } from "../../../ui/badge/badge";
import { Block } from "../../../ui/block/block";
import { Box } from "../../../ui/box/box";
import { Button } from "../../../ui/button/button";
import { Checkbox } from "../../../ui/checkbox/checkbox";
import { Container } from "../../../ui/container/container";
import { Dialog } from "../../../ui/dialog/dialog";
import { Disclosure, Summary } from "../../../ui/disclosure/disclosure";
import { Form, FormItem, FormDescription, FormMessage } from "../../../ui/form/form";
import {
  DataList,
  DataOption,
  Fieldset,
  Legend,
  Meter,
  Output,
  Progress,
} from "../../../ui/form/controls";
import { Grid, GridCol } from "../../../ui/grid/grid";
import { Group } from "../../../ui/group/group";
import { H1, H2, H3, H4, H5, H6, Title } from "../../../ui/title/title";
import { Icon } from "../../../ui/icon/icon";
import { Image, Picture, Source } from "../../../ui/image/image";
import { Inline } from "../../../ui/inline/inline";
import { Input } from "../../../ui/input/input";
import { Label } from "../../../ui/label/label";
import { Break } from "../../../ui/linebreak/linebreak";
import { Link } from "../../../ui/link/link";
import { List, ListItem } from "../../../ui/list/list";
import { Radio } from "../../../ui/radio/radio";
import { Select, SelectOption, OptGroup } from "../../../ui/select/select";
import { Separator } from "../../../ui/separator/separator";
import { Stack } from "../../../ui/stack/stack";
import { Switch } from "../../../ui/switch/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCol,
  TableColGroup,
  TableFoot,
  TableHead,
  TableHeadCell,
  TableRow,
} from "../../../ui/table/table";
import { Text } from "../../../ui/text/text";
import { Textarea } from "../../../ui/textarea/textarea";

describe("ui/badge", () => {
  test("renders a div with recipe classes", () => {
    const html = renderToStaticMarkup(<Badge variant="secondary">x</Badge>);
    expect(html).toMatch(/^<div /);
    expect(html).toContain("class=");
    expect(html).toContain(">x</div>");
  });
});

describe("ui/block", () => {
  test("defaults to <div>", () => {
    const html = renderToStaticMarkup(<Block>ok</Block>);
    expect(html).toMatch(/^<div /);
  });

  test("emits landmark tags", () => {
    for (const tag of ["main", "header", "aside", "section", "nav", "footer", "article"]) {
      const html = renderToStaticMarkup(<Block tag={tag}>x</Block>);
      expect(html).toMatch(new RegExp(`^<${tag}\\b`));
    }
  });
});

describe("ui/box", () => {
  test("defaults to <div> and rejects landmark tags", () => {
    const html = renderToStaticMarkup(<Box>x</Box>);
    expect(html).toMatch(/^<div /);
  });
});

describe("ui/button", () => {
  test("renders <button> with default type", () => {
    const html = renderToStaticMarkup(<Button>Save</Button>);
    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain(">Save</button>");
  });

  test("asChild delegates root to child", () => {
    const html = renderToStaticMarkup(
      <Button asChild variant="outline">
        <a href="/docs">Docs</a>
      </Button>
    );
    expect(html).toMatch(/^<a /);
    expect(html).toContain('href="/docs"');
    expect(html).toContain(">Docs</a>");
  });
});

describe("ui/checkbox", () => {
  test('renders <input type="checkbox">', () => {
    const html = renderToStaticMarkup(<Checkbox />);
    expect(html).toContain('type="checkbox"');
  });
});

describe("ui/container", () => {
  test("renders as div by default", () => {
    const html = renderToStaticMarkup(<Container>x</Container>);
    expect(html).toMatch(/^<div /);
  });
});

describe("ui/dialog", () => {
  test("renders <dialog>", () => {
    const html = renderToStaticMarkup(<Dialog>ok</Dialog>);
    expect(html).toContain("<dialog");
  });

  test("ui8kit behavior emits data-ui8kit=dialog", () => {
    const html = renderToStaticMarkup(<Dialog behavior="ui8kit">ok</Dialog>);
    expect(html).toContain('data-ui8kit="dialog"');
  });
});

describe("ui/disclosure", () => {
  test("renders <details>/<summary>", () => {
    const html = renderToStaticMarkup(
      <Disclosure>
        <Summary>Toggle</Summary>
        <p>body</p>
      </Disclosure>
    );
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
  });
});

describe("ui/form", () => {
  test("Form parts render", () => {
    const html = renderToStaticMarkup(
      <Form>
        <FormItem>
          <FormDescription>hint</FormDescription>
          <FormMessage>err</FormMessage>
        </FormItem>
      </Form>
    );
    expect(html).toContain("<form");
    expect(html).toContain('role="alert"');
  });
});

describe("ui/form/controls", () => {
  test("controls render their native tags", () => {
    const html = renderToStaticMarkup(
      <Fieldset>
        <Legend>legend</Legend>
        <Progress value={50} max={100} />
        <Meter value={0.5} />
        <Output>out</Output>
        <DataList id="list">
          <DataOption value="a" />
        </DataList>
      </Fieldset>
    );
    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend");
    expect(html).toContain("<progress");
    expect(html).toContain("<meter");
    expect(html).toContain("<output");
    expect(html).toContain("<datalist");
    expect(html).toContain("<option");
  });
});

describe("ui/grid", () => {
  test("Grid + GridCol render", () => {
    const html = renderToStaticMarkup(
      <Grid cols="2">
        <GridCol span={1}>a</GridCol>
        <GridCol span={1} start={2}>
          b
        </GridCol>
      </Grid>
    );
    expect(html).toContain("grid-cols-2");
    expect(html).toContain("col-span-1");
    expect(html).toContain("col-start-2");
  });
});

describe("ui/group", () => {
  test("horizontal flex base", () => {
    const html = renderToStaticMarkup(<Group>x</Group>);
    expect(html).toContain("flex");
  });
});

describe("ui/icon", () => {
  test("default renders decorative <span>", () => {
    const html = renderToStaticMarkup(<Icon />);
    expect(html).toContain('aria-hidden="true"');
  });

  test("svg type renders <svg>", () => {
    const html = renderToStaticMarkup(<Icon type="svg" href="#icon" title="save" />);
    expect(html).toContain("<svg");
    expect(html).toContain("<title>save</title>");
  });
});

describe("ui/image", () => {
  test("renders <img> with default loading/decoding", () => {
    const html = renderToStaticMarkup(<Image src="/logo.png" alt="logo" />);
    expect(html).toContain("<img");
    expect(html).toContain('src="/logo.png"');
    expect(html).toContain('loading="lazy"');
  });

  test("Picture + Source render", () => {
    const html = renderToStaticMarkup(
      <Picture>
        <Source srcSet="a.webp" type="image/webp" />
      </Picture>
    );
    expect(html).toContain("<picture");
    expect(html).toContain("<source");
  });
});

describe("ui/inline", () => {
  test("renders <span>", () => {
    const html = renderToStaticMarkup(<Inline>x</Inline>);
    expect(html).toContain("<span");
    expect(html).toContain(">x</span>");
  });
});

describe("ui/input", () => {
  test("defaults type to text", () => {
    const html = renderToStaticMarkup(<Input />);
    expect(html).toContain('type="text"');
  });
});

describe("ui/label", () => {
  test("renders <label> with htmlFor", () => {
    const html = renderToStaticMarkup(<Label htmlFor="x">L</Label>);
    expect(html).toContain('for="x"');
  });
});

describe("ui/linebreak", () => {
  test("renders <br> by default and <wbr> when type=wbr", () => {
    expect(renderToStaticMarkup(<Break />)).toContain("<br");
    expect(renderToStaticMarkup(<Break type="wbr" />)).toContain("<wbr");
  });
});

describe("ui/link", () => {
  test("renders <a> and computes rel for external", () => {
    const html = renderToStaticMarkup(<Link href="https://x" external>go</Link>);
    expect(html).toContain('href="https://x"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});

describe("ui/list", () => {
  test("List defaults to <ul>, ListItem to <li>", () => {
    const html = renderToStaticMarkup(
      <List>
        <ListItem>a</ListItem>
      </List>
    );
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
  });
});

describe("ui/radio", () => {
  test('renders <input type="radio">', () => {
    const html = renderToStaticMarkup(<Radio />);
    expect(html).toContain('type="radio"');
  });
});

describe("ui/select", () => {
  test("renders <select> with options + option groups", () => {
    const html = renderToStaticMarkup(
      <Select options={[{ value: "a", label: "A" }]}>
        <OptGroup label="grp">
          <SelectOption value="b" label="B" />
        </OptGroup>
      </Select>
    );
    expect(html).toContain("<select");
    expect(html).toContain("<optgroup");
    expect(html).toContain('value="a"');
    expect(html).toContain('value="b"');
  });
});

describe("ui/separator", () => {
  test("renders <hr>", () => {
    const html = renderToStaticMarkup(<Separator />);
    expect(html).toContain("<hr");
  });

  test("decorative separator marks presentation", () => {
    const html = renderToStaticMarkup(<Separator decorative />);
    expect(html).toContain('role="presentation"');
    expect(html).toContain('aria-hidden="true"');
  });
});

describe("ui/stack", () => {
  test("vertical flex base", () => {
    const html = renderToStaticMarkup(<Stack>x</Stack>);
    expect(html).toContain("flex-col");
  });
});

describe("ui/switch", () => {
  test('renders <input type="checkbox" role="switch">', () => {
    const html = renderToStaticMarkup(<Switch checked readOnly />);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-checked="true"');
  });
});

describe("ui/table", () => {
  test("full table skeleton renders", () => {
    const html = renderToStaticMarkup(
      <Table>
        <TableCaption>cap</TableCaption>
        <TableColGroup span={1}>
          <TableCol span={1} />
        </TableColGroup>
        <TableHead>
          <TableRow>
            <TableHeadCell scope="col">H</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>C</TableCell>
          </TableRow>
        </TableBody>
        <TableFoot>
          <TableRow>
            <TableCell>F</TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    );
    for (const tag of [
      "<table",
      "<caption",
      "<colgroup",
      "<col",
      "<thead",
      "<tbody",
      "<tfoot",
      "<tr",
      "<th",
      "<td",
    ]) {
      expect(html).toContain(tag);
    }
    expect(html).toContain('scope="col"');
  });
});

describe("ui/text", () => {
  test("renders <p>", () => {
    const html = renderToStaticMarkup(<Text>x</Text>);
    expect(html).toContain("<p");
    expect(html).toContain(">x</p>");
  });
});

describe("ui/textarea", () => {
  test("renders <textarea>", () => {
    const html = renderToStaticMarkup(<Textarea rows={3} />);
    expect(html).toContain("<textarea");
    expect(html).toContain('rows="3"');
  });
});

describe("ui/title", () => {
  test("Title with explicit as={1} renders <h1>", () => {
    const html = renderToStaticMarkup(<Title as={1}>t</Title>);
    expect(html).toContain("<h1");
  });

  test("H1–H6 shortcuts produce matching heading tags", () => {
    const cases: Array<[React.ComponentType<{ children?: React.ReactNode }>, string]> = [
      [H1, "<h1"],
      [H2, "<h2"],
      [H3, "<h3"],
      [H4, "<h4"],
      [H5, "<h5"],
      [H6, "<h6"],
    ];
    for (const [Comp, expected] of cases) {
      expect(renderToStaticMarkup(<Comp>h</Comp>)).toContain(expected);
    }
  });
});
