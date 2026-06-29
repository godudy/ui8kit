import { render, screen, fireEvent } from '@tests/utils/test-utils';
import { Image } from '@/components/ui/Image';

describe('Image', () => {
  it('renders an img element with data marker', () => {
    render(<Image src="a.png" alt="A" />);
    const img = screen.getByRole('img', { name: 'A' });
    expect(img).toHaveAttribute('data-class', 'image');
  });

  it('applies placeholder styling when withPlaceholder is true', () => {
    render(<Image src="a.png" alt="A" withPlaceholder data-testid="img" />);
    expect(screen.getByTestId('img')).toHaveClass('bg-muted');
  });

  it('replaces src with fallbackSrc on error and calls onError', () => {
    const onError = vi.fn();
    render(
      <Image
        src="a.png"
        fallbackSrc="fallback.png"
        alt="A"
        onError={onError}
        data-testid="img"
      />
    );
    const img = screen.getByTestId('img') as HTMLImageElement;

    fireEvent.error(img);

    expect(img.src).toContain('fallback.png');
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('keeps src unchanged on error when fallbackSrc is not provided', () => {
    render(<Image src="a.png" alt="A" data-testid="img" />);
    const img = screen.getByTestId('img') as HTMLImageElement;

    const before = img.src;
    fireEvent.error(img);

    expect(img.src).toBe(before);
  });

  it('supports fast utility props without leaking them to DOM attributes', () => {
    render(
      <Image src="a.png" alt="A" p="2" rounded="lg" data-testid="img" />,
    );
    const el = screen.getByTestId('img');
    expect(el).toHaveClass('p-2');
    expect(el).toHaveClass('rounded-lg');
    expect(el.getAttribute('p')).toBeNull();
    expect(el.getAttribute('rounded')).toBeNull();
  });
});


