//src/models/Skill.js
import { pool } from '../config/database.js';
import { randomUUID } from 'crypto';

class Skill {
  // Créer une nouvelle compétence
  static async create(skillData) {
    const { userId, name, category, level, source, confidence } = skillData;
    const id = randomUUID();
    
    const query = `
      INSERT INTO skills (id, user_id, name, category, level, source, confidence)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [id, userId, name, category, level, source, confidence];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Récupérer toutes les compétences d'un utilisateur
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM skills 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Récupérer les compétences par catégorie
  static async findByCategory(userId, category) {
    const query = 'SELECT * FROM skills WHERE user_id = $1 AND category = $2';
    const result = await pool.query(query, [userId, category]);
    return result.rows;
  }

  // Supprimer une compétence
  static async delete(id, userId) {
    const query = 'DELETE FROM skills WHERE id = $1 AND user_id = $2';
    await pool.query(query, [id, userId]);
  }

  // Mettre à jour le niveau d'une compétence
  static async updateLevel(id, userId, level) {
    const query = 'UPDATE skills SET level = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
    const result = await pool.query(query, [level, id, userId]);
    return result.rows[0];
  }
}

export default Skill;