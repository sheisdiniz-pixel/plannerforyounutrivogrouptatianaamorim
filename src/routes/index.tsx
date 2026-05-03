import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NICHES, type ListNiche } from "@/lib/lists-data";
import { useLists, type ListItem, type SavedList } from "@/hooks/use-lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast, Toaster } from "sonner";
import { Plus, Trash2, FolderPlus, ShoppingBag, Sparkles, Save, Lightbulb, Folder, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Planner For You — Listas inteligentes para sua vida" },
      { name: "description", content: "Organize compras por nicho: maquiagem, fitness, vegana, bebê, tech e mais. Listas elegantes, salvas em pastas." },
    ],
  }),
  component: Index,
});

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function Index() {
  const { lists, folders, saveList, deleteList, addFolder } = useLists();
  const [activeNiche, setActiveNiche] = useState<ListNiche>(NICHES[0]);
  const [editor, setEditor] = useState<SavedList | null>(null);
  const [newItem, setNewItem] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [folderInput, setFolderInput] = useState("");
  const [tab, setTab] = useState("explorar");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-sky-50">
      <Toaster position="top-center" richColors />

      {/* Hero header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-header)] opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,white,transparent_60%)] opacity-30" />
        <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 text-white">
            <div className="rounded-2xl bg-white/20 p-2.5 backdrop-blur">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Planner For You</h1>
              <p className="text-sm text-white/85">Listas inteligentes para tudo que importa</p>
            </div>
            <div className="ml-auto">
              <Button
                variant="secondary"
                className="gap-2 bg-white text-foreground hover:bg-white/90"
                onClick={() => setFeedbackOpen(true)}
              >
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="hidden sm:inline">Sugestões</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-full bg-white shadow-sm">
            <TabsTrigger value="explorar" className="rounded-full data-[state=active]:bg-[var(--gradient-hero)] data-[state=active]:text-white">
              <Sparkles className="mr-2 h-4 w-4" /> Explorar
            </TabsTrigger>
            <TabsTrigger value="minhas" className="rounded-full data-[state=active]:bg-[var(--gradient-hero)] data-[state=active]:text-white">
              <Folder className="mr-2 h-4 w-4" /> Minhas listas
              {lists.length > 0 && <Badge className="ml-2 bg-white/30">{lists.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* EXPLORAR */}
          <TabsContent value="explorar" className="mt-6">
            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-bold">Compras</h2>
                  <p className="text-sm text-muted-foreground">Escolha um estilo e crie sua lista em segundos</p>
                </div>
              </div>

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
                          ? "border-transparent bg-[var(--gradient-hero)] text-white shadow-md"
                          : "border-border bg-white text-foreground hover:border-primary/50"
                      }`}
                    >
                      <span className="mr-1.5">{n.emoji}</span>
                      {n.name}
                    </button>
                  );
                })}
              </div>

              {/* Niche grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {NICHES.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Card
                      key={n.id}
                      className="group relative cursor-pointer overflow-hidden border-border/60 p-0 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
                      onClick={() => startNewList(n)}
                    >
                      <div className={`bg-gradient-to-br ${n.color} p-5 text-white`}>
                        <div className="flex items-start justify-between">
                          <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-3xl">{n.emoji}</span>
                        </div>
                        <h3 className="mt-4 text-lg font-bold">{n.name}</h3>
                        <p className="text-sm text-white/85">{n.description}</p>
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

              {/* Action buttons */}
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

              {/* Items */}
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
