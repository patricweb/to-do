export const initTelegramApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.setHeaderColor('#2AABEE');
    window.Telegram.WebApp.expand();
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    console.log('initTelegramApp: User data:', user);
    return user;
  }
  console.warn('initTelegramApp: Telegram Web App not available');
  return null;
};

export const closeTelegramApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.close();
  }
};

export const showAlert = (message) => {
  try {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  } catch (error) {
    console.error('Error showing alert:', error);
    alert(message);
  }
};

export const showConfirm = (message) => {
  try {
    if (window.Telegram?.WebApp) {
      return window.Telegram.WebApp.showConfirm(message);
    }
  } catch (error) {
    console.error('Error showing confirm:', error);
  }
  return Promise.resolve(window.confirm(message));
};

export const getTelegramTheme = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.themeParams;
  }
  return null;
};

export const isTelegramWebApp = () => {
  return window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.platform !== undefined;
};