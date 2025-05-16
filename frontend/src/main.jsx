import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const loadTelegramSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log('Telegram Web App SDK already loaded:', window.Telegram.WebApp);
      resolve(window.Telegram.WebApp);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram Web App SDK loaded:', window.Telegram.WebApp);
        resolve(window.Telegram.WebApp);
      } else {
        reject(new Error('Telegram Web App SDK failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Telegram Web App SDK'));
    document.head.appendChild(script);
  });
};

loadTelegramSDK()
  .then(WebApp => {
    console.log('Telegram Web App: SDK loaded');
    WebApp.ready();
    WebApp.expand();
    const initData = WebApp.initData || '';
    console.log('Telegram Web App: initialized, initData:', initData);

    const root = document.getElementById('root');
    if (!root) {
      console.error('Render: Root element not found');
      document.body.innerHTML = '<div style="color: red; padding: 20px; text-align: center;">Error: Root element not found.</div>';
      return;
    }

    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('Render: App rendered');
  })
  .catch(err => {
    console.error('Error loading Telegram Web App SDK:', err);
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; text-align: center;">
        Error: This app must be opened in Telegram.
        <pre style="text-align: left; margin-top: 10px; font-size: 12px; background: #f0f0f0; padding: 10px;">
          Debug Info:
          Error: ${err.message}
          URL: ${window.location.href}
        </pre>
      </div>
    `;
  });