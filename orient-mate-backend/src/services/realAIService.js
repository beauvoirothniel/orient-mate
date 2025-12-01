import ollama from '../config/ollama.js';

/**
 * 🎯 Analyse CV avec détection intelligente multi-niveaux
 */
export const analyzeCV = async (cvText) => {
  try {
    console.log('🤖 Début analyse IA...');
    
    // 1️⃣ Pré-analyse rapide du CV pour optimiser le prompt
    const preAnalysis = quickAnalyze(cvText);
    console.log('📊 Pré-analyse:', preAnalysis);
    
    // 2️⃣ Prompt adapté au contenu détecté
    const prompt = buildAdaptivePrompt(cvText, preAnalysis);
    
    console.log('📤 Envoi à llama3.2:3b...');
    const response = await ollama.chat({
      model: 'llama3.2:3b',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
      options: {
        temperature: 0.2,
        top_p: 0.9,
        num_predict: 1000,
      }
    });

    console.log('📨 Réponse IA reçue');
    
    // 3️⃣ Parsing intelligent avec validation
    let analysis = parseAndValidate(response.message.content, cvText, preAnalysis);
    
    console.log('✅ Analyse finale:', analysis);
    return analysis;

  } catch (error) {
    console.error('❌ Erreur IA:', error.message);
    // Fallback basé sur la pré-analyse
    return createIntelligentFallback(cvText);
  }
};

/**
 * 🔍 Pré-analyse rapide pour détecter le profil
 */
const quickAnalyze = (cvText) => {
  const text = cvText.toLowerCase();
  const length = cvText.length;
  
  // Détection de domaines techniques
  const domains = {
    dev: /javascript|python|java|react|node|angular|vue|c\+\+|php|ruby|sql|mongodb/.test(text),
    electronics: /arduino|electronique|iot|capteur|circuit|raspberry|microcontroleur/.test(text),
    data: /data|analyse|statistique|machine learning|ia|tableau|power bi/.test(text),
    design: /figma|photoshop|ux|ui|design|maquette|prototype/.test(text),
    management: /chef de projet|management|gestion|coordination|équipe|scrum|agile/.test(text),
    network: /réseau|système|linux|windows|serveur|cloud|aws|azure|devops/.test(text),
  };
  
  // Détection du niveau d'expérience
  const experienceMarkers = {
    junior: /débutant|junior|première expérience|stage|alternance/.test(text),
    senior: /senior|expert|10 ans|expérimenté|lead|principal/.test(text),
    mid: !(/débutant|junior/.test(text)) && !(/senior|expert/.test(text)),
  };
  
  // Détection de langues et certifications
  const languages = {
    french: /français|francais/.test(text),
    english: /anglais|english|toeic|toefl/.test(text),
    other: /espagnol|allemand|arabe|chinois/.test(text),
  };
  
  return {
    domains,
    experienceMarkers,
    languages,
    length,
    hasEducation: /diplome|formation|université|école|master|licence/.test(text),
    hasProjects: /projet|réalisation|développement de/.test(text),
  };
};

/**
 * 🎨 Construction d'un prompt adapté au profil détecté
 */
const buildAdaptivePrompt = (cvText, preAnalysis) => {
  const mainDomain = Object.keys(preAnalysis.domains).find(d => preAnalysis.domains[d]) || 'général';
  
  return `TU ES UN EXPERT EN ANALYSE DE CV SPÉCIALISÉ EN ${mainDomain.toUpperCase()}.

CV À ANALYSER:
${cvText.substring(0, 3500)}

CONTEXTE DÉTECTÉ:
- Domaine principal: ${mainDomain}
- Longueur CV: ${preAnalysis.length} caractères
- Projets mentionnés: ${preAnalysis.hasProjects ? 'Oui' : 'Non'}
- Formation: ${preAnalysis.hasEducation ? 'Oui' : 'Non'}

MISSION:
Extrais UNIQUEMENT les informations RÉELLES du CV.

RÉPONDS EN JSON STRICT:
{
  "skills": [
    {"name": "compétence exacte du CV", "category": "catégorie", "level": 0-100}
  ],
  "suggested_roles": ["métier réaliste 1", "métier réaliste 2"],
  "detected_field": "${mainDomain}",
  "summary": "synthèse objective basée sur le CV",
  "experience_level": "Débutant/Intermédiaire/Avancé"
}

RÈGLES:
- Compétences: SEULEMENT celles mentionnées
- Niveau: basé sur l'expérience décrite
- Métiers: réalistes et accessibles avec ce profil
- NE PAS inventer de contenu

JSON UNIQUEMENT, AUCUN TEXTE SUPPLÉMENTAIRE.`;
};

