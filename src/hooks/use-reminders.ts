import { useEffect, useState } from "react";

const KEY = "task-reminders-v1";
type Reminders = Record<string, string>; // taskId -> "HH:MM"

function load(): Reminders {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

function scheduleAll(reminders: Reminders, getLabel: (id: string) => string) {
  if (typeof window === "undefined") return () => {};
  const timers: number[] = [];
  Object.entries(reminders).forEach(([id, time]) => {
    if (!time) return;
    const [h, m] = time.split(":").map(Number);
    const now = new Date();
    const next = new Date();
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
        audio.play().catch(() => {});
      } catch {}
    }, ms);
    timers.push(t);
  });
  return () => timers.forEach((t) => clearTimeout(t));
}

export function useReminders(getLabel: (id: string) => string) {
  const [reminders, setReminders] = useState<Reminders>(() => load());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(reminders));
    const cleanup = scheduleAll(reminders, getLabel);
    return cleanup;
  }, [reminders, getLabel]);

  const setReminder = async (taskId: string, time: string) => {
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
