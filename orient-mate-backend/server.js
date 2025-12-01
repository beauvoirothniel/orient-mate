// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import chatRoutes from './src/routes/chat.js';
import uploadRoutes from './src/routes/upload.js';

// Import database
import { pool } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
 origin: ['http://localhost:5173', 'http://localhost:8080', 'http://192.168.100.208:8080'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OrientMate Backend is running! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      status: 'OK',
      database: 'PostgreSQL',
      current_time: result.rows[0].current_time,
      message: 'Database connection successful!'
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: error.message
    });
  }
});

app.post('/api/test-ai', (req, res) => {
  const { message } = req.body;
  
  const responses = [
    "Bonjour ! Je suis OrientIA, votre assistant d'orientation.",
    "Je peux vous aider à trouver des formations adaptées à votre profil.",
    "Pour une analyse personnalisée, uploader votre CV dans la section Analyse."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.json({
    response: randomResponse,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗃 Database test: http://localhost:${PORT}/api/test-db`);
});

app.use('/uploads', express.static('uploads'));