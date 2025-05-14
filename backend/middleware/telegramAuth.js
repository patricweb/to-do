import crypto from 'crypto';

const validateTelegramWebAppData = (telegramInitData, botToken) => {
  console.log('validateTelegramWebAppData: telegramInitData:', telegramInitData);
  if (!telegramInitData || Object.keys(telegramInitData).length === 0) {
    console.log('validateTelegramWebAppData: Empty initData');
    return false;
  }
  const data_check_string = Object.keys(telegramInitData)
    .filter(key => key !== 'hash')
    .map(key => `${key}=${telegramInitData[key]}`)
    .sort()
    .join('\n');
  console.log('validateTelegramWebAppData: data_check_string:', data_check_string);

  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  const hash = crypto
    .createHmac('sha256', secret)
    .update(data_check_string)
    .digest('hex');
  console.log('validateTelegramWebAppData: generated hash:', hash, 'expected:', telegramInitData.hash);

  return hash === telegramInitData.hash;
};

export const telegramAuthMiddleware = (req, res, next) => {
  try {
    const initData = req.headers['x-telegram-init-data'];
    console.log('telegramAuthMiddleware: Request URL:', req.url);
    console.log('telegramAuthMiddleware: initData:', initData);

    if (!initData) {
      console.log('telegramAuthMiddleware: No initData provided');
      if (process.env.NODE_ENV === 'development') {
        console.log('telegramAuthMiddleware: Using test user for development');
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
    console.log('telegramAuthMiddleware: parsedInitData:', parsedInitData);

    if (!process.env.BOT_TOKEN) {
      console.error('telegramAuthMiddleware: BOT_TOKEN is not configured');
      return res.status(500).json({ error: 'Bot token is not configured' });
    }

    const isValid = validateTelegramWebAppData(parsedInitData, process.env.BOT_TOKEN);
    console.log('telegramAuthMiddleware: isValid:', isValid);

    if (!isValid) {
      console.error('telegramAuthMiddleware: Invalid Telegram data');
      return res.status(401).json({ error: 'Invalid Telegram data' });
    }

    req.telegramUser = JSON.parse(parsedInitData.user);
    console.log('telegramAuthMiddleware: telegramUser:', req.telegramUser);
    next();
  } catch (error) {
    console.error('telegramAuthMiddleware: Authentication error:', error);
    res.status(401).json({ error: `Authentication failed: ${error.message}` });
  }
};