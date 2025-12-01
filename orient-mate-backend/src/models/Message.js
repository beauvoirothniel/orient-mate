//src/models/Message.js
import { pool } from '../config/database.js';
import { randomUUID } from 'crypto';

class Message {
  // Créer un nouveau message
  static async create(conversationId, role, content) {
    const id = randomUUID();
    const query = `
      INSERT INTO messages (id, conversation_id, role, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [id, conversationId, role, content];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Récupérer les messages d'une conversation
  static async findByConversationId(conversationId) {
    const query = `
      SELECT * FROM messages 
      WHERE conversation_id = $1 
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [conversationId]);
    return result.rows;
  }
}

export default Message;