import { render, screen } from "@tests/utils/test-utils";
import userEvent from "@testing-library/user-event";
import { Sheet } from "@/components/Sheet";

describe("Sheet", () => {
  it("toggles input checkbox via trigger label", async () => {
    const user = userEvent.setup();

    render(
      <Sheet id="s1" openLabel="Open sheet">
        <div>Body</div>
      </Sheet>
    );

    const input = document.getElementById("s1") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.checked).toBe(false);

    await user.click(screen.getByLabelText("Open sheet"));
    expect(input.checked).toBe(true);
  });

  it("applies different size classes", () => {
    const sizes = [
      { size: "sm", expected: "w-64" },
      { size: "md", expected: "w-80" },
      { size: "lg", expected: "w-96" },
      { size: "xl", expected: "w-[28rem]" },
      { size: "2xl", expected: "w-[32rem]" },
      { size: "full", expected: "w-full" },
    ] as const;

    sizes.forEach(({ size, expected }) => {
      const { unmount } = render(
        <Sheet id={`s-${size}`} size={size}>
          <div>Body</div>
        </Sheet>
      );

      const panel = document.querySelector('[data-class="sheet-panel"]');
      expect(panel).toHaveClass(expected);
      unmount();
    });
  });

  it("renders title when provided", () => {
    render(
      <Sheet id="s3" title="My Sheet" data-testid="sheet">
        <div>Body</div>
      </Sheet>
    );

    expect(screen.getByText("My Sheet")).toBeInTheDocument();
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Sheet p="4" bg="card" data-testid="sheet">
        <div>Body</div>
      </Sheet>,
    );
    const sheet = screen.getByTestId("sheet");
    expect(sheet).toHaveClass("p-4");
    expect(sheet).toHaveClass("bg-card");
    expect(sheet.getAttribute("p")).toBeNull();
    expect(sheet.getAttribute("bg")).toBeNull();
  });
});


