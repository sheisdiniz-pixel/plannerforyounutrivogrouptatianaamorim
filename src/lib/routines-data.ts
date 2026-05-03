import { Sun, Moon, Dumbbell, BookOpen, Sparkles, Briefcase, Heart, Coffee, type LucideIcon } from "lucide-react";

export type RoutineTask = {
  id: string;
  label: string;
  emoji: string;
  xp: number;
};

export type Routine = {
  id: string;
  name: string;
  emoji: string;
  icon: LucideIcon;
  description: string;
  color: string;
  tasks: RoutineTask[];
};

export const ROUTINES: Routine[] = [
  {
    id: "manha",
    name: "Manhã Produtiva",
    emoji: "🌅",
    icon: Sun,
    description: "Comece o dia com energia",
    color: "from-amber-400 to-orange-500",
    tasks: [
      { id: "m1", label: "Beber 1 copo de água", emoji: "💧", xp: 10 },
      { id: "m2", label: "Alongamento 5 min", emoji: "🧘", xp: 15 },
      { id: "m3", label: "Café da manhã saudável", emoji: "🥗", xp: 20 },
      { id: "m4", label: "Planejar o dia", emoji: "📝", xp: 25 },
      { id: "m5", label: "Meditar 10 min", emoji: "🕯️", xp: 30 },
    ],
  },
  {
    id: "trabalho",
    name: "Foco no Trabalho",
    emoji: "💼",
    icon: Briefcase,
    description: "Produtividade máxima",
    color: "from-slate-500 to-slate-700",
    tasks: [
      { id: "t1", label: "Revisar prioridades", emoji: "🎯", xp: 15 },
      { id: "t2", label: "Bloco focado 25 min", emoji: "⏱️", xp: 30 },
      { id: "t3", label: "Limpar caixa de email", emoji: "📧", xp: 20 },
      { id: "t4", label: "Pausa ativa", emoji: "🚶", xp: 10 },
      { id: "t5", label: "Fechar tarefa importante", emoji: "✅", xp: 40 },
    ],
  },
  {
    id: "treino",
    name: "Treino do Dia",
    emoji: "💪",
    icon: Dumbbell,
    description: "Movimente seu corpo",
    color: "from-emerald-500 to-teal-600",
    tasks: [
      { id: "f1", label: "Aquecimento 5 min", emoji: "🔥", xp: 10 },
      { id: "f2", label: "Cardio 20 min", emoji: "🏃", xp: 30 },
      { id: "f3", label: "Treino de força", emoji: "🏋️", xp: 40 },
      { id: "f4", label: "Alongar pós-treino", emoji: "🤸", xp: 15 },
      { id: "f5", label: "Hidratar bem", emoji: "💦", xp: 10 },
    ],
  },
  {
    id: "estudo",
    name: "Estudo & Aprendizado",
    emoji: "📚",
    icon: BookOpen,
    description: "Evolua todo dia",
    color: "from-indigo-500 to-violet-600",
    tasks: [
      { id: "e1", label: "Ler 20 páginas", emoji: "📖", xp: 25 },
      { id: "e2", label: "Curso online 30 min", emoji: "🎓", xp: 30 },
      { id: "e3", label: "Anotar aprendizados", emoji: "✍️", xp: 15 },
      { id: "e4", label: "Praticar idioma", emoji: "🗣️", xp: 20 },
    ],
  },
  {
    id: "autocuidado",
    name: "Autocuidado",
    emoji: "💆",
    icon: Heart,
    description: "Cuide de você",
    color: "from-pink-400 to-rose-500",
    tasks: [
      { id: "a1", label: "Skincare matinal", emoji: "✨", xp: 15 },
      { id: "a2", label: "10 min de silêncio", emoji: "🤫", xp: 20 },
      { id: "a3", label: "Diário de gratidão", emoji: "🙏", xp: 25 },
      { id: "a4", label: "Sem celular por 1h", emoji: "📵", xp: 30 },
    ],
  },
  {
    id: "noite",
    name: "Noite Tranquila",
    emoji: "🌙",
    icon: Moon,
    description: "Encerre o dia bem",
    color: "from-blue-600 to-indigo-700",
    tasks: [
      { id: "n1", label: "Jantar leve", emoji: "🍲", xp: 15 },
      { id: "n2", label: "Revisar o dia", emoji: "📔", xp: 20 },
      { id: "n3", label: "Skincare noturna", emoji: "🌸", xp: 15 },
      { id: "n4", label: "Leitura 15 min", emoji: "📕", xp: 20 },
      { id: "n5", label: "Dormir antes das 23h", emoji: "😴", xp: 30 },
    ],
  },
];

export type Rank = { name: string; min: number; emoji: string; color: string };

export const RANKS: Rank[] = [
  { name: "Iniciante", min: 0, emoji: "🌱", color: "text-emerald-600" },
  { name: "Bronze", min: 100, emoji: "🥉", color: "text-amber-700" },
  { name: "Prata", min: 300, emoji: "🥈", color: "text-slate-500" },
  { name: "Ouro", min: 700, emoji: "🥇", color: "text-yellow-500" },
  { name: "Platina", min: 1500, emoji: "💎", color: "text-cyan-500" },
  { name: "Lenda", min: 3000, emoji: "👑", color: "text-fuchsia-500" },
];

export function rankFromXp(xp: number): { current: Rank; next?: Rank; progress: number } {
  let current = RANKS[0];
  let next: Rank | undefined = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1];
    }
  }
  const progress = next ? ((xp - current.min) / (next.min - current.min)) * 100 : 100;
  return { current, next, progress };
}

export const REWARDS: { xp: number; label: string; emoji: string }[] = [
  { xp: 50, label: "Café especial ☕", emoji: "🎁" },
  { xp: 150, label: "Episódio da série favorita", emoji: "🎬" },
  { xp: 300, label: "Refeição preferida", emoji: "🍕" },
  { xp: 600, label: "Dia de spa em casa", emoji: "🛁" },
  { xp: 1000, label: "Compra desejada", emoji: "🛍️" },
];
