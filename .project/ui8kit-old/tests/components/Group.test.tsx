import { render, screen } from '@tests/utils/test-utils';
import { Group } from '@/components/ui/Group';

describe('Group', () => {
  it('renders children and sets data marker', () => {
    render(
      <Group>
        <span>Child</span>
      </Group>
    );
    const child = screen.getByText('Child');
    expect(child).toBeInTheDocument();
    expect(child.parentElement).toHaveAttribute('data-class', 'group');
  });

  it('renders with a custom element type via component prop', () => {
    render(
      <Group component="ul">
        <li>Item</li>
      </Group>
    );
    const item = screen.getByText('Item');
    expect(item.parentElement?.tagName).toBe('UL');
  });

  it('applies grow flag', () => {
    render(
      <Group grow data-testid="g">
        A
      </Group>
    );
    const el = screen.getByTestId('g');
    expect(el).toHaveClass('flex-1');
    expect(el).toHaveClass('min-w-0'); // always applied
  });

  it('always applies overflow prevention (min-w-0)', () => {
    render(
      <Group data-testid="g">
        B
      </Group>
    );
    const el = screen.getByTestId('g');
    expect(el).toHaveClass('min-w-0');
  });

  it('supports fast utility props without leaking them to DOM attributes', () => {
    render(
      <Group p="4" bg="primary" data-testid="g">
        U
      </Group>,
    );
    const el = screen.getByTestId('g');
    expect(el).toHaveClass('p-4');
    expect(el).toHaveClass('bg-primary');
    expect(el.getAttribute('p')).toBeNull();
    expect(el.getAttribute('bg')).toBeNull();
  });
});


