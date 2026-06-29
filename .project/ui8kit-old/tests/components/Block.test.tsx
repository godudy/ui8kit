import { render, screen } from "@tests/utils/test-utils";
import { Block } from "@/components/ui/Block";

describe("Block", () => {
  it("renders children", () => {
    render(
      <Block data-testid="b">
        Hi
      </Block>
    );
    expect(screen.getByTestId("b")).toHaveTextContent("Hi");
  });

  it("supports custom component tag", () => {
    render(
      <Block component="section" data-testid="b">
        X
      </Block>
    );
    expect(screen.getByTestId("b").tagName.toLowerCase()).toBe("section");
  });

  it("applies custom className", () => {
    render(<Block className="custom-block">Content</Block>);
    const block = screen.getByText("Content");
    expect(block).toHaveClass("custom-block");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Block ref={ref}>Ref test</Block>);
    expect(ref).toHaveBeenCalled();
  });

  it("passes through other props", () => {
    render(<Block data-testid="test-block">Test</Block>);
    expect(screen.getByTestId("test-block")).toBeInTheDocument();
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Block p="4" bg="primary" rounded="lg" data-testid="b">
        U
      </Block>,
    );
    const el = screen.getByTestId("b");
    expect(el).toHaveClass("p-4");
    expect(el).toHaveClass("bg-primary");
    expect(el).toHaveClass("rounded-lg");
    expect(el.getAttribute("p")).toBeNull();
    expect(el.getAttribute("bg")).toBeNull();
    expect(el.getAttribute("rounded")).toBeNull();
  });
});


