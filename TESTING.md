# Testing Guide

## Overview
This project uses Jest and React Testing Library for unit testing React components.

## Test Structure
Tests are organized alongside their respective components with the `.test.tsx` extension.

## Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test Dashboard.test.tsx

# Run tests in watch mode
npm test:watch
```

## Example Test Structure
The Dashboard test demonstrates key testing patterns:

### 1. **Loading States**
```typescript
it('shows loading spinner when loading', () => {
  mockUseAuth.mockReturnValue({ user: null, loading: true });
  renderDashboard();
  expect(screen.getByLabelText('Loading dashboard')).toBeInTheDocument();
});
```

### 2. **Authentication Flow**
```typescript
it('redirects to login when user is not authenticated', () => {
  mockUseAuth.mockReturnValue({ user: null, loading: false });
  renderDashboard();
  expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
});
```

### 3. **Content Rendering**
```typescript
it('renders dashboard content for authenticated user', () => {
  const user = { displayName: 'John Doe' };
  mockUseAuth.mockReturnValue({ user, loading: false });
  renderDashboard();
  expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
});
```

## Key Testing Principles
1. **Mock external dependencies** - Auth context, navigation, child components
2. **Test user behavior** - What users see and interact with, not implementation
3. **Keep tests focused** - Each test should verify one specific behavior
4. **Use descriptive names** - Test names should clearly state what's being tested

## Best Practices
- Mock only what's necessary for the test
- Use `data-testid` for elements that are hard to query by text/role
- Test the component's public API (props, user interactions, rendered output)
- Avoid testing implementation details