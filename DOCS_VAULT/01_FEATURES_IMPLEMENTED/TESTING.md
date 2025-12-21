# Testing Guide for QuranPulse v6.0

## Overview

This document provides comprehensive testing guidelines and procedures for the QuranPulse v6.0 application.

## Testing Stack

- **Test Runner**: Jest
- **Testing Library**: React Testing Library
- **Environment**: jsdom
- **Type Checking**: TypeScript
- **Coverage**: Codecov integration

## Test Structure

```
src/
├── __tests__/
│   ├── components/          # Component unit tests
│   ├── hooks/              # Custom hook tests
│   ├── utils/              # Utility function tests
│   ├── services/           # Service layer tests
│   └── integration/        # Integration tests
```

## Running Tests

### Local Development
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### CI/CD Pipeline
Tests are automatically run on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

## Test Categories

### 1. Unit Tests
Test individual functions, components, and modules in isolation.

**Example: Validation Utils**
```typescript
describe('validateEmail', () => {
  it('should validate correct email', () => {
    const result = validateEmail('test@example.com');
    expect(result.isValid).toBe(true);
  });
  
  it('should reject invalid email', () => {
    const result = validateEmail('invalid-email');
    expect(result.isValid).toBe(false);
  });
});
```

### 2. Component Tests
Test React components with user interactions and state changes.

**Example: Error Boundary**
```typescript
describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>No error</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
  
  it('should catch and display error when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

### 3. Integration Tests
Test multiple components working together.

**Example: App Integration**
```typescript
describe('App Integration', () => {
  it('should handle authentication flow', async () => {
    render(<App />);
    
    // Navigate through auth flow
    fireEvent.click(screen.getByText(/get started/i));
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify navigation to dashboard
    await waitFor(() => {
      expect(screen.getByText(/assalamualaikum/i)).toBeInTheDocument();
    });
  });
});
```

### 4. Service Tests
Test API calls and data handling.

**Example: API Client**
```typescript
describe('ApiClient', () => {
  it('should retry failed requests', async () => {
    const mockFetch = jest.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ data: 'success' });
    
    global.fetch = mockFetch;
    
    const result = await apiClient.getProducts();
    expect(result).toEqual({ data: 'success' });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
```

## Testing Guidelines

### 1. Test Naming
- Use descriptive test names that explain the behavior
- Follow the pattern: "should [expected behavior] when [condition]"

### 2. Test Structure
- **Arrange**: Set up test data and conditions
- **Act**: Perform the action being tested
- **Assert**: Verify the expected outcome

### 3. Mocking
- Mock external dependencies (APIs, browser APIs)
- Use Jest mocks for consistent behavior
- Clean up mocks after each test

### 4. Assertions
- Use specific matchers (`toBeInTheDocument()`, `toHaveClass()`)
- Test both positive and negative cases
- Verify error states and edge cases

### 5. Coverage Requirements
- Minimum 70% coverage for all metrics
- Focus on critical paths and user workflows
- Test error handling and edge cases

## Test Data Management

### Fixtures
Use test fixtures for consistent data:
```typescript
// fixtures/userData.ts
export const mockUser = {
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  xp_total: 1000,
  barakah_points: 50,
  // ... other properties
};
```

### Test Helpers
Create reusable test utilities:
```typescript
// helpers/renderWithProviders.tsx
export const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <DataProvider>
        {component}
      </DataProvider>
    </BrowserRouter>
  );
};
```

## Performance Testing

### Component Rendering
- Test with large datasets
- Verify lazy loading behavior
- Check memory usage in components

### API Performance
- Measure response times
- Test retry mechanisms
- Verify error handling under load

## Security Testing

### Input Validation
- Test all validation functions
- Verify XSS protection
- Check SQL injection prevention

### Authentication
- Test login/logout flows
- Verify token handling
- Check session management

## Accessibility Testing

### Screen Readers
- Test with `@testing-library/jest-dom`
- Verify ARIA labels
- Check keyboard navigation

### Visual Accessibility
- Test color contrast
- Verify responsive design
- Check text scaling

## Debugging Tests

### Common Issues
1. **Async Test Timeouts**: Use `waitFor` for async operations
2. **Mock Implementation**: Verify mocks return expected values
3. **Test Isolation**: Ensure tests don't affect each other
4. **Environment Setup**: Check test environment configuration

### Debugging Tools
```bash
# Run specific test file
npm test -- validation.test.ts

# Run tests with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Generate coverage report
npm run test:coverage
```

## Continuous Integration

### GitHub Actions
- **Multi-node testing**: Test on Node.js 18.x and 20.x
- **Parallel execution**: Run tests in parallel for faster feedback
- **Coverage reporting**: Automatic upload to Codecov
- **Security scanning**: Automated dependency audits

### Quality Gates
- All tests must pass
- Coverage threshold must be met
- No high-severity security vulnerabilities
- Build must succeed

## Best Practices

### 1. Test-Driven Development
- Write tests before implementation
- Use tests as specification
- Refactor based on test feedback

### 2. Test Maintenance
- Update tests when requirements change
- Remove obsolete tests
- Keep test documentation current

### 3. Code Quality
- Maintain high test coverage
- Keep tests simple and focused
- Use descriptive test names

## Running Tests Locally

### Prerequisites
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Execution
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="ErrorBoundary"
```

## Test Reports

### Coverage Reports
- HTML report: `coverage/lcov-report/index.html`
- Text summary: Terminal output
- Codecov integration: Automatic PR comments

### Test Results
- JUnit XML format for CI integration
- Detailed test logs in console output
- Performance metrics for slow tests

## Troubleshooting

### Common Test Issues
1. **Module Resolution**: Check import paths in test files
2. **Mock Setup**: Verify mock implementations
3. **Async Timing**: Adjust timeouts for slow operations
4. **Environment**: Ensure test environment is properly configured

### Getting Help
- Check Jest documentation: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro
- TypeScript issues: Check tsconfig.json paths and types

## Future Enhancements

### Planned Improvements
1. **E2E Testing**: Add Cypress or Playwright for end-to-end tests
2. **Visual Regression**: Implement visual testing with Percy or Chromatic
3. **Performance Monitoring**: Add performance benchmarks to CI
4. **Component Testing**: Add Storybook for component documentation and testing

This testing guide ensures comprehensive coverage of the QuranPulse application with maintainable and reliable tests.