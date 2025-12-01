import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

class User {
  static async create(userData) {
    const { email, password, name, phone, location, bio } = userData;
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (id, email, password, name, phone, location, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, name, phone, location, bio, created_at
    `;

    const values = [id, email, hashedPassword, name, phone, location, bio];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    console.log('🔍 Recherche user par ID:', id);
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    const user = result.rows[0];
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour ID:', id);
      return null;
    }

    console.log('✅ Utilisateur trouvé:', user.id);
    
    // Ne JAMAIS renvoyer le password
    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateProfile(id, updateData) {
    const { name, phone, location, bio, career_goals } = updateData;
    const query = `
      UPDATE users 
      SET name = $1, phone = $2, location = $3, bio = $4, career_goals = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, email, name, phone, location, bio, career_goals, updated_at
    `;
    const values = [name, phone, location, bio, career_goals, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default User;