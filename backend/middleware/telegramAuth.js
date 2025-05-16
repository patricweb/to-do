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
    // Простая проверка: Telegram передает initData как строку с параметрами
    const params = new URLSearchParams(initData);
    const userId = params.get('user') ? JSON.parse(params.get('user')).id : null;
    const authDate = params.get('auth_date');
    const hash = params.get('hash');

    if (!userId || !authDate || !hash) {
      console.error('Auth: Missing required parameters in initData');
      return null;
    }

    // Проверка существования пользователя в MongoDB
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

module.exports = { authenticate, bot };