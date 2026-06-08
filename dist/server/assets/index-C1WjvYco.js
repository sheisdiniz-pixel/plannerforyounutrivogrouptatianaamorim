import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Sparkles, Dumbbell, Leaf, Baby, Cpu, Briefcase, SprayCan, PawPrint, ChefHat, PiggyBank, Sun, BookOpen, Heart, Moon, X, ChevronDown, Check, ChevronUp, Clock, Plus, Bell, Download, Filter, ArrowUpDown, Wallet, CheckCircle2, Calendar, Trash2, Volume2, AlertTriangle, Bot, ExternalLink, TrendingUp, CloudSun, Lightbulb, Folder, ShoppingBag, ListChecks, Trophy, Zap, Flame, Gift, FolderPlus, Save } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { toast, Toaster } from "sonner";
import * as ProgressPrimitive from "@radix-ui/react-progress";
const NICHES = [
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
      { label: "Marcas favoritas", emoji: "💖" }
    ]
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
      { label: "Plano de treino", emoji: "🏋️" }
    ]
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
      { label: "Substitutos", emoji: "🔄" }
    ]
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
      { label: "Marcas seguras", emoji: "✅" }
    ]
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
      { label: "Reviews", emoji: "⭐" }
    ]
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
      { label: "Ergonomia", emoji: "🪑" }
    ]
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
      { label: "DIY caseiro", emoji: "🧪" }
    ]
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
      { label: "Veterinários", emoji: "🏥" }
    ]
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
      { label: "Receitas chef", emoji: "👨‍🍳" }
    ]
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
      { label: "Atacado", emoji: "📦" }
    ]
  }
];
const ROUTINES = [
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
      { id: "m5", label: "Meditar 10 min", emoji: "🕯️", xp: 30 }
    ]
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
      { id: "t5", label: "Fechar tarefa importante", emoji: "✅", xp: 40 }
    ]
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
      { id: "f5", label: "Hidratar bem", emoji: "💦", xp: 10 }
    ]
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
      { id: "e4", label: "Praticar idioma", emoji: "🗣️", xp: 20 }
    ]
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
      { id: "a4", label: "Sem celular por 1h", emoji: "📵", xp: 30 }
    ]
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
      { id: "n5", label: "Dormir antes das 23h", emoji: "😴", xp: 30 }
    ]
  }
];
const RANKS = [
  { name: "Iniciante", min: 0, emoji: "🌱", color: "text-emerald-600" },
  { name: "Bronze", min: 100, emoji: "🥉", color: "text-amber-700" },
  { name: "Prata", min: 300, emoji: "🥈", color: "text-slate-500" },
  { name: "Ouro", min: 700, emoji: "🥇", color: "text-yellow-500" },
  { name: "Platina", min: 1500, emoji: "💎", color: "text-cyan-500" },
  { name: "Lenda", min: 3e3, emoji: "👑", color: "text-fuchsia-500" }
];
function rankFromXp(xp) {
  let current = RANKS[0];
  let next = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1];
    }
  }
  const progress = next ? (xp - current.min) / (next.min - current.min) * 100 : 100;
  return { current, next, progress };
}
const REWARDS = [
  { xp: 50, label: "Café especial ☕", emoji: "🎁" },
  { xp: 150, label: "Episódio da série favorita", emoji: "🎬" },
  { xp: 300, label: "Refeição preferida", emoji: "🍕" },
  { xp: 600, label: "Dia de spa em casa", emoji: "🛁" },
  { xp: 1e3, label: "Compra desejada", emoji: "🛍️" }
];
const KEY$2 = "planner-for-you::lists";
const FOLDERS_KEY = "planner-for-you::folders";
function useLists() {
  const [lists, setLists] = useState([]);
  const [folders, setFolders] = useState(["Geral"]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY$2);
      if (raw) setLists(JSON.parse(raw));
      const fr = localStorage.getItem(FOLDERS_KEY);
      if (fr) setFolders(JSON.parse(fr));
    } catch {
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY$2, JSON.stringify(lists));
  }, [lists]);
  useEffect(() => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }, [folders]);
  const saveList = (list) => {
    setLists((prev) => {
      const idx = prev.findIndex((l) => l.id === list.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = list;
        return copy;
      }
      return [list, ...prev];
    });
  };
  const deleteList = (id) => setLists((prev) => prev.filter((l) => l.id !== id));
  const addFolder = (name) => {
    if (!name.trim()) return;
    setFolders((prev) => prev.includes(name) ? prev : [...prev, name]);
  };
  return { lists, folders, saveList, deleteList, addFolder };
}
const KEY$1 = "planner-for-you::checklist";
const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
const initial = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  completedToday: {},
  totalCompletions: 0
};
function useChecklist() {
  const [state, setState] = useState(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY$1);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lastActiveDay !== today()) {
          parsed.completedToday = {};
        }
        setState(parsed);
      }
    } catch {
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY$1, JSON.stringify(state));
  }, [state]);
  const toggleTask = (taskId, xp) => {
    setState((prev) => {
      const wasDone = !!prev.completedToday[taskId];
      const completedToday = { ...prev.completedToday, [taskId]: !wasDone };
      const delta = wasDone ? -xp : xp;
      const totalCompletions = prev.totalCompletions + (wasDone ? -1 : 1);
      let streak = prev.streak;
      let lastActiveDay = prev.lastActiveDay;
      if (!wasDone) {
        const t = today();
        if (lastActiveDay !== t) {
          const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
          streak = lastActiveDay === yesterday ? streak + 1 : 1;
          lastActiveDay = t;
        }
      }
      return {
        ...prev,
        xp: Math.max(0, prev.xp + delta),
        completedToday,
        totalCompletions: Math.max(0, totalCompletions),
        streak,
        lastActiveDay
      };
    });
  };
  const reset = () => setState(initial);
  return { state, toggleTask, reset };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const profileLogo = "/assets/profile-logo-C0QyFCsK.png";
