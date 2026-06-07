import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Bot, TrendingUp, CloudSun } from "lucide-react";

interface TrendTag {
  label: string;
  description: string;
  query: string;
}

const TRENDING_AI_TAGS: TrendTag[] = [
  {
    label: "IA Generativa",
    description: "Criação automática de textos, imagens e vídeos com modelos como GPT-5 e Gemini.",
    query: "IA generativa tendências 2026",
  },
  {
    label: "Agentes Autônomos",
    description: "Agentes de IA que executam tarefas complexas sem supervisão humana.",
    query: "AI agents autonomous workflows",
  },
  {
    label: "LLMs Multimodais",
    description: "Modelos que entendem texto, áudio, imagem e vídeo ao mesmo tempo.",
    query: "multimodal LLM 2026",
  },
  {
    label: "RAG e Vector DBs",
    description: "Retrieval-Augmented Generation para respostas precisas com dados próprios.",
    query: "RAG retrieval augmented generation",
  },
  {
    label: "Edge AI",
    description: "IA rodando direto no dispositivo, sem nuvem — mais rápido e privado.",
    query: "edge AI on-device inference",
  },
  {
    label: "Prompt Engineering",
    description: "Técnicas avançadas para extrair o máximo dos modelos de linguagem.",
    query: "prompt engineering avançado",
  },
  {
    label: "Fine-tuning & LoRA",
    description: "Personalize modelos de IA para o seu nicho com pouco dado e baixo custo.",
    query: "LoRA fine-tuning LLM",
  },
  {
    label: "AI Safety & Alignment",
    description: "Tendência crescente em segurança, ética e alinhamento de modelos.",
    query: "AI safety alignment 2026",
  },
];

const CLIMATE_TAGS: TrendTag[] = [
  {
    label: "Mudanças Climáticas",
    description: "Como eventos extremos afetam rotinas, saúde e planejamento diário.",
    query: "mudanças climáticas impacto cotidiano",
  },
  {
    label: "Eficiência Energética",
    description: "Tecnologias e hábitos para reduzir consumo em casa e no trabalho.",
    query: "eficiência energética tecnologia 2026",
  },
  {
    label: "Previsões e Clima Extremo",
    description: "IA aplicada à previsão de ondas de calor, chuvas intensas e secas.",
    query: "previsão clima extremo IA",
  },
];

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
    description: "Nunca mais fique sem ideia do que postar. Tenha um roteiro pronto para cada dia da semana.",
    link: "#",
    linkLabel: "Usar Agora",
  },
  {
    emoji: "🛍️",
    name: "IA INFLUENCER",
    description: "Descubra como monetizar seu perfil com estratégias prontas para Shopee e TikTok.",
    link: "#",
    linkLabel: "Começar a Vender",
  },
  {
    emoji: "🏢",
    name: "NutrivoGroup",
    description: "Organize suas conexões digitais e transforme sua presença online em resultados reais.",
    link: "#",
    linkLabel: "Acessar Mapa",
  },
  {
    emoji: "🤖",
    name: "AchadinhosComIA",
    description: "Veja a estrutura completa de um perfil que já usa IA para crescer no Instagram.",
    link: "#",
    linkLabel: "Ver Modelo",
  },
  {
    emoji: "✨",
    name: "Criar com Claude",
    description: "Abra o Claude agora mesmo e comece a criar conteúdo, projetos e documentos em segundos.",
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
            <h2 className="text-xl font-extrabold tracking-tight">Crie Seus Projetos com IA e Ganhe Tempo</h2>
            <p className="mt-1 text-sm text-purple-100">
              Tudo o que você precisa para produzir mais, vender melhor e crescer online — em um só lugar.
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
