import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.js'; // projects.js
import taskRoutes from './routes/tasks.js'; // tasks.js
import bot from './config/telegram.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Упрощенный CORS для теста
app.use(express.json());

// Root route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
// app.use('/api/projects', require('./routes/projectRoutes')); // Закомментировано
// app.use('/api', require('./routes/taskRoutes')); // Закомментировано

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
    dropPendingUpdates: true,
  })
    .then(() => {
      console.log('Telegram bot started successfully');
    })
    .catch(err => {
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