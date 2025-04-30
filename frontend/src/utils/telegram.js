export const initTelegramApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    // Enable viewport settings for mobile devices
    window.Telegram.WebApp.setHeaderColor('#2AABEE');
    window.Telegram.WebApp.expand();
    
    // Get user data from Telegram
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    return user;
  }
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

// Get theme params
export const getTelegramTheme = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.themeParams;
  }
  return null;
};

// Check if app is running in Telegram
export const isTelegramWebApp = () => {
  return window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.platform !== undefined;
}; 