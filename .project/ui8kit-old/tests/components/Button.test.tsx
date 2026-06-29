import { render, screen, fireEvent } from '@tests/utils/test-utils';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders a native <button> with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('sets a stable data marker for tooling', () => {
    render(<Button>Label</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-class', 'button');
  });

  it('passes through native props', () => {
    render(
      <Button type="submit" aria-label="Submit" data-testid="submit-button">
        Submit
      </Button>
    );
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled is true', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('applies size variants', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9', 'px-3');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10');
  });

  it('applies style variants', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border', 'border-input');

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole('button')).toHaveClass('underline-offset-4');
  });

  it('supports fast utility props without leaking them to DOM attributes', () => {
    render(
      <Button m="4" mr="2" w="full" data-testid="button">
        Spaced
      </Button>
    );
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('m-4', 'mr-2', 'w-full');
    expect(button.getAttribute('m')).toBeNull();
    expect(button.getAttribute('mr')).toBeNull();
    expect(button.getAttribute('w')).toBeNull();
  });

  it('applies rounded and shadow props', () => {
    render(
      <Button rounded="full" shadow="md">
        Styled
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full', 'shadow-md');
  });
});
