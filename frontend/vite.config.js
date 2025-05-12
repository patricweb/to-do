import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  // Плагины для Vite
  plugins: [
    react(), // Плагин для поддержки React
  ],

  // Настройки dev-сервера (для локальной разработки)
  server: {
    proxy: {
      // Проксирование запросов к /api на бэкенд
      '/api': {
        target: 'https://to-do-1-ob6b.onrender.com', // URL бэкенда
        changeOrigin: true, // Изменение заголовка Host для соответствия целевому серверу
        secure: false, // Отключение проверки SSL (для Render)
      },
    },
  },

  // Настройки сборки для production
  build: {
    outDir: 'dist', // Папка для результатов сборки
    assetsDir: 'assets', // Папка для статических ресурсов
    sourcemap: true, // Генерация sourcemaps для отладки
    minify: 'terser', // Использование terser для минификации
    terserOptions: {
      compress: {
        drop_console: false, // Сохранять console.log для отладки
      },
    },
    rollupOptions: {
      output: {
        // Разделение кода на чанки для оптимизации загрузки
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'], // Чанк для React-библиотек
          'telegram-vendor': ['@twa-dev/sdk', '@vkruglikov/react-telegram-web-app'], // Чанк для Telegram SDK
        },
      },
    },
  },
});
