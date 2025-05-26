// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configuração global para testes
configure({ testIdAttribute: 'data-testid' });

// Mock para ResizeObserver que não está disponível no JSDOM
// Implementação vazia intencional para testes, já que o JSDOM não suporta ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {} // Método intencionalmente vazio para testes
  unobserve() {} // Método intencionalmente vazio para testes
  disconnect() {} // Método intencionalmente vazio para testes
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
