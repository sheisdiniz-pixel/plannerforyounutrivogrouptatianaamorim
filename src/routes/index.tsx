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
  Plus, Trash2, FolderPlus, ShoppingBag, Sparkles, Save, Lightbulb, Folder, X,
  ListChecks, Flame, Trophy, Gift, Zap, CheckCircle2, Bell,
} from "lucide-react";
import profileLogo from "@/assets/profile-logo.png";
import { useReminders } from "@/hooks/use-reminders";

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
  const [exploreMode, setExploreMode] = useState<"compras" | "checklist">("compras");
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
    if (!wasDone) {
      toast.success(`+${xp} XP`, { description: "Tarefa concluída! 🎉" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100">
      <Toaster position="top-center" richColors />

      {/* Hero header — graphite/charcoal for emphasis */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.65_0.17_160/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.62_0.18_235/0.25),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-white/20 shadow-lg">
              <img src={profileLogo} alt="Planner For You" className="h-full w-full rounded-2xl object-contain p-0.5" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-white via-emerald-200 to-sky-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
                Planner For You
              </h1>
              <p className="text-sm text-slate-700">Listas e rotinas inteligentes</p>
            </div>
            <div className="ml-auto">
              <Button
                variant="secondary"
                className="gap-2 bg-white/10 text-slate-900 ring-1 ring-white/20 backdrop-blur hover:bg-white/20"
                onClick={() => setFeedbackOpen(true)}
              >
                <Lightbulb className="h-4 w-4 text-amber-300" />
                <span className="hidden sm:inline">Sugestões</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-full bg-white shadow-sm">
            <TabsTrigger value="explorar" className="rounded-full data-[state=active]:bg-[var(--gradient-hero)] data-[state=active]:text-slate-900">
              <Sparkles className="mr-2 h-4 w-4" /> Explorar
            </TabsTrigger>
            <TabsTrigger value="minhas" className="rounded-full data-[state=active]:bg-[var(--gradient-hero)] data-[state=active]:text-slate-900">
              <Folder className="mr-2 h-4 w-4" /> Minhas listas
              {lists.length > 0 && <Badge className="ml-2 bg-white/30">{lists.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* EXPLORAR */}
          <TabsContent value="explorar" className="mt-6">
            {/* Section switcher: Compras | Checklist */}
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExploreMode("compras")}
                  className={`rounded-full px-5 py-2 text-base font-bold transition-all ${
                    exploreMode === "compras"
                      ? "bg-[var(--gradient-hero)] text-slate-900 shadow-md"
                      : "bg-white text-foreground hover:bg-muted"
                  }`}
                >
                  <ShoppingBag className="mr-1.5 inline h-4 w-4" /> Compras
                </button>
                <button
                  onClick={() => setExploreMode("checklist")}
                  className={`rounded-full px-5 py-2 text-base font-bold transition-all ${
                    exploreMode === "checklist"
                      ? "bg-gradient-to-r from-amber-500 to-rose-500 text-slate-900 shadow-md"
                      : "bg-white text-foreground hover:bg-muted"
                  }`}
                >
                  <ListChecks className="mr-1.5 inline h-4 w-4" /> Checklist
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {exploreMode === "compras"
                  ? "Escolha um estilo e crie sua lista em segundos"
                  : "Cumpra rotinas, ganhe XP e suba de rank 🏆"}
              </p>
            </div>

            {exploreMode === "compras" ? (
              <section>
                {/* Niche pills */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                  {NICHES.map((n) => {
                    const active = activeNiche.id === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setActiveNiche(n)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-transparent bg-[var(--gradient-hero)] text-slate-900 shadow-md"
                            : "border-border bg-white text-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="mr-1.5">{n.emoji}</span>
                        {n.name}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {NICHES.map((n) => {
                    const Icon = n.icon;
                    return (
                      <Card
                        key={n.id}
                        className="group relative cursor-pointer overflow-hidden border-border/60 p-0 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                        onClick={() => startNewList(n)}
                      >
                        <div className={`bg-gradient-to-br ${n.color} p-5 text-slate-900`}>
                          <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-3xl">{n.emoji}</span>
                          </div>
                          <h3 className="mt-4 text-lg font-bold">{n.name}</h3>
                          <p className="text-sm text-slate-700">{n.description}</p>
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <span className="text-xs text-muted-foreground">{n.defaultItems.length} itens • {n.actions.length} ações</span>
                          <Button size="sm" className="gap-1 rounded-full">
                            <Plus className="h-4 w-4" /> Criar
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>
            ) : (
              <section>
                {/* Gamification dashboard */}
                <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-slate-900">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-700">
                      <Trophy className="h-4 w-4" /> Rank atual
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl">{rank.current.emoji}</span>
                      <span className="text-2xl font-extrabold">{rank.current.name}</span>
                    </div>
                    {rank.next ? (
                      <>
                        <Progress value={rank.progress} className="mt-3 bg-white/15" />
                        <p className="mt-1.5 text-xs text-slate-700">
                          {rank.next.min - checklistState.xp} XP para {rank.next.emoji} {rank.next.name}
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-xs text-amber-300">Você atingiu o rank máximo! 👑</p>
                    )}
                  </Card>

                  <Card className="border-0 bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-slate-900">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-700">
                      <Zap className="h-4 w-4" /> XP total
                    </div>
                    <div className="mt-2 text-4xl font-extrabold">{checklistState.xp}</div>
                    <p className="mt-1 text-xs text-slate-700">{checklistState.totalCompletions} tarefas concluídas</p>
                  </Card>

                  <Card className="border-0 bg-gradient-to-br from-rose-500 to-fuchsia-600 p-5 text-slate-900">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-700">
                      <Flame className="h-4 w-4" /> Streak
                    </div>
                    <div className="mt-2 text-4xl font-extrabold">{checklistState.streak} 🔥</div>
                    <p className="mt-1 text-xs text-slate-700">dias consecutivos</p>
                  </Card>
                </div>

                {/* Routine selector */}
                <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
                  {ROUTINES.map((r) => {
                    const active = activeRoutineId === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setActiveRoutineId(r.id)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-transparent bg-gradient-to-r from-amber-500 to-rose-500 text-slate-900 shadow-md"
                            : "border-border bg-white text-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="mr-1.5">{r.emoji}</span>
                        {r.name}
                      </button>
                    );
                  })}
                </div>

                {/* Active routine card */}
                <Card className="overflow-hidden p-0">
                  <div className={`bg-gradient-to-br ${activeRoutine.color} p-5 text-slate-900`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{activeRoutine.emoji}</span>
                          <h3 className="text-xl font-extrabold">{activeRoutine.name}</h3>
                        </div>
                        <p className="text-sm text-slate-700">{activeRoutine.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-slate-700">Hoje</div>
                        <div className="text-2xl font-bold">{tasksDoneToday}/{activeRoutine.tasks.length}</div>
                      </div>
                    </div>
                    <Progress value={dayProgress} className="mt-3 bg-white/20" />
                  </div>

                  <div className="space-y-2 p-4">
                    {activeRoutine.tasks.map((task) => {
                      const done = !!checklistState.completedToday[task.id];
                      const reminder = reminders[task.id] || "";
                      return (
                        <div
                          key={task.id}
                          className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                            done
                              ? "border-emerald-500/50 bg-emerald-50"
                              : "border-border bg-white hover:border-primary/50 hover:shadow-sm"
                          }`}
                        >
                          <button
                            onClick={() => handleToggleTask(task.id, task.xp)}
                            className="flex flex-1 items-center gap-3 text-left"
                          >
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-500 text-slate-900" : "bg-muted"}`}>
                              {done ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-lg">{task.emoji}</span>}
                            </div>
                            <span className={`flex-1 font-medium ${done ? "text-muted-foreground line-through" : ""}`}>
                              {task.label}
                            </span>
                          </button>
                          <div className="flex items-center gap-1.5">
                            <label className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${reminder ? "border-sky-500 bg-sky-50 text-sky-700" : "border-border bg-white text-muted-foreground"}`} title="Definir despertador">
                              <Bell className="h-3.5 w-3.5" />
                              <input
                                type="time"
                                value={reminder}
                                onChange={(e) => setReminder(task.id, e.target.value)}
                                className="w-[70px] bg-transparent outline-none"
                              />
                              {reminder && (
                                <button
                                  onClick={(e) => { e.preventDefault(); setReminder(task.id, ""); }}
                                  className="ml-0.5 text-sky-700/70 hover:text-sky-900"
                                  aria-label="Remover despertador"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </label>
                            <Badge className={done ? "bg-emerald-500" : "bg-amber-500"}>
                              <Zap className="mr-1 h-3 w-3" /> {task.xp} XP
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Rewards */}
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                    <Gift className="h-5 w-5 text-rose-500" /> Recompensas
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {REWARDS.map((rw) => {
                      const unlocked = checklistState.xp >= rw.xp;
                      return (
                        <Card
                          key={rw.label}
                          className={`p-4 transition-all ${unlocked ? "border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-white" : "opacity-70"}`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-3xl">{rw.emoji}</span>
                            <Badge variant={unlocked ? "default" : "secondary"} className={unlocked ? "bg-emerald-500" : ""}>
                              {unlocked ? "Desbloqueado" : `${rw.xp} XP`}
                            </Badge>
                          </div>
                          <p className="mt-2 font-semibold">{rw.label}</p>
                          {!unlocked && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Faltam {rw.xp - checklistState.xp} XP
                            </p>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Ranks legend */}
                <div className="mt-6">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                    <Trophy className="h-5 w-5 text-amber-500" /> Ranks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {RANKS.map((r) => {
                      const reached = checklistState.xp >= r.min;
                      return (
                        <div
                          key={r.name}
                          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                            reached ? "border-emerald-500 bg-white" : "border-border bg-muted/40 opacity-60"
                          }`}
                        >
                          <span>{r.emoji}</span>
                          <span className="font-semibold">{r.name}</span>
                          <span className="text-xs text-muted-foreground">{r.min} XP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </TabsContent>

          {/* MINHAS */}
          <TabsContent value="minhas" className="mt-6">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Input
                placeholder="Nova pasta…"
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                className="max-w-xs bg-white"
              />
              <Button
                variant="outline"
                onClick={() => {
                  addFolder(folderInput);
                  setFolderInput("");
                  toast.success("Pasta criada");
                }}
              >
                <FolderPlus className="mr-2 h-4 w-4" /> Adicionar pasta
              </Button>
            </div>

            {lists.length === 0 ? (
              <Card className="flex flex-col items-center gap-3 p-10 text-center">
                <div className="rounded-full bg-[var(--gradient-soft)] p-4">
                  <Folder className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Nenhuma lista ainda</h3>
                <p className="text-sm text-muted-foreground">Vá em Explorar e crie sua primeira lista 🎉</p>
                <Button onClick={() => setTab("explorar")} className="mt-2">Explorar nichos</Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {folders.map((folder) => {
                  const items = listsByFolder[folder] ?? [];
                  if (items.length === 0) return null;
                  return (
                    <div key={folder}>
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        <Folder className="h-4 w-4" /> {folder}
                        <span className="text-xs font-normal">({items.length})</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((l) => {
                          const niche = NICHES.find((n) => n.id === l.nicheId) ?? NICHES[0];
                          const done = l.items.filter((i) => i.checked).length;
                          return (
                            <Card key={l.id} className="cursor-pointer p-4 transition-all hover:shadow-[var(--shadow-elegant)]" onClick={() => openExisting(l)}>
                              <div className="flex items-start justify-between">
                                <span className="text-2xl">{niche.emoji}</span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteList(l.id);
                                    toast("Lista removida");
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                              <h4 className="mt-1 font-semibold">{l.name}</h4>
                              <p className="text-xs text-muted-foreground">{done}/{l.items.length} concluídos</p>
                              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full bg-[var(--gradient-hero)] transition-all"
                                  style={{ width: `${l.items.length ? (done / l.items.length) * 100 : 0}%` }}
                                />
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* List editor */}
      <Dialog open={!!editor} onOpenChange={(o) => !o && setEditor(null)}>
        <DialogContent className="max-w-lg">
          {editor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{editorNiche.emoji}</span>
                  <Input
                    value={editor.name}
                    onChange={(e) => setEditor({ ...editor, name: e.target.value })}
                    className="text-base font-semibold"
                  />
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Pasta:</span>
                <Select value={editor.folder} onValueChange={(v) => setEditor({ ...editor, folder: v })}>
                  <SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {folders.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                {editorNiche.actions.map((a) => (
                  <Button
                    key={a.label}
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => toast(`${a.emoji} ${a.label}`, { description: "Ação em breve" })}
                  >
                    <span className="mr-1">{a.emoji}</span>{a.label}
                  </Button>
                ))}
              </div>

              <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {editor.items.map((item) => (
                  <div key={item.id} className="group flex items-center gap-3 rounded-lg border bg-white px-3 py-2 transition-colors hover:border-primary/50">
                    <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
                    <span className={`flex-1 text-sm ${item.checked ? "text-muted-foreground line-through" : ""}`}>
                      {item.name}
                    </span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => removeItem(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {editor.items.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">Nenhum item — adicione abaixo</p>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar item…"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                />
                <Button onClick={addItem} variant="secondary"><Plus className="h-4 w-4" /></Button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditor(null)}>Cancelar</Button>
                <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Salvar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-amber-500" /> Sugestões de melhoria do App</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Conte o que podemos melhorar…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>Fechar</Button>
            <Button
              onClick={() => {
                if (!feedback.trim()) return;
                toast.success("Obrigado pela sugestão! 💚");
                setFeedback("");
                setFeedbackOpen(false);
              }}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
