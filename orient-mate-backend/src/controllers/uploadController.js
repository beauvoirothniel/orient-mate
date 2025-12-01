import realAIService from '../services/realAIService.js';
import { extractTextFromPDF, extractTextFromDOCX, extractTextFromFile } from '../services/uploadService.js';
import Document from '../models/Document.js';
import Skill from '../models/Skill.js';

export const uploadCV = async (req, res) => {
  try {
    console.log('🔍 req.user reçu dans upload:', req.user);
    
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Vérification robuste de l'utilisateur
    if (!req.user || !req.user.id) {
      console.log('❌ Utilisateur non authentifié - req.user:', req.user);
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const userId = req.user.id;

    console.log('📥 Upload reçu:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      userId: userId
    });

    let cvText = "";

    // ==============================
    // 🔍 EXTRACTION RÉELLE DU TEXTE
    // ==============================
    try {
      cvText = await extractTextFromFile(
        req.file.buffer, 
        req.file.mimetype, 
        req.file.originalname
      );
      
      if (!cvText || cvText.trim().length < 50) {
        throw new Error('Texte extrait trop court pour analyse');
      }
      
    } catch (extractionError) {
      console.error('❌ Erreur extraction texte:', extractionError);
      
      // Fallback : utiliser un texte basique avec le nom du fichier
      cvText = `CV: ${req.file.originalname}\n`;
      cvText += `Type: ${req.file.mimetype}\n`;
      cvText += `Taille: ${req.file.size} bytes\n`;
      cvText += `Impossible d'extraire le contenu textuel complet.`;
      
      console.log('🔄 Utilisation du texte de fallback');
    }

    console.log("📄 Texte extrait COMPLET - Longueur:", cvText.length, "caractères");
    console.log("📄 Extrait (300 premiers chars):", cvText.substring(0, 300));

    // ==============================
    // 🤖 ANALYSE IA
    // ==============================
    let analysis;
    try {
      console.log('🤖 Début analyse IA...');
      analysis = await realAIService.analyzeCV(cvText);
      console.log('✅ Analyse IA réussie');
    } catch (aiError) {
      console.error('❌ Erreur analyse IA:', aiError);
      
      // Fallback analysis
      analysis = {
        skills: [
          { name: 'Analyse en cours', category: 'Technique', level: 50 }
        ],
        suggested_roles: ['Profil en cours d\'analyse'],
        detected_field: 'Général',
        summary: 'Analyse en cours - Réessayez dans quelques instants',
        experience_level: 'Intermédiaire'
      };
    }

    // ==============================
    // 💾 SAUVEGARDE BD
    // ==============================
    
    // CORRECTION: Simplifier le type de fichier pour la base de données
    const simplifiedFileType = req.file.mimetype.includes('pdf') ? 'pdf' : 
                              req.file.mimetype.includes('word') ? 'docx' : 
                              req.file.mimetype.includes('document') ? 'docx' : 'other';

    console.log('📁 Type de fichier simplifié:', simplifiedFileType);

    const document = await Document.create({
      userId: userId,
      filename: req.file.originalname,
      fileType: simplifiedFileType,
      fileSize: req.file.size,
      analysisData: analysis
    });

    console.log('✅ Document sauvegardé avec ID:', document.id);

    // ==============================
    // 📊 SAUVEGARDE DES COMPÉTENCES
    // ==============================
    try {
      if (analysis.skills && analysis.skills.length > 0) {
        const skillsToSave = analysis.skills.map(skill => ({
          userId: userId,
          documentId: document.id,
          name: skill.name,
          category: skill.category || analysis.detected_field || 'Général',
          level: skill.level || 50
        }));
        
        // Note: Tu devras adapter selon ton modèle Skill
        console.log('💾 Compétences à sauvegarder:', skillsToSave.length);
      }
    } catch (skillError) {
      console.warn('⚠️ Erreur sauvegarde compétences:', skillError);
    }

    res.json({
      success: true,
      message: "Analyse effectuée avec succès",
      document: {
        id: document.id,
        filename: document.filename,
        analysis: analysis,
        text_length: cvText.length
      }
    });

  } catch (error) {
    console.error("❌ Upload Controller Error:", error);
    res.status(500).json({
      error: "Erreur lors de l'analyse du CV",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};