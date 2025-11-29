/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="@testing-library/react" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../../components/ErrorBoundary';

// Mock console.error to track error logs
const mockConsoleError = jest.fn();
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = mockConsoleError;
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Test component that throws an error
const ThrowErrorComponent: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should catch and display error when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('should log error to console when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error caught by boundary:',
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('should render fallback when provided', () => {
    const FallbackComponent = () => <div>Custom fallback</div>;
    
    render(
      <ErrorBoundary fallback={<FallbackComponent />}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });
});