/**
 * 🧪 Parsing et validation de la réponse
 */
const parseAndValidate = (responseContent, cvText, preAnalysis) => {
  try {
    // Extraction du JSON
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Pas de JSON trouvé');
    
    let analysis = JSON.parse(jsonMatch[0]);
    
    // ✅ Validation et enrichissement
    analysis = validateAndEnrich(analysis, cvText, preAnalysis);
    
    return analysis;
    
  } catch (error) {
    console.log('⚠️ Parsing JSON échoué, fallback intelligent');
    return createIntelligentFallback(cvText, preAnalysis);
  }
};

/**
 * ✅ Validation et enrichissement de l'analyse
 */
const validateAndEnrich = (analysis, cvText, preAnalysis) => {
  // S'assurer de la structure minimale
  if (!analysis.skills || analysis.skills.length === 0) {
    analysis.skills = extractSkillsFromCV(cvText);
  }
  
  if (!analysis.suggested_roles || analysis.suggested_roles.length === 0) {
    analysis.suggested_roles = generateRolesFromSkills(analysis.skills);
  }
  
  // Enrichir avec la pré-analyse
  analysis.detected_field = analysis.detected_field || detectMainField(preAnalysis);
  analysis.experience_level = analysis.experience_level || detectExperienceLevel(cvText, preAnalysis);
  analysis.summary = analysis.summary || generateSummary(cvText, analysis.skills);
  
  // Ajouter des métadonnées utiles
  analysis.metadata = {
    cv_length: cvText.length,
    skills_count: analysis.skills.length,
    has_projects: preAnalysis.hasProjects,
    has_education: preAnalysis.hasEducation,
    analysis_date: new Date().toISOString(),
  };
  
  return analysis;
};

/**
 * 🔧 Extraction intelligente de compétences du CV
 */
const extractSkillsFromCV = (cvText) => {
  const text = cvText.toLowerCase();
  const detectedSkills = [];
  
  // Base de compétences techniques courantes
  const skillsDatabase = {
    // Programmation
    'JavaScript': { keywords: ['javascript', 'js', 'node.js', 'nodejs'], category: 'Développement', baseLevel: 65 },
    'Python': { keywords: ['python', 'django', 'flask', 'pandas'], category: 'Développement', baseLevel: 70 },
    'Java': { keywords: ['java', 'spring', 'hibernate'], category: 'Développement', baseLevel: 70 },
    'React': { keywords: ['react', 'reactjs', 'react.js'], category: 'Frontend', baseLevel: 65 },
    'Vue.js': { keywords: ['vue', 'vuejs', 'vue.js'], category: 'Frontend', baseLevel: 65 },
    'Angular': { keywords: ['angular', 'angularjs'], category: 'Frontend', baseLevel: 65 },
    
    // Électronique
    'Arduino': { keywords: ['arduino', 'atmega'], category: 'Électronique', baseLevel: 60 },
    'IoT': { keywords: ['iot', 'internet of things', 'objets connectés'], category: 'Électronique', baseLevel: 65 },
    'Électronique': { keywords: ['électronique', 'electronique', 'circuit'], category: 'Hardware', baseLevel: 60 },
    
    // Data
    'SQL': { keywords: ['sql', 'mysql', 'postgresql', 'oracle'], category: 'Base de données', baseLevel: 65 },
    'Data Analysis': { keywords: ['analyse de données', 'data analysis', 'statistiques'], category: 'Data', baseLevel: 60 },
    
    // Outils
    'Git': { keywords: ['git', 'github', 'gitlab', 'version control'], category: 'Outils', baseLevel: 60 },
    'Docker': { keywords: ['docker', 'container', 'conteneur'], category: 'DevOps', baseLevel: 70 },
    
    // Soft skills
    'Gestion de projet': { keywords: ['gestion de projet', 'chef de projet', 'coordination'], category: 'Management', baseLevel: 65 },
    'Communication': { keywords: ['communication', 'présentation', 'rédaction'], category: 'Soft Skills', baseLevel: 60 },
  };
  
  // Détection des compétences
  for (const [skillName, skillData] of Object.entries(skillsDatabase)) {
    const found = skillData.keywords.some(keyword => text.includes(keyword));
    if (found) {
      // Ajuster le niveau basé sur le contexte
      let level = skillData.baseLevel;
      
      // Boost si le mot apparaît plusieurs fois
      const occurrences = skillData.keywords.reduce((count, keyword) => {
        return count + (text.match(new RegExp(keyword, 'g')) || []).length;
      }, 0);
      
      if (occurrences > 3) level += 10;
      if (occurrences > 5) level += 15;
      
      // Boost si "expert", "avancé", etc.
      if (text.includes('expert ' + skillData.keywords[0]) || text.includes('maîtrise ' + skillData.keywords[0])) {
        level += 15;
      }
      
      detectedSkills.push({
        name: skillName,
        category: skillData.category,
        level: Math.min(100, level)
      });
    }
  }
  
  // Fallback si aucune compétence détectée
  if (detectedSkills.length === 0) {
    detectedSkills.push({
      name: 'Compétences générales',
      category: 'Général',
      level: 50
    });
  }
  
  return detectedSkills;
};

