import { render, screen } from "@tests/utils/test-utils";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordion";

describe("Accordion", () => {
  it("toggles item in uncontrolled single mode when collapsible=true", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible defaultValue="">
        <AccordionItem value="a">
          <AccordionTrigger>Title</AccordionTrigger>
          <AccordionContent data-testid="content">Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const content = screen.getByTestId("content");
    expect(content.getAttribute("data-state")).toBe("closed");

    await user.click(screen.getByRole("button", { name: /title/i }));
    expect(content.getAttribute("data-state")).toBe("open");

    await user.click(screen.getByRole("button", { name: /title/i }));
    expect(content.getAttribute("data-state")).toBe("closed");
  });

  it("toggles multiple items in multiple mode", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="multiple" defaultValue={[]}>
        <AccordionItem value="a">
          <AccordionTrigger>Title A</AccordionTrigger>
          <AccordionContent data-testid="content-a">Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Title B</AccordionTrigger>
          <AccordionContent data-testid="content-b">Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const contentA = screen.getByTestId("content-a");
    const contentB = screen.getByTestId("content-b");
    expect(contentA.getAttribute("data-state")).toBe("closed");
    expect(contentB.getAttribute("data-state")).toBe("closed");

    await user.click(screen.getByRole("button", { name: /title a/i }));
    expect(contentA.getAttribute("data-state")).toBe("open");
    expect(contentB.getAttribute("data-state")).toBe("closed");

    await user.click(screen.getByRole("button", { name: /title b/i }));
    expect(contentA.getAttribute("data-state")).toBe("open");
    expect(contentB.getAttribute("data-state")).toBe("open");

    await user.click(screen.getByRole("button", { name: /title a/i }));
    expect(contentA.getAttribute("data-state")).toBe("closed");
    expect(contentB.getAttribute("data-state")).toBe("open");
  });

  it("works in controlled mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { rerender } = render(
      <Accordion type="single" value="" onValueChange={onValueChange}>
        <AccordionItem value="a">
          <AccordionTrigger>Title</AccordionTrigger>
          <AccordionContent data-testid="content">Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const content = screen.getByTestId("content");
    expect(content.getAttribute("data-state")).toBe("closed");

    await user.click(screen.getByRole("button", { name: /title/i }));
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("handles defaultValue for multiple type", () => {
    render(
      <Accordion type="multiple" defaultValue={["a"]}>
        <AccordionItem value="a">
          <AccordionTrigger>Title A</AccordionTrigger>
          <AccordionContent data-testid="content-a">Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Title B</AccordionTrigger>
          <AccordionContent data-testid="content-b">Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId("content-a").getAttribute("data-state")).toBe("open");
    expect(screen.getByTestId("content-b").getAttribute("data-state")).toBe("closed");
  });

  it("handles defaultValue for single type", () => {
    render(
      <Accordion type="single" defaultValue="b">
        <AccordionItem value="a">
          <AccordionTrigger>Title A</AccordionTrigger>
          <AccordionContent data-testid="content-a">Content A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Title B</AccordionTrigger>
          <AccordionContent data-testid="content-b">Content B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId("content-a").getAttribute("data-state")).toBe("closed");
    expect(screen.getByTestId("content-b").getAttribute("data-state")).toBe("open");
  });

  it("supports fast utility props without leaking them to DOM attributes", () => {
    render(
      <Accordion p="4" bg="primary" data-testid="accordion">
        <AccordionItem value="test" p="2">
          <AccordionTrigger text="secondary">Trigger</AccordionTrigger>
          <AccordionContent bg="muted">Content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const accordion = screen.getByTestId("accordion");
    expect(accordion).toHaveClass("p-4");
    expect(accordion).toHaveClass("bg-primary");
    expect(accordion.getAttribute("p")).toBeNull();
    expect(accordion.getAttribute("bg")).toBeNull();
  });

  it("throws error when AccordionItem is used outside Accordion", () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<AccordionItem value="test">Item</AccordionItem>);
    }).toThrow("Accordion components must be used within an <Accordion />");

    consoleSpy.mockRestore();
  });

  it("throws error when AccordionTrigger is used outside AccordionItem", () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <Accordion>
          <AccordionTrigger>Trigger</AccordionTrigger>
        </Accordion>
      );
    }).toThrow("AccordionItem components must be used within an <AccordionItem />");

    consoleSpy.mockRestore();
  });
});


