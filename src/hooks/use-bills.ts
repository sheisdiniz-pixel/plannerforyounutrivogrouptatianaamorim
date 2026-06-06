import { useEffect, useRef, useState } from "react";

export type BillStatus = "Pendente" | "Pago" | "Atrasado";
export type BillCategory =
  | "Moradia"
  | "Alimentação"
  | "Saúde"
  | "Transporte"
  | "Educação"
  | "Lazer"
  | "Assinaturas"
  | "Outros";
export type BillRecurrence = "Única" | "Mensal" | "Semanal" | "Anual";

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: BillStatus;
  category: BillCategory;
  recurrence: BillRecurrence;
  notes?: string;
  createdAt: number;
  notifiedAt?: number; // last notification ms
};

const BILLS_KEY = "bills-control::bills";
const SOUND_KEY = "bills-control::alarm-sound";

function load(): Bill[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(BILLS_KEY) || "[]"); } catch { return []; }
}

export function daysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(date + "T00:00:00");
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

export function leadDaysFor(amount: number): number {
  if (amount >= 1000) return 6;
  if (amount >= 800) return 4;
  return 2;
}

export function useBills() {
  const [bills, setBills] = useState<Bill[]>(() => load());
  const [alarmSound, setAlarmSound] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(SOUND_KEY);
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    if (alarmSound) localStorage.setItem(SOUND_KEY, alarmSound);
    else localStorage.removeItem(SOUND_KEY);
  }, [alarmSound]);

  // Auto-mark overdue + check alarms
  useEffect(() => {
    const check = () => {
      setBills((prev) => {
        let changed = false;
        const next = prev.map((b) => {
          if (b.status !== "Pago") {
            const d = daysUntil(b.dueDate);
            if (d < 0 && b.status !== "Atrasado") {
              changed = true;
              return { ...b, status: "Atrasado" as BillStatus };
            }
          }
          return b;
        });
        return changed ? next : prev;
      });

      // Alarms
      const today = new Date().toDateString();
      bills.forEach((b) => {
        if (b.status === "Pago") return;
        const d = daysUntil(b.dueDate);
        const lead = leadDaysFor(b.amount);
        const shouldAlert = d <= lead && d >= 0;
        const overdue = d < 0;
        const lastDay = b.notifiedAt ? new Date(b.notifiedAt).toDateString() : null;
        if ((shouldAlert || overdue) && lastDay !== today) {
          triggerAlert(b, overdue);
          setBills((prev) => prev.map((x) => x.id === b.id ? { ...x, notifiedAt: Date.now() } : x));
        }
      });
    };
    check();
    const t = window.setInterval(check, 60_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills.length]);

  const triggerAlert = (b: Bill, overdue: boolean) => {
    const title = overdue ? "⚠️ Conta atrasada" : "🔔 Conta a vencer";
    const body = `${b.name} — R$ ${b.amount.toFixed(2)} (vence ${b.dueDate})`;
    if ("Notification" in window && Notification.permission === "granted") {
      try { new Notification(title, { body }); } catch {}
    }
    playAlarm();
  };

  const playAlarm = () => {
    try {
      if (alarmSound) {
        if (!audioRef.current) audioRef.current = new Audio();
        audioRef.current.src = alarmSound;
        audioRef.current.play().catch(() => {});
      } else {
        const a = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=");
        a.play().catch(() => {});
      }
    } catch {}
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) return "denied";
    if (Notification.permission === "default") return await Notification.requestPermission();
    return Notification.permission;
  };

  const addBill = (b: Omit<Bill, "id" | "createdAt">) => {
    setBills((p) => [{ ...b, id: Math.random().toString(36).slice(2, 10), createdAt: Date.now() }, ...p]);
  };
  const updateBill = (id: string, patch: Partial<Bill>) =>
    setBills((p) => p.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const deleteBill = (id: string) => setBills((p) => p.filter((b) => b.id !== id));

  return {
    bills, setBills,
    alarmSound, setAlarmSound,
    addBill, updateBill, deleteBill,
    requestPermission, playAlarm,
  };
}
