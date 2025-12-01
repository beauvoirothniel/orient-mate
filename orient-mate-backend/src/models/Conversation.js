//src/models/Conversation.js
import { pool } from '../config/database.js';
import { randomUUID } from 'crypto';

class Conversation {
  // Créer une nouvelle conversation
  static async create(userId, title = 'Nouvelle conversation') {
    const id = randomUUID();
    const query = `
      INSERT INTO conversations (id, user_id, title)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [id, userId, title];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Récupérer toutes les conversations d'un utilisateur
  static async findByUserId(userId) {
    const query = `
      SELECT c.*, 
             (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
             (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM conversations c
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Récupérer une conversation avec ses messages
  static async findByIdWithMessages(id, userId) {
    // Vérifier que la conversation appartient à l'utilisateur
    const convQuery = 'SELECT * FROM conversations WHERE id = $1 AND user_id = $2';
    const convResult = await pool.query(convQuery, [id, userId]);
    
    if (convResult.rows.length === 0) {
      return null;
    }

    // Récupérer les messages
    const messagesQuery = `
      SELECT * FROM messages 
      WHERE conversation_id = $1 
      ORDER BY created_at ASC
    `;
    const messagesResult = await pool.query(messagesQuery, [id]);

    return {
      ...convResult.rows[0],
      messages: messagesResult.rows
    };
  }

  // Mettre à jour le titre de la conversation
  static async updateTitle(id, userId, title) {
    const query = `
      UPDATE conversations 
      SET title = $1 
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [title, id, userId]);
    return result.rows[0];
  }

  // Supprimer une conversation
  static async delete(id, userId) {
    const query = 'DELETE FROM conversations WHERE id = $1 AND user_id = $2';
    await pool.query(query, [id, userId]);
  }
}

export default Conversation;