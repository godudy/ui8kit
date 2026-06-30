import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import { Group } from "../../../ui/group/group";
import { Stack } from "../../../ui/stack/stack";

describe("layout primitives", () => {
  afterEach(() => {
    mock.restore();
  });

  test("Stack renders vertical flex base classes", () => {
    const markup = renderToStaticMarkup(<Stack />);
    expect(markup).toContain("flex-col");
    expect(markup).toContain("flex");
  });

  test("Group renders horizontal flex base classes", () => {
    const markup = renderToStaticMarkup(<Group />);
    expect(markup).toContain("flex");
    expect(markup).toContain("min-w-0");
  });

  test("Stack rejects landmark tag aside and falls back to div", async () => {
    mock.module("../../../utils/env", () => ({
      isDevEnv: () => true,
    }));
    const { Stack: StackFresh } = await import("../../../ui/stack/stack");
    const warn = spyOn(console, "warn").mockImplementation(() => {});
    const markup = renderToStaticMarkup(<StackFresh tag="aside" />);
    expect(markup).toMatch(/^<div/);
    expect(markup).not.toContain("<aside");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
