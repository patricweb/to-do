import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware to log updates
bot.use((ctx, next) => {
  console.log('New update:', JSON.stringify(ctx.update, null, 2));
  return next();
});

// Command to start the bot
bot.command('start', (ctx) => {
  const webAppUrl = process.env.WEB_APP_URL || 'https://to-do-1-ob6b.onrender.com';
  ctx.reply(
    'Welcome to Todo App! Click the button below to open the app.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Open Todo App', webAppUrl)
    ])
  );
});

// Handle web app data
bot.on('web_app_data', async (ctx) => {
  const data = ctx.webAppData?.data;
  try {
    if (!data) {
      throw new Error('No web app data received');
    }
    const parsedData = JSON.parse(data);
    ctx.reply(`Received data from Web App: ${JSON.stringify(parsedData, null, 2)}`);
  } catch (error) {
    console.error('Error processing web app data:', error);
    ctx.reply('Error processing your request');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('An error occurred. Please try again later.');
});

export default bot;