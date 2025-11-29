import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../../../App';

// Mock the DataContext
jest.mock('../../../services/DataContext', () => ({
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

describe('App Integration Tests', () => {
  it('should render landing page initially', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/QuranPulse/i)).toBeInTheDocument();
    });
  });

  it('should navigate to auth after getting started', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Find and click the get started button
    const getStartedButton = screen.getByText(/get started/i);
    fireEvent.click(getStartedButton);

    await waitFor(() => {
      // Should show auth form
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  it('should handle authentication flow', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to auth
    const getStartedButton = screen.getByText(/get started/i);
    fireEvent.click(getStartedButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    // Fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Should navigate to dashboard after successful auth
      expect(screen.getByText(/assalamualaikum/i)).toBeInTheDocument();
    });
  });
});