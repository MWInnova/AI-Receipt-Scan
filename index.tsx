
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("ScanSheet: Starting index.tsx execution");

const container = document.getElementById('root');

if (!container) {
  throw new Error("Target container #root not found");
}

try {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("ScanSheet: React render() called successfully");
} catch (err) {
  console.error("ScanSheet: Mounting failed", err);
  throw err; // Will be caught by window.onerror in index.html
}
