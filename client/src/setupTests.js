// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress ResizeObserver errors in tests and development
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop completed with undelivered notifications)]/;
const _consoleError = console.error;
console.error = (...args) => {
  const firstArg = args[0];
  const isResizeObserverError = typeof firstArg === 'string' && 
    firstArg.includes('ResizeObserver loop completed with undelivered notifications');
  
  if (!isResizeObserverError) {
    _consoleError(...args);
  }
};

// Global error handler for ResizeObserver
window.addEventListener('error', function (e) {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
    return false;
  }
});
