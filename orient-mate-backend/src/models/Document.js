import { pool } from '../config/database.js';
import { randomUUID } from 'crypto';

class Document {
  static async create(documentData) {
  const { userId, filename, fileType, fileUrl = null, fileSize, analysisData } = documentData;
  
  // Utiliser UUID au lieu de timestamp
  const id = randomUUID();

  // CORRECTION: Simplifier le fileType
  const simplifiedFileType = fileType.includes('pdf') ? 'pdf' : 
                            fileType.includes('word') ? 'docx' : 
                            fileType.includes('document') ? 'docx' : 'other';

  const query = `
    INSERT INTO documents (id, user_id, filename, file_type, file_url, file_size, analysis_data)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    id,
    userId,
    filename,
    simplifiedFileType, // CORRECTION: Utiliser le type simplifié
    fileUrl,
    fileSize,
    JSON.stringify(analysisData)
  ];
  
  const result = await pool.query(query, values);
  const row = result.rows[0];

  // Parser analysis_data si c'est une string
  try {
    row.analysis_data = row.analysis_data ? 
      (typeof row.analysis_data === 'string' ? JSON.parse(row.analysis_data) : row.analysis_data) 
      : null;
  } catch (e) {
    console.warn('⚠️ Impossible de parser analysis_data:', e.message);
  }

  return row;
}

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM documents 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    
    return result.rows.map(d => ({
      ...d,
      analysis_data: d.analysis_data ? 
        (typeof d.analysis_data === 'string' ? JSON.parse(d.analysis_data) : d.analysis_data) 
        : null
    }));
  }

  static async findById(id, userId) {
    const query = 'SELECT * FROM documents WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    const row = result.rows[0];
    
    if (!row) return null;
    
    try {
      row.analysis_data = row.analysis_data ? 
        (typeof row.analysis_data === 'string' ? JSON.parse(row.analysis_data) : row.analysis_data) 
        : null;
    } catch (e) {
      console.warn('⚠️ Impossible de parser analysis_data:', e.message);
    }
    
    return row;
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM documents WHERE id = $1 AND user_id = $2';
    await pool.query(query, [id, userId]);
  }
}

export default Document;