import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render wrapper (currently no providers; keep as a single extension point)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from Testing Library
export * from '@testing-library/react';

// Override render with our wrapper
export { customRender as render };

// Test helpers
export const createTestProps = <T extends Record<string, any>>(
  overrides: Partial<T> = {}
): T => {
  return overrides as T;
};

export const mockProps = <T extends Record<string, any>>(
  template: T,
  overrides: Partial<T> = {}
): T => {
  return { ...template, ...overrides };
};

// Event helpers
export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  ...overrides,
});

// Form helpers
export const createMockChangeEvent = (value: string, name?: string) => ({
  target: { value, name: name || 'test' },
});

// Types
export type TestComponentProps<T> = T & {
  'data-testid'?: string;
};
