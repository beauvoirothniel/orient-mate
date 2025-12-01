//src/components/AnalysisResults.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const AnalysisResults = ({ analysis, document }) => {
  if (!analysis) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>Aucune analyse disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { skills, suggested_roles, detected_field, summary, experience_level } = analysis;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* En-tête de l'analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📊 Résultats de l'analyse</span>
            <Badge variant={getExperienceLevelVariant(experience_level)}>
              {experience_level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Domaine détecté</h3>
              <Badge variant="secondary" className="text-lg">
                {detected_field}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Synthèse</h3>
              <p className="text-muted-foreground">{summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compétences */}
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Compétences identifiées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant="outline">{skill.category}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Niveau</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rôles suggérés */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Rôles professionnels suggérés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {suggested_roles.map((role, index) => (
              <Badge key={index} variant="default" className="text-sm py-2 px-3">
                {role}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informations du document */}
      {document && (
        <Card>
          <CardHeader>
            <CardTitle>📄 Document analysé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Fichier:</span>
                <p className="text-muted-foreground">{document.filename}</p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <p className="text-muted-foreground">{document.fileType}</p>
              </div>
              <div>
                <span className="font-medium">Taille:</span>
                <p className="text-muted-foreground">
                  {(document.fileSize / 1024).toFixed(2)} KB
                </p>
              </div>
              <div>
                <span className="font-medium">Date d'analyse:</span>
                <p className="text-muted-foreground">
                  {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function pour les variants de badge selon le niveau
const getExperienceLevelVariant = (level) => {
  switch (level.toLowerCase()) {
    case 'débutant':
      return 'secondary';
    case 'intermédiaire':
      return 'default';
    case 'avancé':
      return 'destructive';
    case 'expert':
      return 'default';
    default:
      return 'outline';
  }
};

export default AnalysisResults;