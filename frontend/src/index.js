import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ===== TradingView ResizeObserver DEV FIX (DO NOT REMOVE) =====
if (process.env.NODE_ENV === "development") {
  const handler = (e) => {
    if (
      e.message &&
      e.message.includes(
        "ResizeObserver loop completed with undelivered notifications"
      )
    ) {
      e.stopImmediatePropagation();
    }
  };

  window.addEventListener("error", handler);
  window.addEventListener("unhandledrejection", handler);
}
// =============================================================

// 🔇 Development-only: Suppress ResizeObserver loop errors (TradingView widgets)
if (process.env.NODE_ENV === 'development') {
  // Intercept and suppress the specific ResizeObserver error before React handles it
  const originalError = console.error;
  console.error = (...args) => {
    // Match the exact error message string
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      // Silently suppress this specific error
      return;
    }
    // Pass through all other errors unchanged
    originalError(...args);
  };

  // Intercept window errors to prevent React Dev Overlay from showing them
  window.addEventListener('error', (event) => {
    if (
      event.message &&
      event.message.includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);