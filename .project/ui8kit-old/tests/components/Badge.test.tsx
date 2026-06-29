import { render, screen } from "@tests/utils/test-utils";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Hi</Badge>);
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("applies variant styles", () => {
    render(
      <Badge
        data-testid="badge"
        variant="secondary"
      >
        X
      </Badge>
    );
    const el = screen.getByTestId("badge");
    expect(el.className).toContain("bg-secondary");
    expect(el.className).toContain("text-secondary-foreground");
    expect(el.className).toContain("inline-flex");
    expect(el.className).toContain("items-center");
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Badge p="4" bg="primary" data-testid="badge">
        U
      </Badge>,
    );
    const el = screen.getByTestId("badge");
    expect(el).toHaveClass("p-4");
    expect(el).toHaveClass("bg-primary");
    expect(el.getAttribute("p")).toBeNull();
    expect(el.getAttribute("bg")).toBeNull();
  });
});


