/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(): R;
      toHaveStyle(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveAttribute(): R;
      toHaveTextContent(): R;
      toHaveValue(): R;
      toBeChecked(): R;
      toBeEmptyDOMElement(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(): R;
      toHaveDisplayValue(): R;
      toHaveErrorMessage(): R;
      toHaveFormValues(): R;
      toHaveFocus(): R;
      toHaveRole(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
    }
  }
}