/**
 * 💼 Génération de rôles basée sur les compétences
 */
const generateRolesFromSkills = (skills) => {
  const rolesMap = {
    'Développement': ['Développeur Full-Stack', 'Développeur Backend', 'Développeur Frontend'],
    'Frontend': ['Développeur Frontend', 'Intégrateur Web', 'UI Developer'],
    'Backend': ['Développeur Backend', 'API Developer'],
    'Électronique': ['Technicien Électronique', 'Ingénieur IoT', 'Développeur Embedded'],
    'Hardware': ['Ingénieur Hardware', 'Technicien Électronique'],
    'Data': ['Data Analyst', 'Data Engineer', 'Business Intelligence'],
    'DevOps': ['DevOps Engineer', 'Administrateur Système', 'SRE'],
    'Management': ['Chef de Projet', 'Scrum Master', 'Product Owner'],
  };
  
  const detectedRoles = new Set();
  
  skills.forEach(skill => {
    const roles = rolesMap[skill.category];
    if (roles) {
      roles.forEach(role => detectedRoles.add(role));
    }
  });
  
  return Array.from(detectedRoles).slice(0, 5); // Max 5 rôles
};

/**
 * 🎯 Détection du domaine principal
 */
const detectMainField = (preAnalysis) => {
  const domains = preAnalysis.domains;
  const activeDomains = Object.keys(domains).filter(d => domains[d]);
  
  if (activeDomains.length === 0) return 'Général';
  if (activeDomains.includes('dev')) return 'Développement Logiciel';
  if (activeDomains.includes('electronics')) return 'Électronique et IoT';
  if (activeDomains.includes('data')) return 'Data & Analyse';
  if (activeDomains.includes('design')) return 'Design & UX';
  if (activeDomains.includes('management')) return 'Management de Projet';
  
  return activeDomains[0];
};

/**
 * 📊 Détection du niveau d'expérience
 */
const detectExperienceLevel = (cvText, preAnalysis) => {
  const text = cvText.toLowerCase();
  
  if (preAnalysis.experienceMarkers.senior) return 'Avancé';
  if (preAnalysis.experienceMarkers.junior) return 'Débutant';
  
  // Analyse par longueur et contenu
  if (cvText.length > 2000 && preAnalysis.hasProjects) return 'Intermédiaire';
  if (cvText.length < 800) return 'Débutant';
  
  return 'Intermédiaire';
};

/**
 * 📝 Génération d'un résumé intelligent
 */
const generateSummary = (cvText, skills) => {
  if (skills.length === 0) return 'Profil polyvalent en cours d\'analyse';
  
  const topSkills = skills.slice(0, 3).map(s => s.name).join(', ');
  const experienceHint = cvText.length > 1500 ? 'avec expérience confirmée' : 'en développement professionnel';
  
  return `Profil spécialisé en ${topSkills} ${experienceHint}. ${skills.length} compétences identifiées.`;
};

/**
 * 🆘 Fallback intelligent basé sur l'analyse du CV
 */
const createIntelligentFallback = (cvText, preAnalysis = null) => {
  console.log('🔄 Création d\'analyse de fallback intelligente');
  
  if (!preAnalysis) {
    preAnalysis = quickAnalyze(cvText);
  }
  
  const skills = extractSkillsFromCV(cvText);
  const roles = generateRolesFromSkills(skills);
  
  return {
    skills,
    suggested_roles: roles,
    detected_field: detectMainField(preAnalysis),
    summary: generateSummary(cvText, skills),
    experience_level: detectExperienceLevel(cvText, preAnalysis),
    metadata: {
      fallback: true,
      reason: 'IA non disponible ou réponse invalide',
      cv_length: cvText.length,
      analysis_date: new Date().toISOString(),
    }
  };
};

export default { analyzeCV };