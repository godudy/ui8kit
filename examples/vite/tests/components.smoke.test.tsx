/**
 * Smoke coverage for every components/* composite.
 *
 * Each composite spec declares `targets.react.test:` pointing here (except
 * `components/sheet/sheet.spec.md`, which owns its own contract test at
 * `examples/vite/tests/sheet-ui8kit-contract.test.tsx`).
 */
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";

import { Alert } from "../../../components/alert/alert";
import { Breadcrumb } from "../../../components/breadcrumb/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/card/card";
import { IconBadge } from "../../../components/iconbadge/iconbadge";
import { Nav, NavItem, NavLink, NavList } from "../../../components/nav/nav";

describe("components/alert", () => {
  test("renders div with role=status + polite aria-live by default", () => {
    const html = renderToStaticMarkup(<Alert>note</Alert>);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  test("destructive variant + role=alert + assertive works together", () => {
    const html = renderToStaticMarkup(
      <Alert variant="destructive" role="alert" aria-live="assertive">
        err
      </Alert>
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-live="assertive"');
  });
});

describe("components/breadcrumb", () => {
  test("renders nav > ol > li structure with current marker", () => {
    const html = renderToStaticMarkup(
      <Breadcrumb
        aria-label="Breadcrumb"
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", current: true },
        ]}
      />
    );
    expect(html).toContain("<nav");
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain("<ol");
    expect(html).toContain('href="/"');
    expect(html).toContain('aria-current="page"');
  });

  test("ui8kit behavior emits data-ui8kit=breadcrumb", () => {
    const html = renderToStaticMarkup(<Breadcrumb behavior="ui8kit" items={[{ label: "H" }]} />);
    expect(html).toContain('data-ui8kit="breadcrumb"');
  });
});

describe("components/card", () => {
  test("named parts compose", () => {
    const html = renderToStaticMarkup(
      <Card variant="default">
        <CardHeader>
          <CardTitle as={2}>Hello</CardTitle>
          <CardDescription>d</CardDescription>
        </CardHeader>
        <CardContent>c</CardContent>
        <CardFooter>f</CardFooter>
      </Card>
    );
    expect(html).toContain("<h2");
    expect(html).toContain(">Hello</h2>");
    expect(html).toContain(">d</p>");
    expect(html).toContain(">c</div>");
  });

  test("asChild delegates root", () => {
    const html = renderToStaticMarkup(
      <Card asChild variant="default">
        <article>a</article>
      </Card>
    );
    expect(html).toMatch(/^<article /);
  });
});

describe("components/iconbadge", () => {
  test("renders <span> with children", () => {
    const html = renderToStaticMarkup(
      <IconBadge size="sm" variant="accent">
        H
      </IconBadge>
    );
    expect(html).toMatch(/^<span /);
    expect(html).toContain(">H</span>");
  });
});

describe("components/nav", () => {
  test("Nav + NavList + NavItem + NavLink render with aria-current for active", () => {
    const html = renderToStaticMarkup(
      <Nav aria-label="Primary">
        <NavList orientation="horizontal">
          <NavItem>
            <NavLink href="/" active>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/about">About</NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
    expect(html).toContain("<nav");
    expect(html).toContain('aria-label="Primary"');
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
    expect(html).toContain('href="/"');
    expect(html).toContain('aria-current="page"');
  });

  test("disabled NavLink degrades to <span>", () => {
    const html = renderToStaticMarkup(
      <Nav>
        <NavList>
          <NavItem>
            <NavLink href="/x" disabled>
              X
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );
    expect(html).toContain("<span");
    expect(html).toContain('aria-disabled="true"');
  });
});
