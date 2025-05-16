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

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: `Internal server error: ${err.message}` });
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

// Start server and bot
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Start bot with long polling
    await bot.launch();
    console.log('Telegram bot started successfully with long polling');
  } catch (err) {
    console.error('Error starting server or bot:', err);
    process.exit(1);
  }
};

startServer();

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