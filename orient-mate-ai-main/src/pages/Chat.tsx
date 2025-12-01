// @ts-nocheck
import React from "react";
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, FileText, Image as ImageIcon, Mic, Brain, FileCheck, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis OrientIA, votre assistant d'orientation personnalisée. 🎯\n\nJe peux vous aider à :\n\n• Analyser vos compétences et documents\n• Vous orienter vers des formations adaptées à VOTRE profil\n• Trouver des métiers qui correspondent à vos compétences spécifiques\n• Accompagner votre reconversion professionnelle\n• Répondre à toutes vos questions sur l'orientation\n\nPour des conseils ultra-personnalisés, j'utilise votre dernier profil analysé. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date().toISOString()
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<string>("");
  const [hasAnalysis, setHasAnalysis] = useState(false);

  // Vérifier si l'utilisateur a des analyses
  useEffect(() => {
    checkUserAnalysis();
  }, []);

  const checkUserAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:5001/api/upload/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.documents.length > 0) {
          setHasAnalysis(true);
          
          // Récupérer la dernière analyse pour le contexte
          const latestAnalysis = data.documents[0];
          if (latestAnalysis.analysis) {
            setUserContext(`Profil analysé: ${latestAnalysis.analysis.detected_field} - ${latestAnalysis.analysis.skills?.length} compétences`);
          }
        }
      }
    } catch (error) {
      console.error("Erreur vérification analyses:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5001/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Mettre à jour le contexte si disponible
      if (data.userContext && data.userContext !== 'Pas de profil') {
        setUserContext(data.userContext);
        setHasAnalysis(true);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.assistantMessage?.content || "Je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        timestamp: data.assistantMessage?.timestamp || new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Chat error:", error);

      // Messages d'erreur plus contextuels
      let errorMessage = "Je rencontre un problème technique. ";
      
      if (error.message.includes("401")) {
        errorMessage += "Veuillez vérifier votre connexion.";
      } else if (error.message.includes("500")) {
        errorMessage += "Le service est temporairement indisponible.";
      } else {
        errorMessage += "Pouvez-vous réessayer dans quelques instants ?";
      }

      const errorResponse: Message = { 
        role: "assistant", 
        content: errorMessage,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Questions suggérées personnalisées basées sur le contexte
  const getSuggestedQuestions = () => {
    const baseQuestions = [
      "Quels métiers correspondent à mon profil actuel ?",
      "Comment progresser dans mon domaine ?",
      "Quelles formations me conseillez-vous ?",
      "Comment faire une reconversion professionnelle ?",
      "Quelles sont les perspectives d'évolution ?"
    ];

    const personalizedQuestions = [
      "Analysez mon profil pour une orientation précise",
      "Quels métiers avec mes compétences techniques ?",
      "Formations adaptées à mon niveau actuel",
      "Comment valoriser mes compétences en entretien ?",
      "Évolution de carrière dans mon domaine"
    ];

    return hasAnalysis ? personalizedQuestions : baseQuestions;
  };

  const suggestedQuestions = getSuggestedQuestions();

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    // Focus sur l'input après sélection
    setTimeout(() => {
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      inputElement?.focus();
    }, 100);
  };

  const formatMessageContent = (content: string) => {
    // Mise en forme basique du texte
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Assistant d'Orientation Personnalisée</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Discutez avec OrientIA
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conseils personnalisés basés sur votre profil analysé
            </p>
          </div>

          {/* Indicateur de contexte */}
          {hasAnalysis && userContext ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-green-800 text-sm">Conseils personnalisés activés</span>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                      Profil analysé
                    </Badge>
                  </div>
                  <p className="text-green-700 text-sm">
                    L'IA utilise votre dernier profil analysé pour des recommandations adaptées à vos compétences
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-amber-800 text-sm">Conseils génériques</span>
                    <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700">
                      Sans profil
                    </Badge>
                  </div>
                  <p className="text-amber-700 text-sm">
                    Pour des conseils personnalisés,{" "}
                    <a href="/analysis" className="underline font-medium hover:text-amber-800">
                      analysez votre CV
                    </a>{" "}
                    d'abord
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
                Questions suggérées :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 group"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    <Brain className="w-4 h-4 mr-2 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm leading-relaxed">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Card className="rounded-2xl border-border shadow-xl overflow-hidden">
            <ScrollArea className="h-[55vh] p-6">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      message.role === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>
                    <div
                      className={`flex-1 p-4 rounded-2xl max-w-[85%] ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
                          : "bg-muted/60 border border-border shadow-sm"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {formatMessageContent(message.content)}
                      </div>
                      {message.timestamp && (
                        <div className={`text-xs mt-2 ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-muted/60 border border-border">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <div
                          className="w-2 h-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        OrientIA analyse votre demande...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2 mb-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="flex-shrink-0 hover:bg-accent" 
                  title="Ajouter un document"
                  onClick={() => window.location.href = '/analysis'}
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="flex-shrink-0 hover:bg-accent" 
                  title="Analyser mon profil"
                  onClick={() => window.location.href = '/analysis'}
                >
                  <Brain className="w-4 h-4" />
                </Button>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder={
                      hasAnalysis 
                        ? "Posez votre question pour des conseils personnalisés..." 
                        : "Posez votre question ou analysez votre CV d'abord..."
                    }
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {hasAnalysis ? "🎯 Personnalisé" : "ℹ️ Général"}
                  </Badge>
                  <span>
                    {hasAnalysis 
                      ? "Conseils basés sur votre profil analysé" 
                      : "Analysez votre CV pour des conseils personnalisés"
                    }
                  </span>
                </div>
                <span>OrientIA • Réponses en temps réel</span>
              </div>
            </div>
          </Card>

          <div className="text-center mt-6 space-y-3">
            {!hasAnalysis && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  🚀 Passez au niveau supérieur
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Obtenez des conseils ultra-personnalisés basés sur vos compétences réelles
                </p>
                <Button 
                  onClick={() => window.location.href = '/analysis'}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analyser mon profil maintenant
                </Button>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              💡 L'IA s'améliore avec plus de contexte. Plus vous partagez d'informations, plus les conseils sont précis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}