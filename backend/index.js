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
app.use(cors({
  origin: ['http://localhost:5173', 'https://to-do-1-ob6b.onrender.com', 'https://*.telegram.org'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

try {
  bot.launch({
    allowedUpdates: ['message', 'callback_query', 'web_app_data'],
    dropPendingUpdates: true
  }).then(() => {
    console.log('Telegram bot started successfully');
  }).catch(err => {
    console.error('Error starting Telegram bot:', err);
  });
} catch (err) {
  console.error('Error in bot launch:', err);
}

process.once('SIGINT', () => {
  console.log('Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('Stopping bot...');
  bot.stop('SIGTERM');
});