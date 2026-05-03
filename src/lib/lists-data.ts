import { Sparkles, Dumbbell, Leaf, Baby, Cpu, Briefcase, SprayCan, PawPrint, ChefHat, PiggyBank, type LucideIcon } from "lucide-react";

export type ListNiche = {
  id: string;
  name: string;
  emoji: string;
  icon: LucideIcon;
  description: string;
  color: string; // tailwind gradient classes
  defaultItems: string[];
  actions: { label: string; emoji: string }[];
};

export const NICHES: ListNiche[] = [
  {
    id: "maquiagem",
    name: "Maquiagem",
    emoji: "💄",
    icon: Sparkles,
    description: "Beleza e cuidado pessoal",
    color: "from-pink-400 to-rose-500",
    defaultItems: ["Base líquida", "Batom matte", "Gloss labial", "Pó translúcido", "Máscara de cílios", "Delineador", "Corretivo", "Blush"],
    actions: [
      { label: "Comparar tons", emoji: "🎨" },
      { label: "Ver tutoriais", emoji: "✨" },
      { label: "Marcas favoritas", emoji: "💖" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness",
    emoji: "💪",
    icon: Dumbbell,
    description: "Treino e nutrição esportiva",
    color: "from-emerald-400 to-teal-500",
    defaultItems: ["Whey protein", "Creatina", "Frango congelado", "Batata doce", "Ovos", "Aveia", "Banana", "Pasta de amendoim"],
    actions: [
      { label: "Calcular macros", emoji: "📊" },
      { label: "Plano de treino", emoji: "🏋️" },
    ],
  },
  {
    id: "vegana",
    name: "Vegana",
    emoji: "🌱",
    icon: Leaf,
    description: "100% plant-based",
    color: "from-green-400 to-lime-500",
    defaultItems: ["Tofu", "Leite vegetal", "Lentilha", "Grão de bico", "Tempeh", "Levedura nutricional", "Quinoa", "Cogumelos"],
    actions: [
      { label: "Receitas veganas", emoji: "🥗" },
      { label: "Substitutos", emoji: "🔄" },
    ],
  },
  {
    id: "bebe",
    name: "Bebê",
    emoji: "👶",
    icon: Baby,
    description: "Cuidados com seu pequeno",
    color: "from-sky-300 to-blue-400",
    defaultItems: ["Fraldas", "Lenços umedecidos", "Pomada de assadura", "Shampoo infantil", "Mamadeira", "Papinha", "Roupinhas", "Chupeta"],
    actions: [
      { label: "Por idade", emoji: "📅" },
      { label: "Marcas seguras", emoji: "✅" },
    ],
  },
  {
    id: "tecnologia",
    name: "Tecnologia",
    emoji: "💻",
    icon: Cpu,
    description: "Gadgets e eletrônicos",
    color: "from-blue-500 to-indigo-600",
    defaultItems: ["Cabo USB-C", "Carregador rápido", "Mouse sem fio", "Teclado mecânico", "Fone bluetooth", "SSD externo", "Webcam", "Hub USB"],
    actions: [
      { label: "Comparar preços", emoji: "💰" },
      { label: "Reviews", emoji: "⭐" },
    ],
  },
  {
    id: "escritorio",
    name: "Escritório",
    emoji: "📎",
    icon: Briefcase,
    description: "Produtividade e organização",
    color: "from-slate-400 to-gray-600",
    defaultItems: ["Caderno", "Canetas", "Post-its", "Grampeador", "Pasta arquivo", "Marca-texto", "Calculadora", "Organizador de mesa"],
    actions: [
      { label: "Setup home office", emoji: "🏠" },
      { label: "Ergonomia", emoji: "🪑" },
    ],
  },
  {
    id: "limpeza",
    name: "Limpeza",
    emoji: "🧽",
    icon: SprayCan,
    description: "Casa limpa e organizada",
    color: "from-cyan-400 to-blue-500",
    defaultItems: ["Detergente", "Água sanitária", "Desinfetante", "Sabão em pó", "Amaciante", "Esponja", "Pano de chão", "Lustra móveis"],
    actions: [
      { label: "Eco friendly", emoji: "🌿" },
      { label: "DIY caseiro", emoji: "🧪" },
    ],
  },
  {
    id: "pets",
    name: "Pets",
    emoji: "🐾",
    icon: PawPrint,
    description: "Para seu amigo de quatro patas",
    color: "from-amber-400 to-orange-500",
    defaultItems: ["Ração premium", "Petiscos", "Areia higiênica", "Brinquedo mordedor", "Coleira", "Shampoo pet", "Vermífugo", "Tapete higiênico"],
    actions: [
      { label: "Por porte", emoji: "🐕" },
      { label: "Veterinários", emoji: "🏥" },
    ],
  },
  {
    id: "gourmet",
    name: "Gourmet",
    emoji: "🍷",
    icon: ChefHat,
    description: "Sabores especiais",
    color: "from-purple-500 to-fuchsia-500",
    defaultItems: ["Azeite extra virgem", "Queijo brie", "Vinho tinto", "Trufa negra", "Sal rosa", "Pimenta do reino", "Massa fresca", "Chocolate 70%"],
    actions: [
      { label: "Harmonização", emoji: "🍇" },
      { label: "Receitas chef", emoji: "👨‍🍳" },
    ],
  },
  {
    id: "economica",
    name: "Econômica",
    emoji: "💰",
    icon: PiggyBank,
    description: "Máximo aproveitamento",
    color: "from-yellow-400 to-amber-500",
    defaultItems: ["Arroz", "Feijão", "Macarrão", "Óleo", "Açúcar", "Café", "Sal", "Farinha"],
    actions: [
      { label: "Promoções", emoji: "🏷️" },
      { label: "Atacado", emoji: "📦" },
    ],
  },
];
