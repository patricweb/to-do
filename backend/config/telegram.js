import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware to log updates
bot.use((ctx, next) => {
  console.log('New message:', ctx.update);
  return next();
});

// Command to start the bot
bot.command('start', (ctx) => {
  ctx.reply('Welcome to Todo App! Click the Menu button to open the app.');
});

// Handle web app button clicks
bot.on('web_app_data', async (ctx) => {
  const data = ctx.webAppData.data;
  try {
    const parsedData = JSON.parse(data);
    // Handle the data from web app
    ctx.reply(`Received data: ${JSON.stringify(parsedData, null, 2)}`);
  } catch (error) {
    console.error('Error processing web app data:', error);
    ctx.reply('Error processing your request');
  }
});

export default bot; 