import React, { useState } from "react"; 
import { Navigation } from "@/components/Navigation";
import { Upload, FileText, Brain, CheckCircle, TrendingUp, Award, FileCheck, ClipboardList, Sparkles, Send, User, Target, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Analysis() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState("documents");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<string | null>(null);
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, string>>({});
  const [skillsAnswers, setSkillsAnswers] = useState<Record<string, string>>({});

  const analysisTypes = [
    {
      id: "documents",
      icon: FileText,
      title: "Documents",
      description: "CV, diplômes, certificats",
      color: "text-blue-500"
    },
    {
      id: "personality",
      icon: User,
      title: "Personnalité",
      description: "Questionnaire de personnalité",
      color: "text-green-500"
    },
    {
      id: "skills",
      icon: Target,
      title: "Compétences",
      description: "Évaluation technique",
      color: "text-purple-500"
    }
  ];

  const personalityQuestions = [
    {
      id: 1,
      question: "Dans un projet de groupe, vous préférez :",
      options: [
        "Prendre le leadership et organiser l'équipe",
        "Travailler en collaboration avec les autres",
        "Vous concentrer sur une tâche spécifique en autonomie",
        "Analyser les problèmes et proposer des solutions"
      ]
    },
    {
      id: 2,
      question: "Face à un nouveau défi, vous :",
      options: [
        "Plongez directement pour apprendre en pratiquant",
        "Planifiez soigneusement avant de commencer",
        "Cherchez l'aide et les conseils d'experts",
        "Analysez les risques et opportunités"
      ]
    }
  ];

  const skillsQuestions = [
    {
      id: 1,
      category: "Technique",
      question: "Quel est votre niveau en programmation ?",
      options: [
        "Débutant - Je connais les bases",
        "Intermédiaire - Je peux développer des applications simples",
        "Avancé - Je maîtrise plusieurs langages et frameworks",
        "Expert - Je peux architecturer des systèmes complexes"
      ]
    }
  ];

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('cvFile', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Veuillez vous connecter d\'abord');
        return;
      }

      console.log('📤 Upload du fichier:', file.name);
      setIsAnalyzing(true);

      const response = await fetch('http://localhost:5001/api/upload/cv', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur upload: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ UPLOAD RÉUSSI:', data);
      
      setAnalysisResult(data.document);
      setUploadedFiles(prev => [...prev, data.document.filename]);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Upload error:', message);
      alert('Erreur lors de l\'upload: ' + message);
    } finally {
      setIsAnalyzing(false);
      try {
        (event.target as HTMLInputElement).value = '';
      } catch (e) {
        // Ignorer l'erreur de reset
      }
    }
  };

  const startQuestionnaire = (type: string) => {
    setCurrentQuestionnaire(type);
  };

  const handleCompleteAnalysis = async () => {
    // Combiner tous les résultats : documents + personnalité + compétences
    const completeAnalysis = {
      documents: analysisResult,
      personality: personalityAnswers,
      skills: skillsAnswers,
      completedAt: new Date().toISOString()
    };
    
    console.log('📊 Analyse complète:', completeAnalysis);
    alert('🎉 Analyse complète terminée ! Votre profil a été mis à jour.');
    
    // Rediriger vers le profil mis à jour
    window.location.href = '/profile';
  };

  const isAnalysisComplete = analysisResult && 
    Object.keys(personalityAnswers).length > 0 && 
    Object.keys(skillsAnswers).length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Analyse Complète de Profil</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Analysez votre profil complet
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Combinaison d'analyse documentaire, évaluation de personnalité et tests de compétences
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="documents">📄 Documents</TabsTrigger>
              <TabsTrigger value="personality">👤 Personnalité</TabsTrigger>
              <TabsTrigger value="skills">🎯 Compétences</TabsTrigger>
            </TabsList>

            {/* ONGLET DOCUMENTS */}
            <TabsContent value="documents" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {analysisTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <Card key={index} className={`border-border bg-card hover:shadow-card transition-all duration-300 ${
                      type.id === 'documents' ? 'ring-2 ring-primary' : ''
                    }`}>
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${type.color}`} />
                        </div>
                        <CardTitle className="text-xl">{type.title}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {type.id === 'documents' && analysisResult && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Complété
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Uploader Vos Documents</CardTitle>
                  <CardDescription>
                    CV, diplômes, certificats, lettres de recommandation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } ${isAnalyzing ? 'opacity-50' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                  >
                    {isAnalyzing ? (
                      <div className="space-y-4">
                        <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                        <h3 className="text-lg font-semibold">Analyse en cours...</h3>
                        <p className="text-sm text-muted-foreground">
                          Notre IA analyse votre CV et identifie vos compétences
                        </p>
                        <Progress value={75} className="w-full" />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Glissez-déposez vos documents ici
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Formats supportés: PDF, DOCX (Max 5MB par fichier)
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById("fileUploadInput")?.click()}
                          disabled={isAnalyzing}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Parcourir les fichiers
                        </Button>
                        <input
                          id="fileUploadInput"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isAnalyzing}
                          aria-label="Téléverser un document CV"
                          title="Sélectionner un fichier CV"
                        />
                      </>
                    )}
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-500" />
                        Fichiers analysés ({uploadedFiles.length})
                      </h4>
                      {uploadedFiles.map((file, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted flex items-center justify-between">
                          <span className="text-sm">{file}</span>
                          <Badge variant="secondary">Analysé</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {analysisResult && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Analyse documentaire terminée</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        {analysisResult.analysis?.skills?.length} compétences identifiées
                      </p>
                      <Button 
                        onClick={() => setActiveTab('personality')}
                        className="mt-3"
                      >
                        Continuer avec le questionnaire de personnalité →
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ONGLET PERSONNALITÉ */}
            <TabsContent value="personality" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6 text-green-500" />
                    Questionnaire de Personnalité
                  </CardTitle>
                  <CardDescription>
                    Aidez-nous à mieux comprendre vos traits de personnalité pour des recommandations plus précises
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!currentQuestionnaire ? (
                    <div className="text-center space-y-6 py-8">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <User className="w-10 h-10 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Découvrez votre profil de personnalité</h3>
                        <p className="text-muted-foreground mb-4">
                          Ce questionnaire nous aide à comprendre vos préférences de travail, 
                          vos forces naturelles et vos styles d'apprentissage.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                          <Clock className="w-4 h-4" />
                          <span>Environ 5-10 minutes</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startQuestionnaire('personality')}
                        size="lg"
                        className="gap-2"
                      >
                        Commencer le questionnaire
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Interface du questionnaire */}
                      <div className="p-6 border rounded-lg">
                        <h4 className="font-semibold mb-4">Question 1/10</h4>
                        <p className="text-lg mb-6">Dans un projet de groupe, vous préférez :</p>
                        <div className="space-y-3">
                          {personalityQuestions[0].options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start h-auto py-3 text-left"
                              onClick={() => {
                                setPersonalityAnswers(prev => ({
                                  ...prev,
                                  [personalityQuestions[0].id]: option
                                }));
                                // Passer à la question suivante...
                              }}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setCurrentQuestionnaire(null)}>
                          Retour
                        </Button>
                        <Button onClick={() => {
                          setCurrentQuestionnaire(null);
                          setActiveTab('skills');
                        }}>
                          Questionnaire Compétences →
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ONGLET COMPÉTENCES */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-500" />
                    Évaluation des Compétences
                  </CardTitle>
                  <CardDescription>
                    Évaluez vos compétences techniques et transversales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!currentQuestionnaire ? (
                    <div className="text-center space-y-6 py-8">
                      <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                        <Target className="w-10 h-10 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Évaluez vos compétences</h3>
                        <p className="text-muted-foreground mb-4">
                          Ce test nous aide à identifier vos forces techniques 
                          et les domaines où vous pouvez vous améliorer.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                          <Clock className="w-4 h-4" />
                          <span>Environ 10-15 minutes</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => startQuestionnaire('skills')}
                        size="lg"
                        className="gap-2"
                      >
                        Commencer l'évaluation
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Interface du questionnaire compétences */}
                      <div className="p-6 border rounded-lg">
                        <h4 className="font-semibold mb-4">Question 1/8</h4>
                        <p className="text-lg mb-6">Quel est votre niveau en programmation ?</p>
                        <div className="space-y-3">
                          {skillsQuestions[0].options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start h-auto py-3 text-left"
                              onClick={() => {
                                setSkillsAnswers(prev => ({
                                  ...prev,
                                  [skillsQuestions[0].id]: option
                                }));
                                // Passer à la question suivante...
                              }}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setCurrentQuestionnaire(null)}>
                          Retour
                        </Button>
                        <Button onClick={handleCompleteAnalysis}>
                          Terminer l'analyse complète
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Résumé de progression */}
              <Card>
                <CardHeader>
                  <CardTitle>Progression de l'analyse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        Analyse documentaire
                      </span>
                      <Badge variant={analysisResult ? "default" : "outline"}>
                        {analysisResult ? "Complété" : "En attente"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        Questionnaire personnalité
                      </span>
                      <Badge variant={Object.keys(personalityAnswers).length > 0 ? "default" : "outline"}>
                        {Object.keys(personalityAnswers).length > 0 ? "Complété" : "En attente"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-500" />
                        Évaluation compétences
                      </span>
                      <Badge variant={Object.keys(skillsAnswers).length > 0 ? "default" : "outline"}>
                        {Object.keys(skillsAnswers).length > 0 ? "Complété" : "En attente"}
                      </Badge>
                    </div>
                  </div>

                  {isAnalysisComplete && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Analyse complète terminée !</span>
                      </div>
                      <p className="text-sm text-green-600 mb-3">
                        Votre profil a été analysé sous tous les angles. Vous pouvez maintenant 
                        consulter vos recommandations personnalisées.
                      </p>
                      <Button onClick={handleCompleteAnalysis} className="w-full">
                        Voir mes recommandations complètes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}