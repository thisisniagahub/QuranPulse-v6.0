/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="@testing-library/react" />

import { ReactNode } from 'react';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }

  var beforeAll: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
  var beforeEach: jest.Lifecycle;
  var afterEach: jest.Lifecycle;
  var describe: jest.Describe;
  var it: jest.It;
  var test: jest.It;
  var expect: jest.Expect;
  var jest: jest.Jest;
}