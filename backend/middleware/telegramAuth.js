const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const authenticate = async (initData) => {
  console.log('Auth: Received initData:', initData);

  if (!initData || typeof initData !== 'string' || initData.trim() === '') {
    console.error('Auth: initData is empty or invalid');
    return null;
  }

  try {
    const params = new URLSearchParams(initData);
    const userId = params.get('user') ? JSON.parse(params.get('user')).id : null;
    const authDate = params.get('auth_date');
    const hash = params.get('hash');

    if (!userId || !authDate || !hash) {
      console.error('Auth: Missing required parameters in initData');
      return null;
    }

    let user = await User.findOne({ telegramId: userId });
    if (!user) {
      user = new User({ telegramId: userId, username: params.get('username') || `user_${userId}` });
      await user.save();
      console.log('Auth: New user created:', userId);
    } else {
      console.log('Auth: User found:', userId);
    }

    return user._id;
  } catch (error) {
    console.error('Auth: Error during authentication:', error.message);
    return null;
  }
};

const telegramAuthMiddleware = async (req, res, next) => {
  const initData = req.headers['x-telegram-init-data'];
  console.log('Middleware: Received initData:', initData);

  const userId = await authenticate(initData);
  if (!userId) {
    console.error('Middleware: Authentication failed');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.userId = userId; // Добавляем userId в объект запроса
  console.log('Middleware: Authentication successful, userId:', userId);
  next();
};

module.exports = { authenticate, bot, telegramAuthMiddleware };