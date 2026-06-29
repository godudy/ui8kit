import { render, screen } from "@tests/utils/test-utils";
import { Title } from "@/components/ui/Title";

describe("Title", () => {
  it("renders as h{order}", () => {
    render(
      <Title order={3} data-testid="t">
        Hello
      </Title>
    );
    const el = screen.getByTestId("t");
    expect(el.tagName.toLowerCase()).toBe("h3");
    expect(el).toHaveTextContent("Hello");
  });

  it("applies truncate modifier", () => {
    render(
      <Title truncate="truncate" data-testid="t">
        X
      </Title>
    );
    expect(screen.getByTestId("t").className).toContain("truncate");
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Title p="2" text="primary" data-testid="t">
        Hello
      </Title>,
    );
    const el = screen.getByTestId("t");
    expect(el).toHaveClass("p-2");
    expect(el).toHaveClass("text-primary");
    expect(el.getAttribute("p")).toBeNull();
    expect(el.getAttribute("text")).toBeNull();
  });
});


