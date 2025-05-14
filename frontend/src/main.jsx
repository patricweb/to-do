import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const loadTelegramSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log('Telegram Web App SDK already loaded:', window.Telegram.WebApp);
      console.log('SDK version:', window.Telegram.WebApp.version);
      resolve(window.Telegram.WebApp);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onload = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram Web App SDK loaded:', window.Telegram.WebApp);
        console.log('SDK version:', window.Telegram.WebApp.version);
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
    console.log('Telegram Web App: URL:', window.location.href);
    console.log('Telegram Web App: is Telegram?', window.location.href.includes('tgWebAppData'));
    console.log('Telegram Web App: Platform:', WebApp.platform);
    console.log('Telegram Web App: Theme:', JSON.stringify(WebApp.themeParams));
    console.log('Telegram Web App: Viewport:', WebApp.viewportHeight, WebApp.viewportStableHeight);

    // Проверка рендеринга
    const root = document.getElementById('root');
    console.log('Render: Root element exists?', !!root);
    if (!root) {
      console.error('Render: Root element not found');
      document.body.innerHTML = '<div style="color: red; padding: 20px; text-align: center;">Error: Root element not found. Please check index.html.</div>';
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
        Ошибка: Это приложение должно быть открыто в Telegram. Пожалуйста, используйте @test_4_web_app_bot.
        <pre style="text-align: left; margin-top: 10px; font-size: 12px; background: #f0f0f0; padding: 10px;">
          Debug Info:
          Error: ${err.message}
          URL: ${window.location.href}
        </pre>
      </div>
    `;
  });