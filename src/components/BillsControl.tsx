import { useMemo, useState } from "react";
import { useBills, type Bill, type BillCategory, type BillRecurrence, type BillStatus, daysUntil, leadDaysFor } from "@/hooks/use-bills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus, Trash2, Wallet, Calendar as CalendarIcon, Download, Bell, Volume2,
  AlertTriangle, CheckCircle2, Clock, Filter, ArrowUpDown,
} from "lucide-react";

const CATEGORIES: BillCategory[] = ["Moradia", "Alimentação", "Saúde", "Transporte", "Educação", "Lazer", "Assinaturas", "Outros"];
const RECURRENCES: BillRecurrence[] = ["Única", "Mensal", "Semanal", "Anual"];
const STATUSES: BillStatus[] = ["Pendente", "Pago", "Atrasado"];

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function googleCalendarUrl(b: Bill) {
  const date = b.dueDate.replace(/-/g, "");
  const text = encodeURIComponent(b.name);
  const details = encodeURIComponent(`Valor: R$ ${b.amount.toFixed(2)}\nCategoria: ${b.category}\n${b.notes ?? ""}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${date}/${date}&details=${details}`;
}

function outlookCalendarUrl(b: Bill) {
  const start = `${b.dueDate}T09:00:00`;
  const end = `${b.dueDate}T10:00:00`;
  const subject = encodeURIComponent(b.name);
  const body = encodeURIComponent(`Valor: R$ ${b.amount.toFixed(2)} — ${b.category}`);
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${subject}&body=${body}&startdt=${start}&enddt=${end}`;
}

function downloadICS(b: Bill) {
  const dt = b.dueDate.replace(/-/g, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Planner For You//Contas//PT",
    "BEGIN:VEVENT",
    `UID:${b.id}@planner-for-you`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    `DTEND;VALUE=DATE:${dt}`,
    `SUMMARY:${b.name}`,
    `DESCRIPTION:Valor R$ ${b.amount.toFixed(2)} - ${b.category}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${b.name}.ics`; a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(bills: Bill[]) {
  const header = ["Nome", "Valor", "Vencimento", "Status", "Categoria", "Recorrência", "Observações"];
  const rows = bills.map((b) => [b.name, b.amount.toFixed(2), b.dueDate, b.status, b.category, b.recurrence, (b.notes ?? "").replace(/\n/g, " ")]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "contas.csv"; a.click();
  URL.revokeObjectURL(url);
}

const emptyForm = (): Omit<Bill, "id" | "createdAt"> => ({
  name: "",
  amount: 0,
  dueDate: new Date().toISOString().slice(0, 10),
  status: "Pendente",
  category: "Moradia",
  recurrence: "Mensal",
  notes: "",
});

export default function BillsControl() {
  const { bills, alarmSound, setAlarmSound, addBill, updateBill, deleteBill, requestPermission, playAlarm } = useBills();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Bill, "id" | "createdAt">>(emptyForm());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [sortBy, setSortBy] = useState<"due" | "amount" | "name">("due");
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
    return { total, pago, pendente, atrasado, pct: total ? (pago / total) * 100 : 0 };
  }, [monthBills]);

  const upcoming = useMemo(() => {
    return [...bills]
      .filter((b) => b.status !== "Pago" && daysUntil(b.dueDate) >= 0)
      .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))[0];
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

  const openNew = () => { setEditingId(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (b: Bill) => {
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

  const onSoundFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAlarmSound(base64);
      toast.success("Som do alarme salvo");
    };
    reader.readAsDataURL(file);
  };

  const statusBadge = (s: BillStatus) => {
    if (s === "Pago") return <Badge className="bg-emerald-500"><CheckCircle2 className="mr-1 h-3 w-3" />Pago</Badge>;
    if (s === "Atrasado") return <Badge className="bg-rose-500"><AlertTriangle className="mr-1 h-3 w-3" />Atrasado</Badge>;
    return <Badge className="bg-amber-500"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>;
  };

  return (
    <section>
      {/* Dashboard */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-slate-900">
          <div className="text-xs uppercase tracking-wider text-slate-700">Total do mês</div>
          <div className="mt-1 text-2xl font-extrabold">{formatBRL(totals.total)}</div>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-emerald-400 to-teal-500 p-4 text-slate-900">
          <div className="text-xs uppercase tracking-wider text-slate-700">Pago</div>
          <div className="mt-1 text-2xl font-extrabold">{formatBRL(totals.pago)}</div>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-slate-900">
          <div className="text-xs uppercase tracking-wider text-slate-700">Pendente</div>
          <div className="mt-1 text-2xl font-extrabold">{formatBRL(totals.pendente)}</div>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-rose-500 to-fuchsia-600 p-4 text-slate-900">
          <div className="text-xs uppercase tracking-wider text-slate-700">Atrasado</div>
          <div className="mt-1 text-2xl font-extrabold">{formatBRL(totals.atrasado)}</div>
        </Card>
      </div>

      <Card className="mb-5 p-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Progresso do mês</span>
          <span>{totals.pct.toFixed(0)}% pago</span>
        </div>
        <Progress value={totals.pct} className="mt-2" />
        {upcoming && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm">
            <Clock className="h-4 w-4 text-sky-600" />
            <span className="font-medium">Próxima a vencer:</span>
            <span>{upcoming.name} — {formatBRL(upcoming.amount)} ({daysUntil(upcoming.dueDate)}d)</span>
          </div>
        )}
      </Card>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={openNew} className="gap-1.5">
          <Plus className="h-4 w-4" /> Nova conta
        </Button>
        <Button variant="outline" onClick={() => setShowSettings(true)} className="gap-1.5">
          <Bell className="h-4 w-4" /> Alarme
        </Button>
        <Button variant="outline" onClick={() => exportCSV(filtered)} className="gap-1.5">
          <Download className="h-4 w-4" /> Exportar CSV
        </Button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="h-9 w-40 bg-white"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 w-32 bg-white"><Filter className="mr-1 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-9 w-36 bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Categoria</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v: "due" | "amount" | "name") => setSortBy(v)}>
            <SelectTrigger className="h-9 w-36 bg-white"><ArrowUpDown className="mr-1 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="due">Vencimento</SelectItem>
              <SelectItem value="amount">Valor</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <div className="rounded-full bg-emerald-50 p-4"><Wallet className="h-8 w-8 text-emerald-600" /></div>
          <h3 className="text-lg font-semibold">Nenhuma conta neste filtro</h3>
          <p className="text-sm text-muted-foreground">Cadastre sua primeira conta para começar 💸</p>
          <Button onClick={openNew} className="mt-2"><Plus className="mr-1 h-4 w-4" /> Nova conta</Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((b) => {
            const d = daysUntil(b.dueDate);
            return (
              <Card key={b.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold">{b.name}</h4>
                      {statusBadge(b.status)}
                      <Badge variant="outline">{b.category}</Badge>
                      <Badge variant="outline">{b.recurrence}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Vence {new Date(b.dueDate + "T00:00:00").toLocaleDateString("pt-BR")}
                      {b.status !== "Pago" && (
                        <span className={d < 0 ? "ml-2 text-rose-600" : d <= leadDaysFor(b.amount) ? "ml-2 text-amber-600" : "ml-2"}>
                          • {d < 0 ? `${Math.abs(d)}d atrasada` : d === 0 ? "hoje" : `em ${d}d`}
                        </span>
                      )}
                    </div>
                    {b.notes && <p className="mt-1 text-xs text-muted-foreground">{b.notes}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold">{formatBRL(b.amount)}</div>
                    <div className="text-xs text-muted-foreground">Aviso {leadDaysFor(b.amount)}d antes</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {b.status !== "Pago" && (
                    <Button size="sm" variant="outline" onClick={() => { updateBill(b.id, { status: "Pago" }); toast.success("Conta marcada como paga"); }}>
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Marcar pago
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openEdit(b)}>Editar</Button>
                  <a href={googleCalendarUrl(b)} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline"><CalendarIcon className="mr-1 h-3.5 w-3.5" /> Google</Button>
                  </a>
                  <a href={outlookCalendarUrl(b)} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline"><CalendarIcon className="mr-1 h-3.5 w-3.5" /> Outlook</Button>
                  </a>
                  <Button size="sm" variant="outline" onClick={() => downloadICS(b)}>
                    <CalendarIcon className="mr-1 h-3.5 w-3.5" /> Apple (.ics)
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { deleteBill(b.id); toast("Conta removida"); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Editor */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              {editingId ? "Editar conta" : "Nova conta"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome (ex: Aluguel)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" step="0.01" placeholder="Valor R$" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Select value={form.status} onValueChange={(v: BillStatus) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.category} onValueChange={(v: BillCategory) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.recurrence} onValueChange={(v: BillRecurrence) => setForm({ ...form, recurrence: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{RECURRENCES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Textarea placeholder="Observações" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <p className="text-xs text-muted-foreground">
              💡 Alarme automático {leadDaysFor(form.amount)} {leadDaysFor(form.amount) === 1 ? "dia" : "dias"} antes do vencimento.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alarm settings */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-amber-500" /> Configurações do alarme</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Permitimos notificações no navegador para te avisar antes do vencimento. Escolha um som do seu dispositivo para personalizar o alarme.
            </p>
            <Button variant="outline" className="w-full" onClick={async () => {
              const p = await requestPermission();
              toast(p === "granted" ? "Notificações ativadas ✅" : "Permissão: " + p);
            }}>
              <Bell className="mr-2 h-4 w-4" /> Ativar notificações
            </Button>

            <label className="block">
              <span className="font-medium">Som do alarme</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => onSoundFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm"
              />
            </label>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={playAlarm}>
                <Volume2 className="mr-2 h-4 w-4" /> Testar som
              </Button>
              {alarmSound && (
                <Button variant="ghost" onClick={() => { setAlarmSound(null); toast("Som padrão restaurado"); }}>
                  Remover
                </Button>
              )}
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <strong>Regras de antecedência:</strong>
              <ul className="ml-4 mt-1 list-disc">
                <li>Até R$ 799 → aviso 2 dias antes</li>
                <li>R$ 800 a R$ 999 → aviso 4 dias antes</li>
                <li>Acima de R$ 1.000 → aviso 6 dias antes</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
