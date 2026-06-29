import { render, screen } from "@tests/utils/test-utils";
import { Box } from "@/components/ui/Box";

describe("Box", () => {
  it("renders children", () => {
    render(
      <Box data-testid="box">
        <span>Hi</span>
      </Box>
    );
    expect(screen.getByTestId("box")).toBeInTheDocument();
    expect(screen.getByText("Hi")).toBeInTheDocument();
  });

  it("supports component prop", () => {
    render(
      <Box component="section" data-testid="box">
        X
      </Box>
    );
    expect(screen.getByTestId("box").tagName.toLowerCase()).toBe("section");
  });

  it("applies custom className", () => {
    render(<Box className="custom-box">Content</Box>);
    const box = screen.getByText("Content");
    expect(box).toHaveClass("custom-box");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Box ref={ref}>Ref test</Box>);
    expect(ref).toHaveBeenCalled();
  });

  it("passes through other props", () => {
    render(<Box data-testid="test-box">Test</Box>);
    expect(screen.getByTestId("test-box")).toBeInTheDocument();
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Box p="4" bg="primary" rounded="lg" flex data-testid="box">
        U
      </Box>,
    );
    const el = screen.getByTestId("box");
    expect(el).toHaveClass("p-4");
    expect(el).toHaveClass("bg-primary");
    expect(el).toHaveClass("rounded-lg");
    expect(el).toHaveClass("flex");
    expect(el.getAttribute("p")).toBeNull();
    expect(el.getAttribute("bg")).toBeNull();
    expect(el.getAttribute("rounded")).toBeNull();
    expect(el.getAttribute("flex")).toBeNull();
  });
});


