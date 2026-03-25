import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch global
global.fetch = vi.fn();

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Warning:')) return;
  originalConsoleError(...args);
};