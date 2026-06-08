import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NICHES, type ListNiche } from "@/lib/lists-data";
import { ROUTINES, RANKS, REWARDS, rankFromXp } from "@/lib/routines-data";
import { useLists, type SavedList } from "@/hooks/use-lists";
import { useChecklist } from "@/hooks/use-checklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast, Toaster } from "sonner";
import {
  Plus, Trash2, FolderPlus, Sparkles, Save, Lightbulb, Folder, X,
  ListChecks, Flame, Trophy, Gift, Zap, CheckCircle2, Bell, Wallet, Bot, Gamepad2, ShoppingBag,
} from "lucide-react";
import profileLogo from "@/assets/profile-logo.png";
import { useReminders } from "@/hooks/use-reminders";
import BillsControl from "@/components/BillsControl";
import ProjectWithAI from "@/components/ProjectWithAI";
import GamerOrbit from "@/components/GamerOrbit";
import ProductsSales from "@/components/ProductsSales";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Planner For You — Listas e rotinas inteligentes" },
      { name: "description", content: "Listas de compras por nicho e checklists de rotina com rank, XP e recompensas. Planeje sua vida em segundos." },
    ],
  }),
  component: Index,
});

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const BRAND = {
  bg: "#0f1e2a",           // fundo escuro principal
  bgMid: "#162535",        // fundo cards/seções
  bgLight: "#1d3045",      // bordas e separadores
  accent: "#2dd4bf",       // teal vibrante — cor de destaque
  accentDim: "#0d9488",    // versão mais escura do accent
  gold: "#f59e0b",         // dourado XP/rank
  rose: "#f43f5e",         // streak/vermelho
  text: "#e2f0f9",         // texto principal
  textMuted: "#7a9db8",    // texto secundário
  white: "#ffffff",
};

const headerGradient = `linear-gradient(135deg, #0f1e2a 0%, #162535 50%, #1a3a4a 100%)`;
const accentGradient = `linear-gradient(135deg, ${BRAND.accent} 0%, #3b82f6 100%)`;

