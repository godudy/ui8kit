import { render, screen } from '@tests/utils/test-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/Card';

describe('Card', () => {
  it('renders a basic card', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-class', 'card');
  });

  it('renders card with subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="custom-card">Content</Card>);
    const card = screen.getByText('Content');
    expect(card).toHaveClass('custom-card');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Ref test</Card>);
    expect(ref).toHaveBeenCalled();
  });

  it('passes through other props', () => {
    render(<Card data-testid="test-card">Test</Card>);
    expect(screen.getByTestId('test-card')).toBeInTheDocument();
  });

  it('applies expected default styling tokens', () => {
    render(<Card>Defaults</Card>);
    const card = screen.getByText('Defaults');
    // CDL utility-props defaults in Card:
    // p-4, rounded-lg, shadow-sm, bg-card, border (bare token).
    expect(card).toHaveClass('p-4', 'rounded-lg', 'shadow-sm', 'bg-card', 'border');
  });

  it('supports fast utility props without leaking them to DOM attributes', () => {
    render(
      <Card grid="cols-12" gap="2" data-testid="c">
        U
      </Card>,
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('grid-cols-12');
    expect(el).toHaveClass('gap-2');
    expect(el.getAttribute('grid')).toBeNull();
    expect(el.getAttribute('gap')).toBeNull();
  });
});

describe('CardHeader', () => {
  it('renders with default styling', () => {
    render(<CardHeader>Header content</CardHeader>);
    const header = screen.getByText('Header content');
    expect(header).toHaveAttribute('data-class', 'card-header');
    expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-4');
  });
});

describe('CardTitle', () => {
  it('renders with title styling', () => {
    render(<CardTitle>Title text</CardTitle>);
    const title = screen.getByText('Title text');
    expect(title).toHaveAttribute('data-class', 'card-title');
    expect(title).toHaveClass('font-semibold', 'tracking-tight');
  });

  it('renders the correct heading tag for order={1..6}', () => {
    const cases = [
      { order: 1, tag: 'H1' },
      { order: 2, tag: 'H2' },
      { order: 3, tag: 'H3' },
      { order: 4, tag: 'H4' },
      { order: 5, tag: 'H5' },
      { order: 6, tag: 'H6' },
    ] as const;

    for (const c of cases) {
      const text = `Title order ${c.order}`;
      const { unmount } = render(<CardTitle order={c.order}>{text}</CardTitle>);
      expect(screen.getByText(text).tagName).toBe(c.tag);
      unmount();
    }
  });

  it('falls back to h3 for unknown order values', () => {
    render(<CardTitle order={999 as any}>Unknown</CardTitle>);
    expect(screen.getByText('Unknown').tagName).toBe('H3');
  });
});

describe('CardDescription', () => {
  it('renders with description styling', () => {
    render(<CardDescription>Description text</CardDescription>);
    const description = screen.getByText('Description text');
    expect(description).toHaveAttribute('data-class', 'card-description');
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });
});

describe('CardContent', () => {
  it('renders with content styling', () => {
    render(<CardContent>Content text</CardContent>);
    const content = screen.getByText('Content text');
    expect(content).toHaveAttribute('data-class', 'card-content');
    // Note: CardContent base has pt-0, but the default utility p-4 overrides it via tailwind-merge.
    expect(content).toHaveClass('p-4');
  });
});

describe('CardFooter', () => {
  it('renders with footer styling', () => {
    render(<CardFooter>Footer content</CardFooter>);
    const footer = screen.getByText('Footer content');
    expect(footer).toHaveAttribute('data-class', 'card-footer');
    // Note: CardFooter currently applies p-4 which (via twMerge) overrides pt-0.
    expect(footer).toHaveClass('flex', 'items-center', 'p-4');
  });
});
