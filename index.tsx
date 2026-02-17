
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("ScanSheet: Starting index.tsx execution");

// Using a slight delay to ensure polyfills and importmaps are fully registered
setTimeout(() => {
  const container = document.getElementById('root');

  if (!container) {
    console.error("Target container #root not found");
    return;
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
    // Error overlay in index.html will catch this
    throw err;
  }
}, 0);