// ─── Componente principal ─────────────────────────────────────────────────────
function Index() {
  const { lists, folders, saveList, deleteList, addFolder } = useLists();
  const { state: checklistState, toggleTask } = useChecklist();
  const [activeNiche, setActiveNiche] = useState<ListNiche>(NICHES[0]);
  const [editor, setEditor] = useState<SavedList | null>(null);
  const [newItem, setNewItem] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [folderInput, setFolderInput] = useState("");
  const [tab, setTab] = useState("explorar");
  const [exploreMode, setExploreMode] = useState<"checklist" | "contas" | "gamer" | "ia">("checklist");
  const [activeRoutineId, setActiveRoutineId] = useState<string>(ROUTINES[0].id);
  const { reminders, setReminder } = useReminders((id) =>
    ROUTINES.flatMap((r) => r.tasks).find((t) => t.id === id)?.label ?? "Tarefa"
  );

  const startNewList = (niche: ListNiche) => {
    const list: SavedList = {
      id: uid(),
      nicheId: niche.id,
      name: `Lista ${niche.name}`,
      folder: folders[0] ?? "Geral",
      items: niche.defaultItems.map((n) => ({ id: uid(), name: n, checked: false })),
      createdAt: Date.now(),
    };
    setEditor(list);
  };

  const openExisting = (l: SavedList) => setEditor({ ...l });

  const handleSave = () => {
    if (!editor) return;
    saveList(editor);
    toast.success("Lista salva", { description: editor.name });
    setEditor(null);
  };

  const toggleItem = (id: string) => {
    if (!editor) return;
    setEditor({ ...editor, items: editor.items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)) });
  };
  const removeItem = (id: string) => {
    if (!editor) return;
    setEditor({ ...editor, items: editor.items.filter((i) => i.id !== id) });
  };
  const addItem = () => {
    if (!editor || !newItem.trim()) return;
    setEditor({ ...editor, items: [...editor.items, { id: uid(), name: newItem.trim(), checked: false }] });
    setNewItem("");
  };

  const editorNiche = useMemo(
    () => (editor ? NICHES.find((n) => n.id === editor.nicheId) ?? NICHES[0] : NICHES[0]),
    [editor],
  );

  const listsByFolder = useMemo(() => {
    const map: Record<string, SavedList[]> = {};
    folders.forEach((f) => (map[f] = []));
    lists.forEach((l) => {
      if (!map[l.folder]) map[l.folder] = [];
      map[l.folder].push(l);
    });
    return map;
  }, [lists, folders]);

  const activeRoutine = ROUTINES.find((r) => r.id === activeRoutineId) ?? ROUTINES[0];
  const rank = rankFromXp(checklistState.xp);
  const tasksDoneToday = activeRoutine.tasks.filter((t) => checklistState.completedToday[t.id]).length;
  const dayProgress = (tasksDoneToday / activeRoutine.tasks.length) * 100;

  const handleToggleTask = (taskId: string, xp: number) => {
    const wasDone = !!checklistState.completedToday[taskId];
    toggleTask(taskId, xp);
    if (!wasDone) toast.success(`+${xp} XP`, { description: "Tarefa concluída! 🎉" });
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: BRAND.bg, color: BRAND.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Toaster position="top-center" richColors />

      {/* ── HEADER ── */}
      <header style={{ background: headerGradient, borderBottom: `1px solid ${BRAND.bgLight}`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          {/* Logo */}
          <div style={{ width: 48, height: 48, borderRadius: 14, overflow: "hidden", background: BRAND.bgLight, flexShrink: 0, border: `1px solid ${BRAND.bgLight}` }}>
            <img src={profileLogo} alt="Planner For You" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }} />
          </div>

          {/* Title */}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              <span style={{ color: BRAND.white }}>Planner </span>
              <span style={{ color: BRAND.accent }}>For You</span>
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: BRAND.textMuted, marginTop: 1 }}>Listas e rotinas inteligentes</p>
          </div>

          {/* Suggestions button */}
          <button
            onClick={() => setFeedbackOpen(true)}
            style={{
              background: BRAND.bgLight, border: `1px solid ${BRAND.bgLight}`, borderRadius: 10,
              padding: "8px 12px", color: BRAND.text, fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Lightbulb size={14} color={BRAND.gold} />
            <span style={{ display: "none" }} className="sm:inline">Sugestões</span>
          </button>
        </div>

        {/* ── TABS: Explorar / Minhas listas ── */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 12px", display: "flex", gap: 8 }}>
          {[
            { value: "explorar", label: "Explorar", icon: <Sparkles size={14} /> },
            { value: "minhas", label: "Minhas listas", icon: <Folder size={14} />, badge: lists.length > 0 ? lists.length : null },
            { value: "produtos", label: "Produtos", icon: <ShoppingBag size={14} /> },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer",
                fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.2s",
                background: tab === t.value ? BRAND.accent : BRAND.bgLight,
                color: tab === t.value ? BRAND.bg : BRAND.textMuted,
              }}
            >
              {t.icon} {t.label}
              {t.badge && (
                <span style={{ background: BRAND.bg, color: BRAND.accent, borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 800 }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "16px 16px 32px" }}>

        {/* ════════════ EXPLORAR ════════════ */}
        {tab === "explorar" && (
          <>
            {/* Mode switcher */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16, scrollbarWidth: "none" }}>
              {[
                { mode: "checklist", label: "Checklist", icon: <ListChecks size={14} />, color: "#f59e0b" },
                { mode: "contas", label: "Controle de Contas", icon: <Wallet size={14} />, color: "#10b981" },
                { mode: "gamer", label: "🎮 Órbita Gamer", icon: <Gamepad2 size={14} />, color: "#39ff14" },
                { mode: "ia", label: "IA", icon: <Bot size={14} />, color: "#a78bfa" },
              ].map((m) => (
                <button
                  key={m.mode}
                  onClick={() => setExploreMode(m.mode as typeof exploreMode)}
                  style={{
                    flexShrink: 0, padding: "9px 16px", borderRadius: 24,
                    border: exploreMode === m.mode ? "none" : `1.5px solid ${BRAND.bgLight}`,
                    background: exploreMode === m.mode ? m.color : BRAND.bgMid,
                    color: exploreMode === m.mode ? BRAND.bg : BRAND.textMuted,
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Subtitle */}
            <p style={{ fontSize: 13, color: BRAND.textMuted, marginBottom: 16, marginTop: 0 }}>
              {exploreMode === "checklist" && "Cumpra rotinas, ganhe XP e suba de rank 🏆"}
              {exploreMode === "contas" && "Gerencie suas contas, alarmes e vencimentos 💸"}
              {exploreMode === "gamer" && "Seu mundo gamer Xbox & Mobile em tempo real 🎮"}
              {exploreMode === "ia" && "Desenvolva projetos com inteligência artificial 🤖"}
            </p>

            {/* ── IA ── */}
            {exploreMode === "ia" && <ProjectWithAI />}

            {/* ── CONTAS ── */}
            {exploreMode === "contas" && <BillsControl />}

            {/* ── GAMER ── */}
            {exploreMode === "gamer" && <GamerOrbit />}


            {/* ── CHECKLIST ── */}
            {exploreMode === "checklist" && (
              <section>
                {/* XP dashboard */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { icon: <Trophy size={14} />, label: "Rank", value: `${rank.current.emoji} ${rank.current.name}`, color: BRAND.gold },
                    { icon: <Zap size={14} />, label: "XP Total", value: checklistState.xp, color: BRAND.accent },
                    { icon: <Flame size={14} />, label: "Streak", value: `${checklistState.streak} 🔥`, color: BRAND.rose },
                  ].map((stat) => (
                    <div key={stat.label} style={{ background: BRAND.bgMid, border: `1px solid ${BRAND.bgLight}`, borderRadius: 14, padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: BRAND.textMuted, marginBottom: 4 }}>
                        <span style={{ color: stat.color }}>{stat.icon}</span> {stat.label}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: BRAND.text }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Routine selector */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 12, scrollbarWidth: "none" }}>
                  {ROUTINES.map((r) => {
                    const active = activeRoutineId === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setActiveRoutineId(r.id)}
                        style={{
                          flexShrink: 0, borderRadius: 20, padding: "7px 14px", fontSize: 13, fontWeight: 600,
                          cursor: "pointer", transition: "all 0.15s",
                          border: active ? "none" : `1.5px solid ${BRAND.bgLight}`,
                          background: active ? "#f59e0b" : BRAND.bgMid,
                          color: active ? BRAND.bg : BRAND.textMuted,
                        }}
                      >
                        {r.emoji} {r.name}
                      </button>
                    );
                  })}
                </div>

                {/* Active routine */}
                <div style={{ background: BRAND.bgMid, borderRadius: 16, border: `1px solid ${BRAND.bgLight}`, overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ padding: "16px", borderBottom: `1px solid ${BRAND.bgLight}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 24 }}>{activeRoutine.emoji}</span>
                          <span style={{ fontWeight: 800, fontSize: 16 }}>{activeRoutine.name}</span>
                        </div>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: BRAND.textMuted }}>{activeRoutine.description}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: BRAND.textMuted }}>Hoje</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.accent }}>{tasksDoneToday}/{activeRoutine.tasks.length}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, height: 6, background: BRAND.bgLight, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${dayProgress}%`, background: accentGradient, borderRadius: 99, transition: "width 0.4s" }} />
                    </div>
                  </div>

                  <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {activeRoutine.tasks.map((task) => {
                      const done = !!checklistState.completedToday[task.id];
                      const reminder = reminders[task.id] || "";
                      return (
                        <div
                          key={task.id}
                          style={{
                            display: "flex", alignItems: "center", gap: 10, borderRadius: 12, padding: "10px 12px",
                            background: done ? "rgba(45,212,191,0.08)" : BRAND.bg,
                            border: `1.5px solid ${done ? BRAND.accent : BRAND.bgLight}`,
                            transition: "all 0.2s",
                          }}
                        >
                          <button
                            onClick={() => handleToggleTask(task.id, task.xp)}
                            style={{
                              width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0,
                              background: done ? BRAND.accent : BRAND.bgLight,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            {done ? <CheckCircle2 size={16} color={BRAND.bg} /> : <span style={{ fontSize: 16 }}>{task.emoji}</span>}
                          </button>
                          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: done ? BRAND.textMuted : BRAND.text, textDecoration: done ? "line-through" : "none" }}>
                            {task.label}
                          </span>
                          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: reminder ? BRAND.accent : BRAND.textMuted, cursor: "pointer" }}>
                            <Bell size={12} />
                            <input
                              type="time"
                              value={reminder}
                              onChange={(e) => setReminder(task.id, e.target.value)}
                              style={{ background: "transparent", border: "none", color: reminder ? BRAND.accent : BRAND.textMuted, fontSize: 11, outline: "none", width: 66 }}
                            />
                          </label>
                          <span style={{ background: done ? BRAND.accent : BRAND.gold, color: BRAND.bg, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                            +{task.xp}XP
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rewards */}
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <Gift size={16} color={BRAND.rose} /> Recompensas
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                    {REWARDS.map((rw) => {
                      const unlocked = checklistState.xp >= rw.xp;
                      return (
                        <div key={rw.label} style={{ background: BRAND.bgMid, border: `1px solid ${unlocked ? BRAND.accent : BRAND.bgLight}`, borderRadius: 14, padding: 12, opacity: unlocked ? 1 : 0.6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ fontSize: 26 }}>{rw.emoji}</span>
                            <span style={{ background: unlocked ? BRAND.accent : BRAND.bgLight, color: unlocked ? BRAND.bg : BRAND.textMuted, borderRadius: 8, padding: "3px 8px", fontSize: 10, fontWeight: 700 }}>
                              {unlocked ? "✓ Desbloqueado" : `${rw.xp} XP`}
                            </span>
                          </div>
                          <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600 }}>{rw.label}</p>
                          {!unlocked && <p style={{ margin: "2px 0 0", fontSize: 11, color: BRAND.textMuted }}>Faltam {rw.xp - checklistState.xp} XP</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ranks */}
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <Trophy size={16} color={BRAND.gold} /> Ranks
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {RANKS.map((r) => {
                      const reached = checklistState.xp >= r.min;
                      return (
                        <div
                          key={r.name}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, borderRadius: 20,
                            padding: "6px 12px", fontSize: 13,
                            border: `1.5px solid ${reached ? BRAND.accent : BRAND.bgLight}`,
                            background: reached ? "rgba(45,212,191,0.08)" : BRAND.bgMid,
                            opacity: reached ? 1 : 0.5,
                          }}
                        >
                          <span>{r.emoji}</span>
                          <span style={{ fontWeight: 600 }}>{r.name}</span>
                          <span style={{ fontSize: 11, color: BRAND.textMuted }}>{r.min} XP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* ════════════ MINHAS LISTAS ════════════ */}
        {tab === "minhas" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                placeholder="Nova pasta…"
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                style={{
                  flex: 1, background: BRAND.bgMid, border: `1.5px solid ${BRAND.bgLight}`,
                  borderRadius: 10, padding: "9px 14px", color: BRAND.text, fontSize: 14, outline: "none",
                }}
              />
              <button
                onClick={() => { addFolder(folderInput); setFolderInput(""); toast.success("Pasta criada"); }}
                style={{
                  background: BRAND.bgLight, border: "none", borderRadius: 10, padding: "9px 14px",
                  color: BRAND.text, fontWeight: 600, fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <FolderPlus size={15} /> Pasta
              </button>
            </div>

            {lists.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 16px", background: BRAND.bgMid, borderRadius: 16, border: `1px solid ${BRAND.bgLight}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>Nenhuma lista ainda</h3>
                <p style={{ fontSize: 13, color: BRAND.textMuted, margin: "0 0 16px" }}>Vá em Explorar e crie sua primeira lista 🎉</p>
                <button
                  onClick={() => setTab("explorar")}
                  style={{ background: accentGradient, border: "none", borderRadius: 10, padding: "10px 20px", color: BRAND.bg, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                >
                  Explorar nichos
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {folders.map((folder) => {
                  const items = listsByFolder[folder] ?? [];
                  if (items.length === 0) return null;
                  return (
                    <div key={folder}>
                      <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: BRAND.textMuted, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        <Folder size={13} /> {folder} <span style={{ fontWeight: 400 }}>({items.length})</span>
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                        {items.map((l) => {
                          const niche = NICHES.find((n) => n.id === l.nicheId) ?? NICHES[0];
                          const done = l.items.filter((i) => i.checked).length;
                          const pct = l.items.length ? (done / l.items.length) * 100 : 0;
                          return (
                            <div
                              key={l.id}
                              onClick={() => openExisting(l)}
                              style={{ background: BRAND.bgMid, border: `1px solid ${BRAND.bgLight}`, borderRadius: 14, padding: 14, cursor: "pointer" }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <span style={{ fontSize: 24 }}>{niche.emoji}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteList(l.id); toast("Lista removida"); }}
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: BRAND.textMuted }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>{l.name}</div>
                              <div style={{ fontSize: 11, color: BRAND.textMuted, margin: "2px 0 8px" }}>{done}/{l.items.length} concluídos</div>
                              <div style={{ height: 4, background: BRAND.bgLight, borderRadius: 99, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: accentGradient, borderRadius: 99 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── EDITOR DIALOG ── */}
      <Dialog open={!!editor} onOpenChange={(o) => !o && setEditor(null)}>
        <DialogContent className="max-w-lg" style={{ background: BRAND.bgMid, border: `1px solid ${BRAND.bgLight}`, color: BRAND.text }}>
          {editor && (
            <>
              <DialogHeader>
                <DialogTitle style={{ display: "flex", alignItems: "center", gap: 8, color: BRAND.text }}>
                  <span style={{ fontSize: 22 }}>{editorNiche.emoji}</span>
                  <Input
                    value={editor.name}
                    onChange={(e) => setEditor({ ...editor, name: e.target.value })}
                    style={{ background: BRAND.bg, border: `1px solid ${BRAND.bgLight}`, color: BRAND.text }}
                  />
                </DialogTitle>
              </DialogHeader>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: BRAND.textMuted }}>Pasta:</span>
                <Select value={editor.folder} onValueChange={(v) => setEditor({ ...editor, folder: v })}>
                  <SelectTrigger style={{ background: BRAND.bg, border: `1px solid ${BRAND.bgLight}`, color: BRAND.text, height: 32, width: 140 }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ background: BRAND.bgMid, border: `1px solid ${BRAND.bgLight}`, color: BRAND.text }}>
                    {folders.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {editorNiche.actions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => toast(`${a.emoji} ${a.label}`, { description: "Ação em breve" })}
                    style={{ background: BRAND.bgLight, border: "none", borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: BRAND.text, cursor: "pointer" }}
                  >
                    {a.emoji} {a.label}
                  </button>
                ))}
              </div>

              <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, scrollbarWidth: "none" }}>
                {editor.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, background: BRAND.bg, border: `1px solid ${BRAND.bgLight}`, borderRadius: 10, padding: "8px 12px" }}>
                    <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
                    <span style={{ flex: 1, fontSize: 14, color: item.checked ? BRAND.textMuted : BRAND.text, textDecoration: item.checked ? "line-through" : "none" }}>
                      {item.name}
                    </span>
                    <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND.textMuted, padding: 2 }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {editor.items.length === 0 && <p style={{ textAlign: "center", color: BRAND.textMuted, padding: "24px 0", fontSize: 13 }}>Nenhum item — adicione abaixo</p>}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Input
                  placeholder="Adicionar item…"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  style={{ background: BRAND.bg, border: `1px solid ${BRAND.bgLight}`, color: BRAND.text }}
                />
                <Button onClick={addItem} variant="secondary"><Plus size={16} /></Button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditor(null)} style={{ borderColor: BRAND.bgLight, color: BRAND.textMuted }}>Cancelar</Button>
                <Button onClick={handleSave} style={{ background: accentGradient, color: BRAND.bg, fontWeight: 700, border: "none" }}>
                  <Save size={14} style={{ marginRight: 6 }} /> Salvar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── FEEDBACK DIALOG ── */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent style={{ background: BRAND.bgMid, border: `1px solid ${BRAND.bgLight}`, color: BRAND.text }}>
          <DialogHeader>
            <DialogTitle style={{ display: "flex", alignItems: "center", gap: 8, color: BRAND.text }}>
              <Lightbulb size={18} color={BRAND.gold} /> Sugestões de melhoria
            </DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Conte o que podemos melhorar…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            style={{ background: BRAND.bg, border: `1px solid ${BRAND.bgLight}`, color: BRAND.text, resize: "none" }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)} style={{ borderColor: BRAND.bgLight, color: BRAND.textMuted }}>Fechar</Button>
            <Button
              onClick={() => { if (!feedback.trim()) return; toast.success("Obrigado pela sugestão! 💚"); setFeedback(""); setFeedbackOpen(false); }}
              style={{ background: accentGradient, color: BRAND.bg, fontWeight: 700, border: "none" }}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
