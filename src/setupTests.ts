import '@testing-library/jest-dom';

// Suppress React Router warnings in tests
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});