const KEY = "task-reminders-v1";
function load$1() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
function scheduleAll(reminders, getLabel) {
  if (typeof window === "undefined") return () => {
  };
  const timers = [];
  Object.entries(reminders).forEach(([id, time]) => {
    if (!time) return;
    const [h, m] = time.split(":").map(Number);
    const now = /* @__PURE__ */ new Date();
    const next = /* @__PURE__ */ new Date();
    next.setHours(h, m, 0, 0);
    if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
    const ms = next.getTime() - now.getTime();
    const t = window.setTimeout(() => {
      const label = getLabel(id);
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⏰ Planner For You", { body: label });
      }
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
        audio.play().catch(() => {
        });
      } catch {
      }
    }, ms);
    timers.push(t);
  });
  return () => timers.forEach((t) => clearTimeout(t));
}
function useReminders(getLabel) {
  const [reminders, setReminders] = useState(() => load$1());
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(reminders));
    const cleanup = scheduleAll(reminders, getLabel);
    return cleanup;
  }, [reminders, getLabel]);
  const setReminder = async (taskId, time) => {
    if (time && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    setReminders((r) => {
      const next = { ...r };
      if (time) next[taskId] = time;
      else delete next[taskId];
      return next;
    });
  };
  return { reminders, setReminder };
}
const BILLS_KEY = "bills-control::bills";
const SOUND_KEY = "bills-control::alarm-sound";
function load() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BILLS_KEY) || "[]");
  } catch {
    return [];
  }
}
function daysUntil(date) {
  const now = /* @__PURE__ */ new Date();
  now.setHours(0, 0, 0, 0);
  const d = /* @__PURE__ */ new Date(date + "T00:00:00");
  return Math.round((d.getTime() - now.getTime()) / 864e5);
}
function leadDaysFor(amount) {
  if (amount >= 1e3) return 6;
  if (amount >= 800) return 4;
  return 2;
}
function useBills() {
  const [bills, setBills] = useState(() => load());
  const [alarmSound, setAlarmSound] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(SOUND_KEY);
  });
  const audioRef = useRef(null);
  useEffect(() => {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }, [bills]);
  useEffect(() => {
    if (alarmSound) localStorage.setItem(SOUND_KEY, alarmSound);
    else localStorage.removeItem(SOUND_KEY);
  }, [alarmSound]);
  useEffect(() => {
    const check = () => {
      setBills((prev) => {
        let changed = false;
        const next = prev.map((b) => {
          if (b.status !== "Pago") {
            const d = daysUntil(b.dueDate);
            if (d < 0 && b.status !== "Atrasado") {
              changed = true;
              return { ...b, status: "Atrasado" };
            }
          }
          return b;
        });
        return changed ? next : prev;
      });
      const today2 = (/* @__PURE__ */ new Date()).toDateString();
      bills.forEach((b) => {
        if (b.status === "Pago") return;
        const d = daysUntil(b.dueDate);
        const lead = leadDaysFor(b.amount);
        const shouldAlert = d <= lead && d >= 0;
        const overdue = d < 0;
        const lastDay = b.notifiedAt ? new Date(b.notifiedAt).toDateString() : null;
        if ((shouldAlert || overdue) && lastDay !== today2) {
          triggerAlert(b, overdue);
          setBills((prev) => prev.map((x) => x.id === b.id ? { ...x, notifiedAt: Date.now() } : x));
        }
      });
    };
    check();
    const t = window.setInterval(check, 6e4);
    return () => clearInterval(t);
  }, [bills.length]);
  const triggerAlert = (b, overdue) => {
    const title = overdue ? "⚠️ Conta atrasada" : "🔔 Conta a vencer";
    const body = `${b.name} — R$ ${b.amount.toFixed(2)} (vence ${b.dueDate})`;
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body });
      } catch {
      }
    }
    playAlarm();
  };
  const playAlarm = () => {
    try {
      if (alarmSound) {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = alarmSound;
        audioRef.current.play().catch(() => {
        });
      } else {
        const a = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
        a.play().catch(() => {
        });
      }
    } catch {
    }
  };
  const requestPermission = async () => {
    if (!("Notification" in window)) return "denied";
    if (Notification.permission === "default") return await Notification.requestPermission();
    return Notification.permission;
  };
  const addBill = (b) => {
    setBills((p) => [{ ...b, id: Math.random().toString(36).slice(2, 10), createdAt: Date.now() }, ...p]);
  };
  const updateBill = (id, patch) => setBills((p) => p.map((b) => b.id === id ? { ...b, ...patch } : b));
  const deleteBill = (id) => setBills((p) => p.filter((b) => b.id !== id));
  return {
    bills,
    setBills,
    alarmSound,
    setAlarmSound,
    addBill,
    updateBill,
    deleteBill,
    requestPermission,
    playAlarm
  };
}
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const CATEGORIES = ["Moradia", "Alimentação", "Saúde", "Transporte", "Educação", "Lazer", "Assinaturas", "Outros"];
const RECURRENCES = ["Única", "Mensal", "Semanal", "Anual"];
const STATUSES = ["Pendente", "Pago", "Atrasado"];
function formatBRL(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function googleCalendarUrl(b) {
  const date = b.dueDate.replace(/-/g, "");
  const text = encodeURIComponent(b.name);
  const details = encodeURIComponent(`Valor: R$ ${b.amount.toFixed(2)}
Categoria: ${b.category}
${b.notes ?? ""}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${date}/${date}&details=${details}`;
}
function outlookCalendarUrl(b) {
  const start = `${b.dueDate}T09:00:00`;
  const end = `${b.dueDate}T10:00:00`;
  const subject = encodeURIComponent(b.name);
  const body = encodeURIComponent(`Valor: R$ ${b.amount.toFixed(2)} — ${b.category}`);
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${subject}&body=${body}&startdt=${start}&enddt=${end}`;
}
function downloadICS(b) {
  const dt = b.dueDate.replace(/-/g, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Planner For You//Contas//PT",
    "BEGIN:VEVENT",
    `UID:${b.id}@planner-for-you`,
    `DTSTAMP:${(/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    `DTEND;VALUE=DATE:${dt}`,
    `SUMMARY:${b.name}`,
    `DESCRIPTION:Valor R$ ${b.amount.toFixed(2)} - ${b.category}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${b.name}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
function exportCSV(bills) {
  const header = ["Nome", "Valor", "Vencimento", "Status", "Categoria", "Recorrência", "Observações"];
  const rows = bills.map((b) => [b.name, b.amount.toFixed(2), b.dueDate, b.status, b.category, b.recurrence, (b.notes ?? "").replace(/\n/g, " ")]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contas.csv";
  a.click();
  URL.revokeObjectURL(url);
}
const emptyForm = () => ({
  name: "",
  amount: 0,
  dueDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  status: "Pendente",
  category: "Moradia",
  recurrence: "Mensal",
  notes: ""
});
function BillsControl() {
  const { bills, alarmSound, setAlarmSound, addBill, updateBill, deleteBill, requestPermission, playAlarm } = useBills();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
  const [sortBy, setSortBy] = useState("due");
  const [showSettings, setShowSettings] = useState(false);
  const monthBills = useMemo(
    () => bills.filter((b) => b.dueDate.startsWith(filterMonth)),
    [bills, filterMonth]
  );
  const totals = useMemo(() => {
    const total = monthBills.reduce((s, b) => s + b.amount, 0);
    const pago = monthBills.filter((b) => b.status === "Pago").reduce((s, b) => s + b.amount, 0);
    const pendente = monthBills.filter((b) => b.status === "Pendente").reduce((s, b) => s + b.amount, 0);
    const atrasado = monthBills.filter((b) => b.status === "Atrasado").reduce((s, b) => s + b.amount, 0);
    return { total, pago, pendente, atrasado, pct: total ? pago / total * 100 : 0 };
  }, [monthBills]);
  const upcoming = useMemo(() => {
    return [...bills].filter((b) => b.status !== "Pago" && daysUntil(b.dueDate) >= 0).sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))[0];
  }, [bills]);
  const filtered = useMemo(() => {
    let arr = monthBills;
    if (filterStatus !== "all") arr = arr.filter((b) => b.status === filterStatus);
    if (filterCategory !== "all") arr = arr.filter((b) => b.category === filterCategory);
    arr = [...arr].sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a.dueDate.localeCompare(b.dueDate);
    });
    return arr;
  }, [monthBills, filterStatus, filterCategory, sortBy]);
  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setOpen(true);
  };
  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({ name: b.name, amount: b.amount, dueDate: b.dueDate, status: b.status, category: b.category, recurrence: b.recurrence, notes: b.notes ?? "" });
    setOpen(true);
  };
  const save = async () => {
    if (!form.name.trim() || !form.amount || !form.dueDate) {
      toast.error("Preencha nome, valor e vencimento");
      return;
    }
    const perm = await requestPermission();
    if (perm !== "granted") toast("Ative as notificações para receber os alarmes 🔔");
    if (editingId) {
      updateBill(editingId, form);
      toast.success("Conta atualizada");
    } else {
      addBill(form);
      toast.success("Conta cadastrada", { description: `Aviso ${leadDaysFor(form.amount)} dias antes` });
    }
    setOpen(false);
  };
  const onSoundFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setAlarmSound(base64);
      toast.success("Som do alarme salvo");
    };
    reader.readAsDataURL(file);
  };
  const statusBadge = (s) => {
    if (s === "Pago") return /* @__PURE__ */ jsxs(Badge, { className: "bg-emerald-500", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "mr-1 h-3 w-3" }),
      "Pago"
    ] });
    if (s === "Atrasado") return /* @__PURE__ */ jsxs(Badge, { className: "bg-rose-500", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "mr-1 h-3 w-3" }),
      "Atrasado"
    ] });
    return /* @__PURE__ */ jsxs(Badge, { className: "bg-amber-500", children: [
      /* @__PURE__ */ jsx(Clock, { className: "mr-1 h-3 w-3" }),
      "Pendente"
    ] });
  };
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5 grid grid-cols-2 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-0 bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-slate-900", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-slate-700", children: "Total do mês" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-extrabold", children: formatBRL(totals.total) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 bg-gradient-to-br from-emerald-400 to-teal-500 p-4 text-slate-900", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-slate-700", children: "Pago" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-extrabold", children: formatBRL(totals.pago) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-slate-900", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-slate-700", children: "Pendente" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-extrabold", children: formatBRL(totals.pendente) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 bg-gradient-to-br from-rose-500 to-fuchsia-600 p-4 text-slate-900", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-slate-700", children: "Atrasado" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-extrabold", children: formatBRL(totals.atrasado) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mb-5 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm font-semibold", children: [
        /* @__PURE__ */ jsx("span", { children: "Progresso do mês" }),
        /* @__PURE__ */ jsxs("span", { children: [
          totals.pct.toFixed(0),
          "% pago"
        ] })
      ] }),
      /* @__PURE__ */ jsx(Progress, { value: totals.pct, className: "mt-2" }),
      upcoming && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-sky-600" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Próxima a vencer:" }),
        /* @__PURE__ */ jsxs("span", { children: [
          upcoming.name,
          " — ",
          formatBRL(upcoming.amount),
          " (",
          daysUntil(upcoming.dueDate),
          "d)"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxs(Button, { onClick: openNew, className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Nova conta"
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setShowSettings(true), className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
        " Alarme"
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => exportCSV(filtered), className: "gap-1.5", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        " Exportar CSV"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "month",
            value: filterMonth,
            onChange: (e) => setFilterMonth(e.target.value),
            className: "h-9 w-40 bg-white"
          }
        ),
        /* @__PURE__ */ jsxs(Select, { value: filterStatus, onValueChange: setFilterStatus, children: [
          /* @__PURE__ */ jsxs(SelectTrigger, { className: "h-9 w-32 bg-white", children: [
            /* @__PURE__ */ jsx(Filter, { className: "mr-1 h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx(SelectValue, {})
          ] }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Status" }),
            STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: filterCategory, onValueChange: setFilterCategory, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-9 w-36 bg-white", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Categoria" }),
            CATEGORIES.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Select, { value: sortBy, onValueChange: (v) => setSortBy(v), children: [
          /* @__PURE__ */ jsxs(SelectTrigger, { className: "h-9 w-36 bg-white", children: [
            /* @__PURE__ */ jsx(ArrowUpDown, { className: "mr-1 h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx(SelectValue, {})
          ] }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "due", children: "Vencimento" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "amount", children: "Valor" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "name", children: "Nome" })
          ] })
        ] })
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxs(Card, { className: "flex flex-col items-center gap-3 p-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-full bg-emerald-50 p-4", children: /* @__PURE__ */ jsx(Wallet, { className: "h-8 w-8 text-emerald-600" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Nenhuma conta neste filtro" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Cadastre sua primeira conta para começar 💸" }),
      /* @__PURE__ */ jsxs(Button, { onClick: openNew, className: "mt-2", children: [
        /* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Nova conta"
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: filtered.map((b) => {
      const d = daysUntil(b.dueDate);
      return /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold", children: b.name }),
              statusBadge(b.status),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: b.category }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: b.recurrence })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm text-muted-foreground", children: [
              "Vence ",
              (/* @__PURE__ */ new Date(b.dueDate + "T00:00:00")).toLocaleDateString("pt-BR"),
              b.status !== "Pago" && /* @__PURE__ */ jsxs("span", { className: d < 0 ? "ml-2 text-rose-600" : d <= leadDaysFor(b.amount) ? "ml-2 text-amber-600" : "ml-2", children: [
                "• ",
                d < 0 ? `${Math.abs(d)}d atrasada` : d === 0 ? "hoje" : `em ${d}d`
              ] })
            ] }),
            b.notes && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: b.notes })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-extrabold", children: formatBRL(b.amount) }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "Aviso ",
              leadDaysFor(b.amount),
              "d antes"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
          b.status !== "Pago" && /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
            updateBill(b.id, { status: "Pago" });
            toast.success("Conta marcada como paga");
          }, children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "mr-1 h-3.5 w-3.5" }),
            " Marcar pago"
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => openEdit(b), children: "Editar" }),
          /* @__PURE__ */ jsx("a", { href: googleCalendarUrl(b), target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "mr-1 h-3.5 w-3.5" }),
            " Google"
          ] }) }),
          /* @__PURE__ */ jsx("a", { href: outlookCalendarUrl(b), target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "mr-1 h-3.5 w-3.5" }),
            " Outlook"
          ] }) }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => downloadICS(b), children: [
            /* @__PURE__ */ jsx(Calendar, { className: "mr-1 h-3.5 w-3.5" }),
            " Apple (.ics)"
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
            deleteBill(b.id);
            toast("Conta removida");
          }, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }, b.id);
    }) }),
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5 text-emerald-600" }),
        editingId ? "Editar conta" : "Nova conta"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(Input, { placeholder: "Nome (ex: Aluguel)", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsx(Input, { type: "number", step: "0.01", placeholder: "Valor R$", value: form.amount || "", onChange: (e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 }) }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: form.dueDate, onChange: (e) => setForm({ ...form, dueDate: e.target.value }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (v) => setForm({ ...form, status: v }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: form.category, onValueChange: (v) => setForm({ ...form, category: v }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c)) })
          ] }),
          /* @__PURE__ */ jsxs(Select, { value: form.recurrence, onValueChange: (v) => setForm({ ...form, recurrence: v }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: RECURRENCES.map((r) => /* @__PURE__ */ jsx(SelectItem, { value: r, children: r }, r)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Textarea, { placeholder: "Observações", rows: 3, value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "💡 Alarme automático ",
          leadDaysFor(form.amount),
          " ",
          leadDaysFor(form.amount) === 1 ? "dia" : "dias",
          " antes do vencimento."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { onClick: save, children: "Salvar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { open: showSettings, onOpenChange: setShowSettings, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5 text-amber-500" }),
        " Configurações do alarme"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Permitimos notificações no navegador para te avisar antes do vencimento. Escolha um som do seu dispositivo para personalizar o alarme." }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full", onClick: async () => {
          const p = await requestPermission();
          toast(p === "granted" ? "Notificações ativadas ✅" : "Permissão: " + p);
        }, children: [
          /* @__PURE__ */ jsx(Bell, { className: "mr-2 h-4 w-4" }),
          " Ativar notificações"
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Som do alarme" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "audio/*",
              onChange: (e) => onSoundFile(e.target.files?.[0] ?? null),
              className: "mt-1 block w-full text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "flex-1", onClick: playAlarm, children: [
            /* @__PURE__ */ jsx(Volume2, { className: "mr-2 h-4 w-4" }),
            " Testar som"
          ] }),
          alarmSound && /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: () => {
            setAlarmSound(null);
            toast("Som padrão restaurado");
          }, children: "Remover" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("strong", { children: "Regras de antecedência:" }),
          /* @__PURE__ */ jsxs("ul", { className: "ml-4 mt-1 list-disc", children: [
            /* @__PURE__ */ jsx("li", { children: "Até R$ 799 → aviso 2 dias antes" }),
            /* @__PURE__ */ jsx("li", { children: "R$ 800 a R$ 999 → aviso 4 dias antes" }),
            /* @__PURE__ */ jsx("li", { children: "Acima de R$ 1.000 → aviso 6 dias antes" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { onClick: () => setShowSettings(false), children: "Fechar" }) })
    ] }) })
  ] });
}
const TRENDING_AI_TAGS = [
  {
    label: "IA Generativa",
    description: "Criação automática de textos, imagens e vídeos com modelos como GPT-5 e Gemini.",
    query: "IA generativa tendências 2026"
  },
  {
    label: "Agentes Autônomos",
    description: "Agentes de IA que executam tarefas complexas sem supervisão humana.",
    query: "AI agents autonomous workflows"
  },
  {
    label: "LLMs Multimodais",
    description: "Modelos que entendem texto, áudio, imagem e vídeo ao mesmo tempo.",
    query: "multimodal LLM 2026"
  },
  {
    label: "RAG e Vector DBs",
    description: "Retrieval-Augmented Generation para respostas precisas com dados próprios.",
    query: "RAG retrieval augmented generation"
  },
  {
    label: "Edge AI",
    description: "IA rodando direto no dispositivo, sem nuvem — mais rápido e privado.",
    query: "edge AI on-device inference"
  },
  {
    label: "Prompt Engineering",
    description: "Técnicas avançadas para extrair o máximo dos modelos de linguagem.",
    query: "prompt engineering avançado"
  },
  {
    label: "Fine-tuning & LoRA",
    description: "Personalize modelos de IA para o seu nicho com pouco dado e baixo custo.",
    query: "LoRA fine-tuning LLM"
  },
  {
    label: "AI Safety & Alignment",
    description: "Tendência crescente em segurança, ética e alinhamento de modelos.",
    query: "AI safety alignment 2026"
  }
];
const CLIMATE_TAGS = [
  {
    label: "Mudanças Climáticas",
    description: "Como eventos extremos afetam rotinas, saúde e planejamento diário.",
    query: "mudanças climáticas impacto cotidiano"
  },
  {
    label: "Eficiência Energética",
    description: "Tecnologias e hábitos para reduzir consumo em casa e no trabalho.",
    query: "eficiência energética tecnologia 2026"
  },
  {
    label: "Previsões e Clima Extremo",
    description: "IA aplicada à previsão de ondas de calor, chuvas intensas e secas.",
    query: "previsão clima extremo IA"
  }
];
const PROJECTS = [
  {
    emoji: "📅",
    name: "Calendário Editorial",
    description: "Nunca mais fique sem ideia do que postar. Tenha um roteiro pronto para cada dia da semana.",
    link: "#",
    linkLabel: "Usar Agora"
  },
  {
    emoji: "🛍️",
    name: "IA INFLUENCER",
    description: "Descubra como monetizar seu perfil com estratégias prontas para Shopee e TikTok.",
    link: "#",
    linkLabel: "Começar a Vender"
  },
  {
    emoji: "🏢",
    name: "NutrivoGroup",
    description: "Organize suas conexões digitais e transforme sua presença online em resultados reais.",
    link: "#",
    linkLabel: "Acessar Mapa"
  },
  {
    emoji: "🤖",
    name: "AchadinhosComIA",
    description: "Veja a estrutura completa de um perfil que já usa IA para crescer no Instagram.",
    link: "#",
    linkLabel: "Ver Modelo"
  },
  {
    emoji: "✨",
    name: "Criar com Claude",
    description: "Abra o Claude agora mesmo e comece a criar conteúdo, projetos e documentos em segundos.",
    link: "https://claude.ai",
    linkLabel: "Abrir Claude"
  }
];
function ProjectWithAI() {
  return /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(Card, { className: "overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur", children: /* @__PURE__ */ jsx(Bot, { className: "h-7 w-7 text-white" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold tracking-tight", children: "Crie Seus Projetos com IA e Ganhe Tempo" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-purple-100", children: "Tudo o que você precisa para produzir mais, vender melhor e crescer online — em um só lugar." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: PROJECTS.map((project) => /* @__PURE__ */ jsxs(
      Card,
      {
        className: "group flex flex-col justify-between overflow-hidden border-border/60 p-0 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsx("span", { className: "text-3xl", children: project.emoji }) }),
            /* @__PURE__ */ jsx("h3", { className: "mt-3 text-lg font-bold text-foreground", children: project.name }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: project.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border/60 bg-muted/20 p-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: project.link === "#" ? "Link em breve" : "Externo" }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 rounded-full",
                onClick: () => window.open(project.link, "_blank", "noopener,noreferrer"),
                disabled: project.link === "#",
                children: [
                  project.linkLabel,
                  /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
                ]
              }
            )
          ] })
        ]
      },
      project.name
    )) }),
    /* @__PURE__ */ jsxs(Card, { className: "border-border/60 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Assuntos em Alta — Tecnologia & IA" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Termos com alto volume de busca e tendências em ascensão. Clique para explorar no Google Trends." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: TRENDING_AI_TAGS.map((tag) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          title: tag.description,
          onClick: () => window.open(
            `https://trends.google.com/trends/explore?q=${encodeURIComponent(tag.query)}`,
            "_blank",
            "noopener,noreferrer"
          ),
          className: "group",
          children: /* @__PURE__ */ jsxs(
            Badge,
            {
              variant: "secondary",
              className: "cursor-pointer rounded-full border border-border/60 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:from-violet-500/20 hover:to-fuchsia-500/20",
              children: [
                "#",
                tag.label
              ]
            }
          )
        },
        tag.label
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-2 sm:grid-cols-2", children: TRENDING_AI_TAGS.map((tag) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/40 bg-muted/20 p-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-foreground", children: [
          "#",
          tag.label
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: tag.description })
      ] }, `desc-${tag.label}`)) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-border/60 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white", children: /* @__PURE__ */ jsx(CloudSun, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Clima & Temperatura" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Impacto do clima extremo no cotidiano e na tecnologia — tendências globais." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: CLIMATE_TAGS.map((tag) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          title: tag.description,
          onClick: () => window.open(
            `https://trends.google.com/trends/explore?q=${encodeURIComponent(tag.query)}`,
            "_blank",
            "noopener,noreferrer"
          ),
          children: /* @__PURE__ */ jsxs(
            Badge,
            {
              variant: "secondary",
              className: "cursor-pointer rounded-full border border-border/60 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:from-sky-500/20 hover:to-emerald-500/20",
              children: [
                "#",
                tag.label
              ]
            }
          )
        },
        tag.label
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-2 sm:grid-cols-3", children: CLIMATE_TAGS.map((tag) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/40 bg-muted/20 p-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-xs font-semibold text-foreground", children: [
          "#",
          tag.label
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: tag.description })
      ] }, `clima-${tag.label}`)) })
    ] })
  ] });
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
const BRAND = {
  bg: "#0f1e2a",
  // fundo escuro principal
  bgMid: "#162535",
  // fundo cards/seções
  bgLight: "#1d3045",
  // bordas e separadores
  accent: "#2dd4bf",
  // versão mais escura do accent
  gold: "#f59e0b",
  // dourado XP/rank
  rose: "#f43f5e",
  // streak/vermelho
  text: "#e2f0f9",
  // texto principal
  textMuted: "#7a9db8",
  // texto secundário
  white: "#ffffff"
};
const headerGradient = `linear-gradient(135deg, #0f1e2a 0%, #162535 50%, #1a3a4a 100%)`;
const accentGradient = `linear-gradient(135deg, ${BRAND.accent} 0%, #3b82f6 100%)`;
function Index() {
  const {
    lists,
    folders,
    saveList,
    deleteList,
    addFolder
  } = useLists();
  const {
    state: checklistState,
    toggleTask
  } = useChecklist();
  const [activeNiche, setActiveNiche] = useState(NICHES[0]);
  const [editor, setEditor] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [folderInput, setFolderInput] = useState("");
  const [tab, setTab] = useState("explorar");
  const [exploreMode, setExploreMode] = useState("compras");
  const [activeRoutineId, setActiveRoutineId] = useState(ROUTINES[0].id);
  const {
    reminders,
    setReminder
  } = useReminders((id) => ROUTINES.flatMap((r) => r.tasks).find((t) => t.id === id)?.label ?? "Tarefa");
  const startNewList = (niche) => {
    const list = {
      id: uid(),
      nicheId: niche.id,
      name: `Lista ${niche.name}`,
      folder: folders[0] ?? "Geral",
      items: niche.defaultItems.map((n) => ({
        id: uid(),
        name: n,
        checked: false
      })),
      createdAt: Date.now()
    };
    setEditor(list);
  };
  const openExisting = (l) => setEditor({
    ...l
  });
  const handleSave = () => {
    if (!editor) return;
    saveList(editor);
    toast.success("Lista salva", {
      description: editor.name
    });
    setEditor(null);
  };
  const toggleItem = (id) => {
    if (!editor) return;
    setEditor({
      ...editor,
      items: editor.items.map((i) => i.id === id ? {
        ...i,
        checked: !i.checked
      } : i)
    });
  };
  const removeItem = (id) => {
    if (!editor) return;
    setEditor({
      ...editor,
      items: editor.items.filter((i) => i.id !== id)
    });
  };
  const addItem = () => {
    if (!editor || !newItem.trim()) return;
    setEditor({
      ...editor,
      items: [...editor.items, {
        id: uid(),
        name: newItem.trim(),
        checked: false
      }]
    });
    setNewItem("");
  };
  const editorNiche = useMemo(() => editor ? NICHES.find((n) => n.id === editor.nicheId) ?? NICHES[0] : NICHES[0], [editor]);
  const listsByFolder = useMemo(() => {
    const map = {};
    folders.forEach((f) => map[f] = []);
    lists.forEach((l) => {
      if (!map[l.folder]) map[l.folder] = [];
      map[l.folder].push(l);
    });
    return map;
  }, [lists, folders]);
  const activeRoutine = ROUTINES.find((r) => r.id === activeRoutineId) ?? ROUTINES[0];
  const rank = rankFromXp(checklistState.xp);
  const tasksDoneToday = activeRoutine.tasks.filter((t) => checklistState.completedToday[t.id]).length;
  const dayProgress = tasksDoneToday / activeRoutine.tasks.length * 100;
  const handleToggleTask = (taskId, xp) => {
    const wasDone = !!checklistState.completedToday[taskId];
    toggleTask(taskId, xp);
    if (!wasDone) toast.success(`+${xp} XP`, {
      description: "Tarefa concluída! 🎉"
    });
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    minHeight: "100vh",
    background: BRAND.bg,
    color: BRAND.text,
    fontFamily: "'Segoe UI', system-ui, sans-serif"
  }, children: [
    /* @__PURE__ */ jsx(Toaster, { position: "top-center", richColors: true }),
    /* @__PURE__ */ jsxs("header", { style: {
      background: headerGradient,
      borderBottom: `1px solid ${BRAND.bgLight}`,
      position: "sticky",
      top: 0,
      zIndex: 50
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        maxWidth: 720,
        margin: "0 auto",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: 48,
          height: 48,
          borderRadius: 14,
          overflow: "hidden",
          background: BRAND.bgLight,
          flexShrink: 0,
          border: `1px solid ${BRAND.bgLight}`
        }, children: /* @__PURE__ */ jsx("img", { src: profileLogo, alt: "Planner For You", style: {
          width: "100%",
          height: "100%",
          objectFit: "contain",
          padding: 2
        } }) }),
        /* @__PURE__ */ jsxs("div", { style: {
          flex: 1
        }, children: [
          /* @__PURE__ */ jsxs("h1", { style: {
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "-0.3px",
            lineHeight: 1.2
          }, children: [
            /* @__PURE__ */ jsx("span", { style: {
              color: BRAND.white
            }, children: "Planner " }),
            /* @__PURE__ */ jsx("span", { style: {
              color: BRAND.accent
            }, children: "For You" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: {
            margin: 0,
            fontSize: 11,
            color: BRAND.textMuted,
            marginTop: 1
          }, children: "Listas e rotinas inteligentes" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setFeedbackOpen(true), style: {
          background: BRAND.bgLight,
          border: `1px solid ${BRAND.bgLight}`,
          borderRadius: 10,
          padding: "8px 12px",
          color: BRAND.text,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6
        }, children: [
          /* @__PURE__ */ jsx(Lightbulb, { size: 14, color: BRAND.gold }),
          /* @__PURE__ */ jsx("span", { style: {
            display: "none"
          }, className: "sm:inline", children: "Sugestões" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 16px 12px",
        display: "flex",
        gap: 8
      }, children: [{
        value: "explorar",
        label: "Explorar",
        icon: /* @__PURE__ */ jsx(Sparkles, { size: 14 })
      }, {
        value: "minhas",
        label: "Minhas listas",
        icon: /* @__PURE__ */ jsx(Folder, { size: 14 }),
        badge: lists.length > 0 ? lists.length : null
      }].map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t.value), style: {
        flex: 1,
        padding: "9px 0",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "all 0.2s",
        background: tab === t.value ? BRAND.accent : BRAND.bgLight,
        color: tab === t.value ? BRAND.bg : BRAND.textMuted
      }, children: [
        t.icon,
        " ",
        t.label,
        t.badge && /* @__PURE__ */ jsx("span", { style: {
          background: BRAND.bg,
          color: BRAND.accent,
          borderRadius: 20,
          padding: "1px 7px",
          fontSize: 11,
          fontWeight: 800
        }, children: t.badge })
      ] }, t.value)) })
    ] }),
    /* @__PURE__ */ jsxs("main", { style: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "16px 16px 32px"
    }, children: [
      tab === "explorar" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 16,
          scrollbarWidth: "none"
        }, children: [{
          mode: "compras",
          label: "Compras",
          icon: /* @__PURE__ */ jsx(ShoppingBag, { size: 14 }),
          color: BRAND.accent
        }, {
          mode: "checklist",
          label: "Checklist",
          icon: /* @__PURE__ */ jsx(ListChecks, { size: 14 }),
          color: "#f59e0b"
        }, {
          mode: "contas",
          label: "Contas",
          icon: /* @__PURE__ */ jsx(Wallet, { size: 14 }),
          color: "#10b981"
        }, {
          mode: "ia",
          label: "IA",
          icon: /* @__PURE__ */ jsx(Bot, { size: 14 }),
          color: "#a78bfa"
        }].map((m) => /* @__PURE__ */ jsxs("button", { onClick: () => setExploreMode(m.mode), style: {
          flexShrink: 0,
          padding: "9px 16px",
          borderRadius: 24,
          border: exploreMode === m.mode ? "none" : `1.5px solid ${BRAND.bgLight}`,
          background: exploreMode === m.mode ? m.color : BRAND.bgMid,
          color: exploreMode === m.mode ? BRAND.bg : BRAND.textMuted,
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s"
        }, children: [
          m.icon,
          " ",
          m.label
        ] }, m.mode)) }),
        /* @__PURE__ */ jsxs("p", { style: {
          fontSize: 13,
          color: BRAND.textMuted,
          marginBottom: 16,
          marginTop: 0
        }, children: [
          exploreMode === "compras" && "Escolha um estilo e crie sua lista em segundos",
          exploreMode === "checklist" && "Cumpra rotinas, ganhe XP e suba de rank 🏆",
          exploreMode === "contas" && "Gerencie suas contas, alarmes e vencimentos 💸",
          exploreMode === "ia" && "Desenvolva projetos com inteligência artificial 🤖"
        ] }),
        exploreMode === "ia" && /* @__PURE__ */ jsx(ProjectWithAI, {}),
        exploreMode === "contas" && /* @__PURE__ */ jsx(BillsControl, {}),
        exploreMode === "compras" && /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 16,
            scrollbarWidth: "none"
          }, children: NICHES.map((n) => {
            const active = activeNiche.id === n.id;
            return /* @__PURE__ */ jsxs("button", { onClick: () => setActiveNiche(n), style: {
              flexShrink: 0,
              borderRadius: 20,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              border: active ? "none" : `1.5px solid ${BRAND.bgLight}`,
              background: active ? accentGradient : BRAND.bgMid,
              color: active ? BRAND.bg : BRAND.textMuted
            }, children: [
              /* @__PURE__ */ jsx("span", { style: {
                marginRight: 4
              }, children: n.emoji }),
              n.name
            ] }, n.id);
          }) }),
          /* @__PURE__ */ jsx("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12
          }, children: NICHES.map((n) => {
            const Icon = n.icon;
            return /* @__PURE__ */ jsxs("div", { onClick: () => startNewList(n), style: {
              background: BRAND.bgMid,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${BRAND.bgLight}`,
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s"
            }, onMouseEnter: (e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.4)`;
            }, onMouseLeave: (e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }, children: [
              /* @__PURE__ */ jsxs("div", { style: {
                padding: "14px 14px 10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }, children: [
                /* @__PURE__ */ jsx("div", { style: {
                  background: BRAND.bgLight,
                  borderRadius: 10,
                  padding: 8
                }, children: /* @__PURE__ */ jsx(Icon, { size: 16, color: BRAND.accent }) }),
                /* @__PURE__ */ jsx("span", { style: {
                  fontSize: 24
                }, children: n.emoji })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: {
                padding: "0 14px 14px"
              }, children: [
                /* @__PURE__ */ jsx("div", { style: {
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 2,
                  color: BRAND.text
                }, children: n.name }),
                /* @__PURE__ */ jsx("div", { style: {
                  fontSize: 11,
                  color: BRAND.textMuted,
                  marginBottom: 10
                }, children: n.description }),
                /* @__PURE__ */ jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }, children: [
                  /* @__PURE__ */ jsxs("span", { style: {
                    fontSize: 11,
                    color: BRAND.textMuted
                  }, children: [
                    n.defaultItems.length,
                    " itens"
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: {
                    background: accentGradient,
                    color: BRAND.bg,
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 12,
                    fontWeight: 700
                  }, children: "+ Criar" })
                ] })
              ] })
            ] }, n.id);
          }) })
        ] }),
        exploreMode === "checklist" && /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 16
          }, children: [{
            icon: /* @__PURE__ */ jsx(Trophy, { size: 14 }),
            label: "Rank",
            value: `${rank.current.emoji} ${rank.current.name}`,
            color: BRAND.gold
          }, {
            icon: /* @__PURE__ */ jsx(Zap, { size: 14 }),
            label: "XP Total",
            value: checklistState.xp,
            color: BRAND.accent
          }, {
            icon: /* @__PURE__ */ jsx(Flame, { size: 14 }),
            label: "Streak",
            value: `${checklistState.streak} 🔥`,
            color: BRAND.rose
          }].map((stat) => /* @__PURE__ */ jsxs("div", { style: {
            background: BRAND.bgMid,
            border: `1px solid ${BRAND.bgLight}`,
            borderRadius: 14,
            padding: "12px 10px"
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: BRAND.textMuted,
              marginBottom: 4
            }, children: [
              /* @__PURE__ */ jsx("span", { style: {
                color: stat.color
              }, children: stat.icon }),
              " ",
              stat.label
            ] }),
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: 18,
              fontWeight: 800,
              color: BRAND.text
            }, children: stat.value })
          ] }, stat.label)) }),
          /* @__PURE__ */ jsx("div", { style: {
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 12,
            scrollbarWidth: "none"
          }, children: ROUTINES.map((r) => {
            const active = activeRoutineId === r.id;
            return /* @__PURE__ */ jsxs("button", { onClick: () => setActiveRoutineId(r.id), style: {
              flexShrink: 0,
              borderRadius: 20,
              padding: "7px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              border: active ? "none" : `1.5px solid ${BRAND.bgLight}`,
              background: active ? "#f59e0b" : BRAND.bgMid,
              color: active ? BRAND.bg : BRAND.textMuted
            }, children: [
              r.emoji,
              " ",
              r.name
            ] }, r.id);
          }) }),
          /* @__PURE__ */ jsxs("div", { style: {
            background: BRAND.bgMid,
            borderRadius: 16,
            border: `1px solid ${BRAND.bgLight}`,
            overflow: "hidden",
            marginBottom: 20
          }, children: [
            /* @__PURE__ */ jsxs("div", { style: {
              padding: "16px",
              borderBottom: `1px solid ${BRAND.bgLight}`
            }, children: [
              /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }, children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }, children: [
                    /* @__PURE__ */ jsx("span", { style: {
                      fontSize: 24
                    }, children: activeRoutine.emoji }),
                    /* @__PURE__ */ jsx("span", { style: {
                      fontWeight: 800,
                      fontSize: 16
                    }, children: activeRoutine.name })
                  ] }),
                  /* @__PURE__ */ jsx("p", { style: {
                    margin: "2px 0 0",
                    fontSize: 12,
                    color: BRAND.textMuted
                  }, children: activeRoutine.description })
                ] }),
                /* @__PURE__ */ jsxs("div", { style: {
                  textAlign: "right"
                }, children: [
                  /* @__PURE__ */ jsx("div", { style: {
                    fontSize: 11,
                    color: BRAND.textMuted
                  }, children: "Hoje" }),
                  /* @__PURE__ */ jsxs("div", { style: {
                    fontSize: 22,
                    fontWeight: 800,
                    color: BRAND.accent
                  }, children: [
                    tasksDoneToday,
                    "/",
                    activeRoutine.tasks.length
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { style: {
                marginTop: 10,
                height: 6,
                background: BRAND.bgLight,
                borderRadius: 99,
                overflow: "hidden"
              }, children: /* @__PURE__ */ jsx("div", { style: {
                height: "100%",
                width: `${dayProgress}%`,
                background: accentGradient,
                borderRadius: 99,
                transition: "width 0.4s"
              } }) })
            ] }),
            /* @__PURE__ */ jsx("div", { style: {
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }, children: activeRoutine.tasks.map((task) => {
              const done = !!checklistState.completedToday[task.id];
              const reminder = reminders[task.id] || "";
              return /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 12,
                padding: "10px 12px",
                background: done ? "rgba(45,212,191,0.08)" : BRAND.bg,
                border: `1.5px solid ${done ? BRAND.accent : BRAND.bgLight}`,
                transition: "all 0.2s"
              }, children: [
                /* @__PURE__ */ jsx("button", { onClick: () => handleToggleTask(task.id, task.xp), style: {
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  background: done ? BRAND.accent : BRAND.bgLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }, children: done ? /* @__PURE__ */ jsx(CheckCircle2, { size: 16, color: BRAND.bg }) : /* @__PURE__ */ jsx("span", { style: {
                  fontSize: 16
                }, children: task.emoji }) }),
                /* @__PURE__ */ jsx("span", { style: {
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: done ? BRAND.textMuted : BRAND.text,
                  textDecoration: done ? "line-through" : "none"
                }, children: task.label }),
                /* @__PURE__ */ jsxs("label", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: reminder ? BRAND.accent : BRAND.textMuted,
                  cursor: "pointer"
                }, children: [
                  /* @__PURE__ */ jsx(Bell, { size: 12 }),
                  /* @__PURE__ */ jsx("input", { type: "time", value: reminder, onChange: (e) => setReminder(task.id, e.target.value), style: {
                    background: "transparent",
                    border: "none",
                    color: reminder ? BRAND.accent : BRAND.textMuted,
                    fontSize: 11,
                    outline: "none",
                    width: 66
                  } })
                ] }),
                /* @__PURE__ */ jsxs("span", { style: {
                  background: done ? BRAND.accent : BRAND.gold,
                  color: BRAND.bg,
                  borderRadius: 8,
                  padding: "3px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0
                }, children: [
                  "+",
                  task.xp,
                  "XP"
                ] })
              ] }, task.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            marginBottom: 20
          }, children: [
            /* @__PURE__ */ jsxs("h3", { style: {
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6
            }, children: [
              /* @__PURE__ */ jsx(Gift, { size: 16, color: BRAND.rose }),
              " Recompensas"
            ] }),
            /* @__PURE__ */ jsx("div", { style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 10
            }, children: REWARDS.map((rw) => {
              const unlocked = checklistState.xp >= rw.xp;
              return /* @__PURE__ */ jsxs("div", { style: {
                background: BRAND.bgMid,
                border: `1px solid ${unlocked ? BRAND.accent : BRAND.bgLight}`,
                borderRadius: 14,
                padding: 12,
                opacity: unlocked ? 1 : 0.6
              }, children: [
                /* @__PURE__ */ jsxs("div", { style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }, children: [
                  /* @__PURE__ */ jsx("span", { style: {
                    fontSize: 26
                  }, children: rw.emoji }),
                  /* @__PURE__ */ jsx("span", { style: {
                    background: unlocked ? BRAND.accent : BRAND.bgLight,
                    color: unlocked ? BRAND.bg : BRAND.textMuted,
                    borderRadius: 8,
                    padding: "3px 8px",
                    fontSize: 10,
                    fontWeight: 700
                  }, children: unlocked ? "✓ Desbloqueado" : `${rw.xp} XP` })
                ] }),
                /* @__PURE__ */ jsx("p", { style: {
                  margin: "8px 0 0",
                  fontSize: 13,
                  fontWeight: 600
                }, children: rw.label }),
                !unlocked && /* @__PURE__ */ jsxs("p", { style: {
                  margin: "2px 0 0",
                  fontSize: 11,
                  color: BRAND.textMuted
                }, children: [
                  "Faltam ",
                  rw.xp - checklistState.xp,
                  " XP"
                ] })
              ] }, rw.label);
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { style: {
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6
            }, children: [
              /* @__PURE__ */ jsx(Trophy, { size: 16, color: BRAND.gold }),
              " Ranks"
            ] }),
            /* @__PURE__ */ jsx("div", { style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 8
            }, children: RANKS.map((r) => {
              const reached = checklistState.xp >= r.min;
              return /* @__PURE__ */ jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 20,
                padding: "6px 12px",
                fontSize: 13,
                border: `1.5px solid ${reached ? BRAND.accent : BRAND.bgLight}`,
                background: reached ? "rgba(45,212,191,0.08)" : BRAND.bgMid,
                opacity: reached ? 1 : 0.5
              }, children: [
                /* @__PURE__ */ jsx("span", { children: r.emoji }),
                /* @__PURE__ */ jsx("span", { style: {
                  fontWeight: 600
                }, children: r.name }),
                /* @__PURE__ */ jsxs("span", { style: {
                  fontSize: 11,
                  color: BRAND.textMuted
                }, children: [
                  r.min,
                  " XP"
                ] })
              ] }, r.name);
            }) })
          ] })
        ] })
      ] }),
      tab === "minhas" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          gap: 8,
          marginBottom: 16
        }, children: [
          /* @__PURE__ */ jsx("input", { placeholder: "Nova pasta…", value: folderInput, onChange: (e) => setFolderInput(e.target.value), style: {
            flex: 1,
            background: BRAND.bgMid,
            border: `1.5px solid ${BRAND.bgLight}`,
            borderRadius: 10,
            padding: "9px 14px",
            color: BRAND.text,
            fontSize: 14,
            outline: "none"
          } }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            addFolder(folderInput);
            setFolderInput("");
            toast.success("Pasta criada");
          }, style: {
            background: BRAND.bgLight,
            border: "none",
            borderRadius: 10,
            padding: "9px 14px",
            color: BRAND.text,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6
          }, children: [
            /* @__PURE__ */ jsx(FolderPlus, { size: 15 }),
            " Pasta"
          ] })
        ] }),
        lists.length === 0 ? /* @__PURE__ */ jsxs("div", { style: {
          textAlign: "center",
          padding: "48px 16px",
          background: BRAND.bgMid,
          borderRadius: 16,
          border: `1px solid ${BRAND.bgLight}`
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 40,
            marginBottom: 12
          }, children: "📋" }),
          /* @__PURE__ */ jsx("h3", { style: {
            fontSize: 16,
            fontWeight: 700,
            margin: "0 0 6px"
          }, children: "Nenhuma lista ainda" }),
          /* @__PURE__ */ jsx("p", { style: {
            fontSize: 13,
            color: BRAND.textMuted,
            margin: "0 0 16px"
          }, children: "Vá em Explorar e crie sua primeira lista 🎉" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setTab("explorar"), style: {
            background: accentGradient,
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            color: BRAND.bg,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer"
          }, children: "Explorar nichos" })
        ] }) : /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          flexDirection: "column",
          gap: 24
        }, children: folders.map((folder) => {
          const items = listsByFolder[folder] ?? [];
          if (items.length === 0) return null;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h3", { style: {
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: BRAND.textMuted,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6
            }, children: [
              /* @__PURE__ */ jsx(Folder, { size: 13 }),
              " ",
              folder,
              " ",
              /* @__PURE__ */ jsxs("span", { style: {
                fontWeight: 400
              }, children: [
                "(",
                items.length,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 10
            }, children: items.map((l) => {
              const niche = NICHES.find((n) => n.id === l.nicheId) ?? NICHES[0];
              const done = l.items.filter((i) => i.checked).length;
              const pct = l.items.length ? done / l.items.length * 100 : 0;
              return /* @__PURE__ */ jsxs("div", { onClick: () => openExisting(l), style: {
                background: BRAND.bgMid,
                border: `1px solid ${BRAND.bgLight}`,
                borderRadius: 14,
                padding: 14,
                cursor: "pointer"
              }, children: [
                /* @__PURE__ */ jsxs("div", { style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }, children: [
                  /* @__PURE__ */ jsx("span", { style: {
                    fontSize: 24
                  }, children: niche.emoji }),
                  /* @__PURE__ */ jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    deleteList(l.id);
                    toast("Lista removida");
                  }, style: {
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    color: BRAND.textMuted
                  }, children: /* @__PURE__ */ jsx(Trash2, { size: 14 }) })
                ] }),
                /* @__PURE__ */ jsx("div", { style: {
                  fontWeight: 700,
                  fontSize: 14,
                  marginTop: 6
                }, children: l.name }),
                /* @__PURE__ */ jsxs("div", { style: {
                  fontSize: 11,
                  color: BRAND.textMuted,
                  margin: "2px 0 8px"
                }, children: [
                  done,
                  "/",
                  l.items.length,
                  " concluídos"
                ] }),
                /* @__PURE__ */ jsx("div", { style: {
                  height: 4,
                  background: BRAND.bgLight,
                  borderRadius: 99,
                  overflow: "hidden"
                }, children: /* @__PURE__ */ jsx("div", { style: {
                  height: "100%",
                  width: `${pct}%`,
                  background: accentGradient,
                  borderRadius: 99
                } }) })
              ] }, l.id);
            }) })
          ] }, folder);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!editor, onOpenChange: (o) => !o && setEditor(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-lg", style: {
      background: BRAND.bgMid,
      border: `1px solid ${BRAND.bgLight}`,
      color: BRAND.text
    }, children: editor && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: BRAND.text
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 22
        }, children: editorNiche.emoji }),
        /* @__PURE__ */ jsx(Input, { value: editor.name, onChange: (e) => setEditor({
          ...editor,
          name: e.target.value
        }), style: {
          background: BRAND.bg,
          border: `1px solid ${BRAND.bgLight}`,
          color: BRAND.text
        } })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 12,
          color: BRAND.textMuted
        }, children: "Pasta:" }),
        /* @__PURE__ */ jsxs(Select, { value: editor.folder, onValueChange: (v) => setEditor({
          ...editor,
          folder: v
        }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { style: {
            background: BRAND.bg,
            border: `1px solid ${BRAND.bgLight}`,
            color: BRAND.text,
            height: 32,
            width: 140
          }, children: /* @__PURE__ */ jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsx(SelectContent, { style: {
            background: BRAND.bgMid,
            border: `1px solid ${BRAND.bgLight}`,
            color: BRAND.text
          }, children: folders.map((f) => /* @__PURE__ */ jsx(SelectItem, { value: f, children: f }, f)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }, children: editorNiche.actions.map((a) => /* @__PURE__ */ jsxs("button", { onClick: () => toast(`${a.emoji} ${a.label}`, {
        description: "Ação em breve"
      }), style: {
        background: BRAND.bgLight,
        border: "none",
        borderRadius: 20,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
        color: BRAND.text,
        cursor: "pointer"
      }, children: [
        a.emoji,
        " ",
        a.label
      ] }, a.label)) }),
      /* @__PURE__ */ jsxs("div", { style: {
        maxHeight: 260,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        scrollbarWidth: "none"
      }, children: [
        editor.items.map((item) => /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: BRAND.bg,
          border: `1px solid ${BRAND.bgLight}`,
          borderRadius: 10,
          padding: "8px 12px"
        }, children: [
          /* @__PURE__ */ jsx(Checkbox, { checked: item.checked, onCheckedChange: () => toggleItem(item.id) }),
          /* @__PURE__ */ jsx("span", { style: {
            flex: 1,
            fontSize: 14,
            color: item.checked ? BRAND.textMuted : BRAND.text,
            textDecoration: item.checked ? "line-through" : "none"
          }, children: item.name }),
          /* @__PURE__ */ jsx("button", { onClick: () => removeItem(item.id), style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            color: BRAND.textMuted,
            padding: 2
          }, children: /* @__PURE__ */ jsx(X, { size: 14 }) })
        ] }, item.id)),
        editor.items.length === 0 && /* @__PURE__ */ jsx("p", { style: {
          textAlign: "center",
          color: BRAND.textMuted,
          padding: "24px 0",
          fontSize: 13
        }, children: "Nenhum item — adicione abaixo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: 8
      }, children: [
        /* @__PURE__ */ jsx(Input, { placeholder: "Adicionar item…", value: newItem, onChange: (e) => setNewItem(e.target.value), onKeyDown: (e) => e.key === "Enter" && addItem(), style: {
          background: BRAND.bg,
          border: `1px solid ${BRAND.bgLight}`,
          color: BRAND.text
        } }),
        /* @__PURE__ */ jsx(Button, { onClick: addItem, variant: "secondary", children: /* @__PURE__ */ jsx(Plus, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setEditor(null), style: {
          borderColor: BRAND.bgLight,
          color: BRAND.textMuted
        }, children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleSave, style: {
          background: accentGradient,
          color: BRAND.bg,
          fontWeight: 700,
          border: "none"
        }, children: [
          /* @__PURE__ */ jsx(Save, { size: 14, style: {
            marginRight: 6
          } }),
          " Salvar"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: feedbackOpen, onOpenChange: setFeedbackOpen, children: /* @__PURE__ */ jsxs(DialogContent, { style: {
      background: BRAND.bgMid,
      border: `1px solid ${BRAND.bgLight}`,
      color: BRAND.text
    }, children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: BRAND.text
      }, children: [
        /* @__PURE__ */ jsx(Lightbulb, { size: 18, color: BRAND.gold }),
        " Sugestões de melhoria"
      ] }) }),
      /* @__PURE__ */ jsx(Textarea, { placeholder: "Conte o que podemos melhorar…", value: feedback, onChange: (e) => setFeedback(e.target.value), rows: 5, style: {
        background: BRAND.bg,
        border: `1px solid ${BRAND.bgLight}`,
        color: BRAND.text,
        resize: "none"
      } }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setFeedbackOpen(false), style: {
          borderColor: BRAND.bgLight,
          color: BRAND.textMuted
        }, children: "Fechar" }),
        /* @__PURE__ */ jsx(Button, { onClick: () => {
          if (!feedback.trim()) return;
          toast.success("Obrigado pela sugestão! 💚");
          setFeedback("");
          setFeedbackOpen(false);
        }, style: {
          background: accentGradient,
          color: BRAND.bg,
          fontWeight: 700,
          border: "none"
        }, children: "Enviar" })
      ] })
    ] }) })
  ] });
}
export {
  Index as component
};
