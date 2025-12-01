import express from 'express';
import { uploadCV } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload de CV avec gestion d'erreurs
router.post('/cv', 
  authenticateToken, // Middleware d'auth directement sur la route
  upload.single('cvFile'), // Doit correspondre au nom dans le frontend
  handleUploadError,
  uploadCV
);

// Route pour récupérer les documents de l'utilisateur
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const Document = await import('../models/Document.js');
    const documents = await Document.default.findByUserId(req.user.id);
    res.json({ success: true, documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des documents' });
  }
});

export default router;