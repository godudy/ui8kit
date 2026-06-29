import { render, screen } from "@tests/utils/test-utils";
import { Text } from "@/components/ui/Text";

describe("Text", () => {
  it("renders as default component", () => {
    render(
      <Text data-testid="t">
        Hello
      </Text>
    );
    const el = screen.getByTestId("t");
    expect(el.tagName.toLowerCase()).toBe("p");
    expect(el).toHaveTextContent("Hello");
  });

  it("renders as custom component", () => {
    render(
      <Text component="span" data-testid="t">
        Hi
      </Text>
    );
    expect(screen.getByTestId("t").tagName.toLowerCase()).toBe("span");
  });

  it("applies typography modifiers", () => {
    render(
      <Text italic="italic" underline="underline" truncate="truncate" data-testid="t">
        X
      </Text>
    );
    const el = screen.getByTestId("t");
    expect(el.className).toContain("italic");
    expect(el.className).toContain("underline");
    expect(el.className).toContain("truncate");
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Text p="2" text="primary" data-testid="t">
        Hello
      </Text>,
    );
    const el = screen.getByTestId("t");
    expect(el).toHaveClass("p-2");
    expect(el).toHaveClass("text-primary");
    expect(el.getAttribute("p")).toBeNull();
    expect(el.getAttribute("text")).toBeNull();
  });
});


