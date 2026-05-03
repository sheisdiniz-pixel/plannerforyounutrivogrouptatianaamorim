import { useEffect, useState } from "react";

export type ChecklistState = {
  xp: number;
  streak: number;
  lastActiveDay: string | null;
  completedToday: Record<string, boolean>; // taskId -> done
  totalCompletions: number;
};

const KEY = "planner-for-you::checklist";

const today = () => new Date().toISOString().slice(0, 10);

const initial: ChecklistState = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  completedToday: {},
  totalCompletions: 0,
};

export function useChecklist() {
  const [state, setState] = useState<ChecklistState>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: ChecklistState = JSON.parse(raw);
        // reset daily tasks if it's a new day
        if (parsed.lastActiveDay !== today()) {
          parsed.completedToday = {};
        }
        setState(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const toggleTask = (taskId: string, xp: number) => {
    setState((prev) => {
      const wasDone = !!prev.completedToday[taskId];
      const completedToday = { ...prev.completedToday, [taskId]: !wasDone };
      const delta = wasDone ? -xp : xp;
      const totalCompletions = prev.totalCompletions + (wasDone ? -1 : 1);

      // streak logic — increment when completing first task of a new day
      let streak = prev.streak;
      let lastActiveDay = prev.lastActiveDay;
      if (!wasDone) {
        const t = today();
        if (lastActiveDay !== t) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
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
        lastActiveDay,
      };
    });
  };

  const reset = () => setState(initial);

  return { state, toggleTask, reset };
}
