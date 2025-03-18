
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

declare namespace global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeInvalid(): R;
      toBeVisible(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
      toHaveValue(value?: string | string[] | number): R;
      toHaveStyle(css: Record<string, any>): R;
      toHaveFocus(): R;
      toBeChecked(): R;
    }
  }
}

export {};
