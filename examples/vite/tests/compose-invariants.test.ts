import { afterEach, describe, expect, mock, test } from "bun:test";
import type { Variants } from "../../../utils/variants";

const recipe: Variants = {
  id: "test.recipe",
  base: "base-class",
  keys: ["variant"],
  defaults: { variant: "default" },
  byKey: {
    variant: {
      default: "variant-default",
      accent: "variant-accent",
    },
  },
};

describe("compose invariants", () => {
  afterEach(() => {
    mock.restore();
  });

  test("happy path with explicit selection", async () => {
    const { compose } = await import("../../../utils/variants");
    const cls = compose(recipe, { variant: "accent" });
    expect(cls).toContain("base-class");
    expect(cls).toContain("variant-accent");
    expect(cls).not.toContain("variant-default");
  });

  test("missing default for non-empty byKey throws in dev", async () => {
    mock.module("../../../utils/env", () => ({
      isDevEnv: () => true,
    }));
    const { compose } = await import("../../../utils/variants");

    const broken: Variants = {
      id: "broken.recipe",
      base: "",
      keys: ["variant"],
      defaults: {},
      byKey: { variant: { default: "x" } },
    };

    expect(() => compose(broken, {})).toThrow(/missing default for key "variant"/);
    expect(() => compose(broken, {})).toThrow(/broken\.recipe/);
  });

  test("unknown variant choice throws in dev", async () => {
    mock.module("../../../utils/env", () => ({
      isDevEnv: () => true,
    }));
    const { compose } = await import("../../../utils/variants");

    expect(() => compose(recipe, { variant: "nope" })).toThrow(
      /unknown variant "nope" for key "variant"/
    );
  });

  test("unknown variant is dropped silently in production", async () => {
    mock.module("../../../utils/env", () => ({
      isDevEnv: () => false,
    }));
    const { compose } = await import("../../../utils/variants");

    const cls = compose(recipe, { variant: "nope" });
    expect(cls).toBe("base-class");
    expect(cls).not.toContain("nope");
  });
});
