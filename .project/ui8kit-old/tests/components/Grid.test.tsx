import { render, screen } from '@tests/utils/test-utils';
import { Grid } from '@/components/Grid';

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid data-testid="grid">
        <div>Child</div>
      </Grid>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('applies grid classes', () => {
    render(
      <Grid cols={3} gap="md" data-testid="grid">
        X
      </Grid>
    );
    const el = screen.getByTestId('grid');
    expect(el.className).toContain('grid');
    expect(el.className).toContain('grid-cols-3');
    expect(el.className).toContain('gap-4');
  });

  it('supports responsive cols rule list', () => {
    render(
      <Grid
        cols={[
          { bp: 'base', value: 1 },
          { bp: 'sm', value: 2 },
          { bp: 'md', value: 2 },
          { bp: 'lg', value: 3 }
        ]}
        data-testid="grid"
      >
        X
      </Grid>
    );
    const el = screen.getByTestId('grid');
    expect(el.className).toContain('grid-cols-1');
    expect(el.className).toContain('sm:grid-cols-2');
    expect(el.className).toContain('md:grid-cols-2');
    expect(el.className).toContain('lg:grid-cols-3');
  });

  it('renders Grid.Col with span/start/end/order', () => {
    render(
      <Grid data-testid="grid">
        <Grid.Col span={2} start={3} end={5} order={1} data-testid="col">
          Item
        </Grid.Col>
      </Grid>
    );
    const col = screen.getByTestId('col');
    expect(col.className).toContain('col-span-2');
    expect(col.className).toContain('col-start-3');
    expect(col.className).toContain('col-end-5');
    expect(col.className).toContain('order-1');
  });

  it('supports xl and 2xl breakpoint prefixes', () => {
    render(
      <Grid
        cols={[
          { bp: 'xl', value: 4 },
          { bp: '2xl', value: 6 }
        ]}
        data-testid="grid"
      >
        X
      </Grid>
    );
    const el = screen.getByTestId('grid');
    expect(el.className).toContain('xl:grid-cols-4');
    expect(el.className).toContain('2xl:grid-cols-6');
  });

  it('ignores falsy cols values and falsy rules (branch coverage)', () => {
    render(
      <Grid
        // 0 is not a valid value, but we use it to cover the "!cols" early return.
        cols={0 as any}
        data-testid="grid"
      >
        X
      </Grid>
    );
    const el = screen.getByTestId('grid');
    expect(el.className).toContain('grid');

    render(
      <Grid
        cols={
          [
            { bp: 'base', value: 1 },
            undefined,
          ] as any
        }
        data-testid="grid2"
      >
        X
      </Grid>
    );
    const el2 = screen.getByTestId('grid2');
    expect(el2.className).toContain('grid-cols-1');
  });
});


