import { useEffect, useState } from "react";

export type ListItem = { id: string; name: string; checked: boolean };
export type SavedList = {
  id: string;
  nicheId: string;
  name: string;
  folder: string;
  items: ListItem[];
  createdAt: number;
};

const KEY = "planner-for-you::lists";
const FOLDERS_KEY = "planner-for-you::folders";

export function useLists() {
  const [lists, setLists] = useState<SavedList[]>([]);
  const [folders, setFolders] = useState<string[]>(["Geral"]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLists(JSON.parse(raw));
      const fr = localStorage.getItem(FOLDERS_KEY);
      if (fr) setFolders(JSON.parse(fr));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lists));
  }, [lists]);
  useEffect(() => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }, [folders]);

  const saveList = (list: SavedList) => {
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

  const deleteList = (id: string) => setLists((prev) => prev.filter((l) => l.id !== id));

  const addFolder = (name: string) => {
    if (!name.trim()) return;
    setFolders((prev) => (prev.includes(name) ? prev : [...prev, name]));
  };

  return { lists, folders, saveList, deleteList, addFolder };
}
