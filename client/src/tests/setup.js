// Adds custom matchers like toBeInTheDocument
import '@testing-library/jest-dom';
//import '@testing-library/jest-dom/extend-expect';

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}


// Cleans up the DOM after each test to prevent test pollution
import { cleanup } from '@testing-library/react';
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver (commonly used for lazy loading)
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia (used in TailwindCSS dark mode and responsive breakpoints)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // For older browsers
    removeListener: jest.fn(),
    addEventListener: jest.fn(), // For modern browsers
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
