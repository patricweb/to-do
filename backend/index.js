import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import bot from './config/telegram.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

// Connect to MongoDB
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
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start Telegram bot
if (process.env.BOT_TOKEN) {
  setTimeout(() => {
    try {
      bot.launch({
        allowedUpdates: ['message', 'callback_query', 'web_app_data'],
        dropPendingUpdates: true,
      })
        .then(() => {
          console.log('Telegram bot started successfully');
        })
        .catch(err => {
          console.error('Error starting Telegram bot:', err);
          process.exit(1);
        });
    } catch (err) {
      console.error('Error in bot launch:', err);
      process.exit(1);
    }
  }, 1000); // Задержка 1 сек для стабильности
} else {
  console.error('BOT_TOKEN is not defined');
  process.exit(1);
}

process.once('SIGINT', () => {
  console.log('Stopping bot...');
  bot.stop('SIGINT');
  process.exit();
});

process.once('SIGTERM', () => {
  console.log('Stopping bot...');
  bot.stop('SIGTERM');
  process.exit();
});