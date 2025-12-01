//src/components/CVUpload.jsx
import React, { useState } from 'react';
import { useToast } from './ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const CVUpload = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file) => {
    if (!file) return;

    // Validation du type de fichier
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Type de fichier non supporté',
        description: 'Seuls les fichiers PDF et DOCX sont autorisés.',
        variant: 'destructive',
      });
      return;
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La taille maximale est de 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('cvFile', file);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/upload/cv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Simulation de progression
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const data = await response.json();

      clearInterval(interval);
      setUploadProgress(100);

      if (data.success) {
        toast({
          title: 'Analyse réussie !',
          description: 'Votre CV a été analysé avec succès.',
        });
        onUploadSuccess?.(data.document);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erreur d\'analyse',
        description: error.message || 'Une erreur est survenue lors de l\'analyse.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>📄 Analyser mon CV</CardTitle>
        <CardDescription>
          Téléchargez votre CV (PDF ou DOCX) pour obtenir une analyse détaillée de vos compétences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          } ${isUploading ? 'opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="cv-upload"
            accept=".pdf,.docx,.doc"
            onChange={handleChange}
            disabled={isUploading}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="space-y-4">
              <div className="text-lg font-medium">Analyse en cours...</div>
              <Progress value={uploadProgress} className="w-full" />
              <div className="text-sm text-muted-foreground">
                Extraction des compétences et analyse IA
              </div>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-4">📄</div>
              <div className="space-y-2">
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <Button variant="outline" size="lg">
                    Choisir un fichier
                  </Button>
                </label>
                <p className="text-sm text-muted-foreground">
                  ou glissez-déposez votre CV ici
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX • Max 5MB
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CVUpload;