// src/services/api.js
const API_BASE_URL = 'http://localhost:5001/api';

// Fonction utilitaire pour les appels API
export const apiClient = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body) {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Méthodes spécifiques
  async post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: data });
  },

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  async put(endpoint, data) {
    return this.request(endpoint, { method: 'PUT', body: data });
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

// Services spécifiques
export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/profile')
};

export const chatService = {
  getConversations: () => apiClient.get('/chat/conversations'),
  getConversation: (id) => apiClient.get(\/chat/conversations/\\),
  sendMessage: (messageData) => apiClient.post('/chat/messages', messageData),
  deleteConversation: (id) => apiClient.delete(\/chat/conversations/\\)
};

export async function postChatMessage(content, token) {
  const res = await fetch("http://const API_BASE_URL = 'http://localhost:5001/api';/api/chat/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}
