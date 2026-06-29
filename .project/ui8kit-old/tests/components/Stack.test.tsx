import { render, screen } from "@tests/utils/test-utils";
import { Stack } from "@/components/ui/Stack";

describe("Stack", () => {
  it("renders children", () => {
    render(
      <Stack data-testid="s">
        <div>Child</div>
      </Stack>
    );
    expect(screen.getByTestId("s")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Stack p="4" bg="primary" data-testid="s">
        Child
      </Stack>,
    );
    const el = screen.getByTestId("s");
    expect(el).toHaveClass("p-4");
    expect(el).toHaveClass("bg-primary");
    expect(el.getAttribute("p")).toBeNull();
    expect(el.getAttribute("bg")).toBeNull();
  });
});


