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
    console.log('Telegram Web App: is Telegram?', window.location.href.includes('tgWebApp'));
    console.log('Telegram Web App: Platform:', WebApp.platform);
    console.log('Telegram Web App: Theme:', JSON.stringify(WebApp.themeParams));
    console.log('Telegram Web App: Viewport:', WebApp.viewportHeight, WebApp.viewportStableHeight);

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch(err => {
    console.error('Error loading Telegram Web App SDK:', err);
    ReactDOM.createRoot(document.getElementById('root')).render(
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        Ошибка: Это приложение должно быть открыто в Telegram. Пожалуйста, используйте @test_4_web_app_bot.
        <pre style={{ textAlign: 'left', marginTop: '10px', fontSize: '12px' }}>
          Debug Info:
          Error: {err.message}
          URL: {window.location.href}
        </pre>
      </div>
    );
  });