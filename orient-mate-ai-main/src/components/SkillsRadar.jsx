//src/components/SkillsRadar.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const SkillsRadar = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  // Grouper les compétences par catégorie
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Répartition des compétences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-semibold text-sm capitalize">{category}</h4>
              <div className="space-y-1">
                {categorySkills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1 mr-2">{skill.name}</span>
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Légende des niveaux */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Avancé (80-100%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Intermédiaire (50-79%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Débutant (0-49%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsRadar;