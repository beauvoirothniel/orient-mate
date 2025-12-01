//src/services/ollamaService.js
class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_URL || 'http://localhost:11434/api';
    this.model = process.env.OLLAMA_MODEL || 'mistral';
  }

  async generate(prompt, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            ...options
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama service error:', error);
      // Simulation temporaire si Ollama n'est pas installé
      return this.mockResponse(prompt);
    }
  }

  async chat(messages, options = {}) {
    try {
      const systemPrompt = `Tu es OrientIA, un conseiller d'orientation scolaire et professionnelle.
Tu aides les étudiants et professionnels à:
- Trouver leur voie professionnelle
- Identifier les formations adaptées  
- Analyser leurs compétences
- Préparer leur reconversion

Sois encourageant, précis et propose des solutions concrètes.`;

      const fullMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: fullMessages,
          stream: false,
          options: {
            temperature: 0.7,
            ...options
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Ollama chat error:', error);
      return this.mockChatResponse(messages);
    }
  }

  // Simulation temporaire
  mockResponse(prompt) {
    const responses = {
      'formation': "Je vous recommande d'explorer les formations en développement web et intelligence artificielle. Ces domaines offrent de nombreuses opportunités.",
      'compétence': "Pour analyser vos compétences, vous pouvez uploader votre CV. Je pourrai identifier vos points forts et axes d'amélioration.",
      'orientation': "En tant qu'OrientIA, je peux vous aider à trouver votre voie. Parlez-moi de vos centres d'intérêt et compétences."
    };

    const lowerPrompt = prompt.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerPrompt.includes(key)) {
        return response;
      }
    }

    return "Je suis OrientIA, votre assistant d'orientation. Je peux vous aider avec vos choix de formation, l'analyse de vos compétences, et votre projet professionnel.";
  }

  mockChatResponse(messages) {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    if (lastMessage.includes('formation') || lastMessage.includes('étudier')) {
      return "Je vous recommande d'explorer les formations en développement web et intelligence artificielle. Voulez-vous que je vous présente des options spécifiques ?";
    } else if (lastMessage.includes('compétence') || lastMessage.includes('cv')) {
      return "Pour analyser vos compétences plus en détail, vous pouvez uploader votre CV dans la section Analyse. Je pourrai alors vous donner des recommandations personnalisées.";
    } else {
      return "Bonjour ! Je suis OrientIA, votre assistant d'orientation. Je peux vous aider avec vos choix de formation, l'analyse de vos compétences, et votre projet professionnel. Par où souhaitez-vous commencer ?";
    }
  }

  // Test connection to Ollama
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/tags`);
      return response.ok;
    } catch (error) {
      console.log('Ollama not available, using mock mode');
      return false;
    }
  }
}

export default new OllamaService();