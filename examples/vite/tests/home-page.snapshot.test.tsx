import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "../../../node_modules/react-dom/server";
import { defaultHomePage } from "../src/data/home";
import { HomePageView } from "../src/blocks/home/page";

describe("HomePage snapshot", () => {
  test("renders a single main landmark and semantic child landmarks", () => {
    const markup = renderToStaticMarkup(
      <HomePageView props={defaultHomePage} />
    );

    const mainCount = (markup.match(/<main\b/g) ?? []).length;
    expect(mainCount).toBe(1);

    expect(markup).toContain("<aside");
    expect(markup).toContain("<header");
    expect(markup).toContain("<section");

    // Guard against slipping back to tag-prop style landmark wrappers.
    expect(markup).not.toContain("tag=\"aside\"");
    expect(markup).not.toContain("tag=\"header\"");
    expect(markup).not.toContain("tag=\"section\"");
  });
});
