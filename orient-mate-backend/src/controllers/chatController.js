import ollama from '../config/ollama.js';
import Document from '../models/Document.js';

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    console.log('💬 Message reçu:', content);

    // Récupérer l'historique des analyses de l'utilisateur
    const userDocuments = await Document.findByUserId(userId);
    const latestAnalysis = userDocuments[0]; // La plus récente

    // Construire le contexte personnalisé
    let userContext = "Utilisateur sans analyse de profil.";
    
    if (latestAnalysis && latestAnalysis.analysis) {
      const analysis = latestAnalysis.analysis;
      userContext = `
PROFIL UTILISATEUR ANALYSÉ :
- Compétences principales: ${analysis.skills?.map(s => s.name).join(', ')}
- Domaine: ${analysis.detected_field}
- Niveau: ${analysis.experience_level}
- Rôles suggérés: ${analysis.suggested_roles?.join(', ')}
- Synthèse: ${analysis.summary}
      `.trim();
    }

    const personalizedPrompt = `
TU ES ORIENTIA, UN CONSEILLER D'ORIENTATION PROFESSIONNELLE EXPERT.

CONTEXTE UTILISATEUR :
${userContext}

TA MISSION :
1. Donner des conseils PERSONNALISÉS basés sur le profil ci-dessus
2. Être précis et technique, pas générique
3. Proposer des formations, métiers et parcours adaptés
4. Aider à la reconversion professionnelle si pertinent
5. Répondre aux questions spécifiques sur l'orientation

DIRECTIVES :
- NE sois PAS générique, utilise le CONTEXTE utilisateur
- Si le profil montre des compétences techniques, propose des métiers techniques
- Si le profil est commercial, propose des métiers commerciaux
- Sois réaliste sur les perspectives de carrière
- Donne des conseils actionnables

QUESTION DE L'UTILISATEUR: "${content}"

RÉPONSE PERSONNALISÉE (sois précis et utilise le contexte) :
`;

    console.log('🤖 Envoi prompt personnalisé à IA...');
    
    const response = await ollama.chat({
      model: 'llama3.2:3b',
      messages: [{ role: 'user', content: personalizedPrompt }],
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    });

    const assistantMessage = {
      content: response.message.content,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Réponse IA personnalisée générée');

    res.json({
      success: true,
      assistantMessage,
      userContext: userContext.includes('Compétences principales') ? 'Profil utilisé' : 'Pas de profil'
    });

  } catch (error) {
    console.error('❌ Erreur chat controller:', error);
    
    // Fallback intelligent basé sur le type d'erreur
    const fallbackMessages = {
      technical: "Je rencontre des difficultés techniques. En attendant, voici quelques conseils généraux d'orientation...",
      no_profile: "Pour des conseils personnalisés, commencez par analyser votre CV dans la section Analyse.",
      default: "Pouvez-vous reformuler votre question ? Je souhaite vous donner la meilleure réponse possible."
    };

    res.json({
      success: false,
      assistantMessage: {
        content: fallbackMessages.default,
        timestamp: new Date().toISOString()
      }
    });
  }
};