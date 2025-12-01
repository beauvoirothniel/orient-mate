import { ExternalLink, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import university1 from "@/assets/university-1.jpg";
import university2 from "@/assets/university-2.jpg";
import university3 from "@/assets/university-3.jpg";

const universities = [
  {
    name: "Université Polytechnique",
    location: "Paris, France",
    image: university1,
    rating: 4.8,
    programs: "Ingénierie, Sciences, Technologie",
    description: "Excellence académique en sciences et technologies avec des programmes de renommée mondiale."
  },
  {
    name: "Institut des Sciences Avancées",
    location: "Lyon, France",
    image: university2,
    rating: 4.9,
    programs: "Recherche, Innovation, IA",
    description: "Centre d'excellence pour la recherche scientifique et l'innovation technologique."
  },
  {
    name: "Académie Internationale",
    location: "Bordeaux, France",
    image: university3,
    rating: 4.7,
    programs: "Commerce, Droit, Sciences Humaines",
    description: "Formation complète avec une perspective internationale et des échanges mondiaux."
  }
];

export const Universities = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Nos Universités Partenaires
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre réseau d'établissements prestigieux offrant 
            des programmes d'excellence dans divers domaines.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.map((university, index) => (
            <div 
              key={index}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-card transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={university.image}
                  alt={university.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-primary-foreground/90 backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold text-sm">{university.rating}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {university.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{university.location}</span>
                  </div>
                </div>
                
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {university.programs}
                </div>
                
                <p className="text-muted-foreground">
                  {university.description}
                </p>
                
                <Button variant="default" className="w-full gap-2 group/btn">
                  En savoir plus
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
