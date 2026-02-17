
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("ScanSheet: Initializing entry point...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("ScanSheet: React render initiated.");
  } catch (error) {
    console.error("ScanSheet: Render error:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">Failed to start app: ${error.message}</div>`;
  }
} else {
  console.error("ScanSheet: Could not find #root element in DOM.");
}
