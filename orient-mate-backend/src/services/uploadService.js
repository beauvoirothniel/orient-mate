import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

/**
 * Extrait le texte d'un fichier PDF
 */
export const extractTextFromPDF = async (buffer) => {
  try {
    console.log('🔍 Début extraction PDF...');
    
    const data = await pdfParse(buffer);
    const text = data.text.trim();
    
    console.log(`✅ PDF extrait - ${text.length} caractères`);
    console.log('📄 Extrait (200 premiers chars):', text.substring(0, 200));
    
    return text;
  } catch (error) {
    console.error('❌ Erreur extraction PDF:', error);
    throw new Error(`Échec extraction PDF: ${error.message}`);
  }
};

/**
 * Extrait le texte d'un fichier DOCX
 */
export const extractTextFromDOCX = async (buffer) => {
  try {
    console.log('🔍 Début extraction DOCX...');
    
    const result = await mammoth.extractRawText({ buffer });
    let text = result.value.trim();
    
    // Nettoyer le texte
    text = text.replace(/\n{3,}/g, '\n\n'); // Réduire les multiples sauts de ligne
    
    console.log(`✅ DOCX extrait - ${text.length} caractères`);
    console.log('📄 Extrait (200 premiers chars):', text.substring(0, 200));
    
    if (!text || text.length < 10) {
      throw new Error('Texte extrait trop court ou vide');
    }
    
    return text;
  } catch (error) {
    console.error('❌ Erreur extraction DOCX:', error);
    throw new Error(`Échec extraction DOCX: ${error.message}`);
  }
};

/**
 * Service unifié d'extraction
 */
export const extractTextFromFile = async (buffer, mimeType, originalName) => {
  try {
    console.log(`📂 Extraction: ${originalName} (${mimeType})`);
    
    if (mimeType === "application/pdf") {
      return await extractTextFromPDF(buffer);
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType.includes("word") ||
      originalName.toLowerCase().endsWith('.docx')
    ) {
      return await extractTextFromDOCX(buffer);
    } else {
      throw new Error(`Format non supporté: ${mimeType}`);
    }
  } catch (error) {
    console.error('❌ Erreur extraction générale:', error);
    throw error;
  }
};