import crypto from 'crypto';

const validateTelegramWebAppData = (telegramInitData, botToken) => {
  // Data check string
  const data_check_string = Object.keys(telegramInitData)
    .filter(key => key !== 'hash')
    .map(key => `${key}=${telegramInitData[key]}`)
    .sort()
    .join('\n');

  // Create HMAC-SHA-256
  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const hash = crypto
    .createHmac('sha256', secret)
    .update(data_check_string)
    .digest('hex');

  return hash === telegramInitData.hash;
};

export const telegramAuthMiddleware = (req, res, next) => {
  try {
    const initData = req.headers['x-telegram-init-data'];
    
    // Development mode: use test user if no Telegram data
    if (!initData) {
      if (process.env.NODE_ENV === 'development') {
        req.telegramUser = {
          id: 'test-user-id',
          username: 'test-user',
          first_name: 'Test',
          last_name: 'User'
        };
        return next();
      }
      return res.status(401).json({ error: 'Telegram initialization data is missing' });
    }

    const parsedInitData = Object.fromEntries(new URLSearchParams(initData));
    
    if (!process.env.BOT_TOKEN) {
      return res.status(500).json({ error: 'Bot token is not configured' });
    }

    const isValid = validateTelegramWebAppData(parsedInitData, process.env.BOT_TOKEN);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid Telegram data' });
    }

    // Add user data to request
    req.telegramUser = JSON.parse(parsedInitData.user);
    next();
  } catch (error) {
    console.error('Telegram auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}; 