// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configuração global para testes
configure({ testIdAttribute: 'data-testid' });

// Mock para ResizeObserver que não está disponível no JSDOM
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn().mockImplementation((_element: Element) => {
    // Simula a observação do elemento
    return undefined;
  });

  unobserve = jest.fn().mockImplementation((_element: Element) => {
    // Simula a remoção da observação do elemento
    return undefined;
  });

  disconnect = jest.fn().mockImplementation(() => {
    // Simula a desconexão do observer
    return undefined;
  });
};

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
) as jest.Mock;
