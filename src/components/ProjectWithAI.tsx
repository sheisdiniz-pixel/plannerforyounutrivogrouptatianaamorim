import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bot } from "lucide-react";

interface ProjectCard {
  emoji: string;
  name: string;
  description: string;
  link: string;
  linkLabel: string;
}

const PROJECTS: ProjectCard[] = [
  {
    emoji: "📅",
    name: "Calendário Editorial",
    description: "Seu roteiro semanal de conteúdo com posts prontos para cada dia",
    link: "#",
    linkLabel: "Acessar",
  },
  {
    emoji: "🛍️",
    name: "IA INFLUENCER",
    description: "Estrutura completa do produto Shopee e TikTok",
    link: "#",
    linkLabel: "Acessar",
  },
  {
    emoji: "🏢",
    name: "NutrivoGroup",
    description: "Mapa interno da sua startup de conexões digitais",
    link: "#",
    linkLabel: "Acessar",
  },
  {
    emoji: "🤖",
    name: "AchadinhosComIA",
    description: "Estrutura completa do perfil pioneiro no Instagram",
    link: "#",
    linkLabel: "Acessar",
  },
  {
    emoji: "✨",
    name: "Criar com Claude",
    description: "Abrir o Claude para criar novos projetos e documentos",
    link: "https://claude.ai",
    linkLabel: "Abrir Claude",
  },
];

export default function ProjectWithAI() {
  return (
    <section className="space-y-6">
      {/* Card principal */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Desenvolva seu Projeto com o Claude</h2>
            <p className="mt-1 text-sm text-purple-100">
              Acesse seus documentos estratégicos e ferramentas de IA em um só lugar
            </p>
          </div>
        </div>
      </Card>

      {/* Grid de projetos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <Card
            key={project.name}
            className="group flex flex-col justify-between overflow-hidden border-border/60 p-0 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{project.emoji}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-foreground">{project.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 p-4">
              <span className="text-xs text-muted-foreground">{project.link === "#" ? "Link em breve" : "Externo"}</span>
              <Button
                size="sm"
                className="gap-1.5 rounded-full"
                onClick={() => window.open(project.link, "_blank", "noopener,noreferrer")}
                disabled={project.link === "#"}
              >
                {project.linkLabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
