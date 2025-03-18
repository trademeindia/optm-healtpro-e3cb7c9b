
/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom/vitest" />

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ConnectView from '../ConnectView';

describe('ConnectView', () => {
  const mockOnConnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly with provider name', () => {
    render(<ConnectView providerName="Google Fit" onConnect={mockOnConnect} />);

    expect(screen.getByText('Connect to Google Fit')).toBeInTheDocument();
    expect(screen.getByText(/Sync your health and fitness data from Google Fit/)).toBeInTheDocument();
    expect(screen.getByText('Connect Google Fit')).toBeInTheDocument();
  });

  test('calls onConnect when connect button is clicked', () => {
    render(<ConnectView providerName="Google Fit" onConnect={mockOnConnect} />);
    
    fireEvent.click(screen.getByText('Connect Google Fit'));
    expect(mockOnConnect).toHaveBeenCalledTimes(1);
  });

  test('renders with a different provider name', () => {
    render(<ConnectView providerName="Apple Health" onConnect={mockOnConnect} />);

    expect(screen.getByText('Connect to Apple Health')).toBeInTheDocument();
    expect(screen.getByText(/Sync your health and fitness data from Apple Health/)).toBeInTheDocument();
    expect(screen.getByText('Connect Apple Health')).toBeInTheDocument();
  });
});
