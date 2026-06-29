import { render, screen } from "@tests/utils/test-utils";
import { Icon } from "@/components/ui/Icon";

describe("Icon", () => {
  it("renders children", () => {
    render(
      <Icon data-testid="i">
        X
      </Icon>
    );
    expect(screen.getByTestId("i")).toHaveTextContent("X");
  });

  it("renders lucideIcon component", () => {
    const LucideIcon = (props: { className?: string }) => (
      <svg data-testid="svg" className={props.className} />
    );

    render(<Icon data-testid="i" lucideIcon={LucideIcon} />);
    expect(screen.getByTestId("i")).toBeInTheDocument();
    expect(screen.getByTestId("svg")).toBeInTheDocument();
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Icon p="2" text="primary" data-testid="i">
        X
      </Icon>,
    );
    const el = screen.getByTestId("i");
    expect(el).toHaveClass("p-2");
    expect(el).toHaveClass("text-primary");
    expect(el.getAttribute("p")).toBeNull();
    expect(el.getAttribute("text")).toBeNull();
  });
});


