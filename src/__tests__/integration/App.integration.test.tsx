import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock ESM modules
jest.mock('react-markdown', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('remark-gfm', () => () => {});
jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  render: jest.fn(),
}));

// Mock the supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
  },
}));

// Mock the DataContext
jest.mock('../../services/DataContext', () => ({
  DataProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useData: () => ({
    products: [],
    announcements: [],
    users: [],
    orders: [],
    logs: [],
    syncUser: jest.fn(),
    placeOrder: jest.fn(),
    getProducts: jest.fn(),
    getAnnouncements: jest.fn(),
    getUsers: jest.fn(),
    getOrders: jest.fn(),
    getLogs: jest.fn(),
    updateAppConfig: jest.fn(),
    getAppConfig: jest.fn(),
  }),
}));

// Mock HTMLMediaElement
Object.defineProperty(global.window.HTMLMediaElement.prototype, 'play', {
  configurable: true,
  get() {
    return () => Promise.resolve();
  },
});
Object.defineProperty(global.window.HTMLMediaElement.prototype, 'pause', {
  configurable: true,
  get() {
    return () => {};
  },
});
Object.defineProperty(global.window.HTMLMediaElement.prototype, 'load', {
  configurable: true,
  get() {
    return () => {};
  },
});

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response)
);

describe('App Integration Tests', () => {
  it('should render landing page initially', async () => {
    render(
      <App />
    );

    await waitFor(() => {
      expect(screen.getAllByText(/QuranPulse/i)[0]).toBeInTheDocument();
    });
  });

  it('should navigate to auth after getting started', async () => {
    render(
      <App />
    );

    // Find and click the get started button
    const getStartedButton = screen.getByText(/Get Started Free/i);
    fireEvent.click(getStartedButton);

    await waitFor(() => {
      // Should show auth form - using placeholder since labels aren't associated
      expect(screen.getByPlaceholderText(/nama@email.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    });
  });

  it('should handle authentication flow', async () => {
    render(
      <App />
    );

    // Navigate to auth
    const getStartedButton = screen.getByText(/Get Started Free/i);
    fireEvent.click(getStartedButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nama@email.com/i)).toBeInTheDocument();
    });

    // Fill form
    const emailInput = screen.getByPlaceholderText(/nama@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Log Masuk/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Should navigate to dashboard after successful auth
      expect(screen.getByText(/assalamualaikum/i)).toBeInTheDocument();
    });
  });
});