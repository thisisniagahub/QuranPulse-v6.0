import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock ESM modules
jest.mock('react-markdown', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('remark-gfm', () => () => { });
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
    return () => { };
  },
});
Object.defineProperty(global.window.HTMLMediaElement.prototype, 'load', {
  configurable: true,
  get() {
    return () => { };
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
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render splash screen on initial load', async () => {
    await act(async () => {
      render(<App />);
    });

    // The app shows a splash screen with "QURAN" and "PULSE" text
    // Looking for the alt text of the logo image
    expect(screen.getByAltText('Quran Pulse Logo')).toBeInTheDocument();
  });

  it('should display QURAN PULSE branding', async () => {
    await act(async () => {
      render(<App />);
    });

    // Check for QURAN text (part of the splash screen h1)
    expect(screen.getByText('QURAN')).toBeInTheDocument();

    // Check for PULSE text (in a highlighted span)
    expect(screen.getByText('PULSE')).toBeInTheDocument();
  });

  it('should display the tagline', async () => {
    await act(async () => {
      render(<App />);
    });

    // Check for the tagline text
    expect(screen.getByText('Sistem Operasi Rohani')).toBeInTheDocument();
  });
});