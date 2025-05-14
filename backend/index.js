import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import Telegraf from 'telegraf'; // Убедись, что Telegraf импортирован правильно
import axios from 'axios'; // Для установки webhook

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

// Webhook route для отладки (опционально)
app.get('/webhook', (req, res) => {
  res.status(200).json({ message: 'Webhook endpoint is active (GET is not used by Telegram)' });
});

app.post('/webhook', async (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('OK');
});

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: `Internal server error: ${err.message}` });
});

// Start server
const PORT = process.env.PORT || 3000;
const bot = new Telegraf(process.env.BOT_TOKEN);

const setWebhook = async () => {
  try {
    const webhookUrl = `https://to-do-1-ob6b.onrender.com/webhook`;
    const response = await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${webhookUrl}`
    );
    console.log('Set Webhook Response:', response.data);
  } catch (error) {
    console.error('Error setting webhook:', error.response?.data || error.message);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await setWebhook(); // Установка webhook при старте
  bot.launch({
    webhook: {
      domain: 'https://to-do-1-ob6b.onrender.com',
      path: '/webhook',
      port: PORT,
    },
    allowedUpdates: ['message', 'callback_query', 'web_app_data'],
  })
    .then(() => {
      console.log('Telegram bot started successfully with webhook');
    })
    .catch(err => {
      console.error('Error starting Telegram bot:', err);
      process.exit(1);
    });
});

process.once('SIGINT', () => {
  console.log('Stopping bot...');
  bot.stop('SIGINT');
  mongoose.connection.close(() => {
    console.log('MongoDB disconnected');
    process.exit(0);
  });
});

process.once('SIGTERM', () => {
  console.log('Stopping bot...');
  bot.stop('SIGTERM');
  mongoose.connection.close(() => {
    console.log('MongoDB disconnected');
    process.exit(0);
  });
});