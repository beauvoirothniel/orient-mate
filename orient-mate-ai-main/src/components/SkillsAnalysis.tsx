import { useState } from "react";
import { Upload, FileText, Brain, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const SkillsAnalysis = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Analyse IA de vos compétences",
      description: "Upload CV, diplômes, certificats"
    },
    {
      icon: TrendingUp,
      title: "Évaluation personnalisée",
      description: "Tests et questionnaires adaptatifs"
    },
    {
      icon: FileText,
      title: "Profil complet",
      description: "Construction de votre parcours"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Analysez Vos Compétences
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre IA analyse vos documents et compétences pour créer un profil complet 
            et vous orienter vers les meilleures opportunités.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border bg-card hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card className="max-w-4xl mx-auto border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Commencez Votre Analyse</CardTitle>
            <CardDescription>
              Uploadez vos documents ou discutez avec notre IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Glissez-déposez vos documents
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                CV, diplômes, certificats, lettres de recommandation
              </p>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Parcourir les fichiers
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/chat')}
              className="w-full gap-2" 
              size="lg"
            >
              <Brain className="w-5 h-5" />
              Discuter avec l'Assistant IA
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
