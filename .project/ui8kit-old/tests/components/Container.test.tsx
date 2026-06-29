import { render, screen } from '@tests/utils/test-utils';
import { Container } from '@/components/ui/Container';

describe('Container', () => {
  it('renders children and sets data marker', () => {
    render(<Container>Content</Container>);
    const el = screen.getByText('Content');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-class', 'container');
  });

  it('has default mx-auto centering', () => {
    render(
      <Container data-testid="c">
        X
      </Container>
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('mx-auto');
  });

  it('allows overriding default centering', () => {
    render(
      <Container mx="4" data-testid="c">
        X
      </Container>
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('mx-4');
    expect(el).not.toHaveClass('mx-auto');
  });

  it('merges custom className', () => {
    render(
      <Container className="custom" data-testid="c">
        Y
      </Container>
    );
    expect(screen.getByTestId('c')).toHaveClass('custom');
  });

  it('supports fast utility props without leaking them to DOM attributes', () => {
    render(
      <Container p="4" bg="primary" data-testid="c">
        U
      </Container>,
    );
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('p-4');
    expect(el).toHaveClass('bg-primary');
    expect(el.getAttribute('p')).toBeNull();
    expect(el.getAttribute('bg')).toBeNull();
  });
});


