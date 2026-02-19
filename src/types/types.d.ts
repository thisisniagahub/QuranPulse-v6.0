// Jest types
declare var beforeAll: jest.Lifecycle;
declare var afterAll: jest.Lifecycle;
declare var beforeEach: jest.Lifecycle;
declare var afterEach: jest.Lifecycle;
declare var describe: jest.Describe;
declare var it: jest.It;
declare var test: jest.It;
declare var expect: jest.Expect;
declare var jest: jest.Jest;

// Testing Library types
declare module '@testing-library/react' {
  export function render(ui: React.ReactElement): any;
  export const screen: any;
  export const fireEvent: any;
}

declare module '@testing-library/jest-dom' {
  // Add any additional matchers here if needed
}

// Global jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}