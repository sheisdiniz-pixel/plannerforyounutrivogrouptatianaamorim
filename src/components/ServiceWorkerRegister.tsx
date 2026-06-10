import { useEffect } from "react";
import { toast } from "sonner";

function isUnsupportedHost(): boolean {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  if (window.self !== window.top) return true; // iframe (preview)
  if (h.startsWith("id-preview--") || h.startsWith("preview--")) return true;
  if (h === "lovableproject.com" || h.endsWith(".lovableproject.com")) return true;
  if (h === "lovableproject-dev.com" || h.endsWith(".lovableproject-dev.com")) return true;
  if (h === "beta.lovable.dev" || h.endsWith(".beta.lovable.dev")) return true;
  if (window.location.search.includes("sw=off")) return true;
  return false;
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    const unsupported = isUnsupportedHost() || !import.meta.env.PROD;

    if (unsupported) {
      // limpa qualquer registro prévio
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        regs.forEach((r) => {
          if (r.active?.scriptURL.endsWith("/sw.js")) r.unregister();
        });
      });
      return;
    }

    let refreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshed) return;
      refreshed = true;
      toast.success("App atualizado! ✨", { description: "Recarregando…" });
      setTimeout(() => window.location.reload(), 800);
    });

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      // verifica updates ao abrir
      reg.update().catch(() => {});
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            nw.postMessage("SKIP_WAITING");
          }
        });
      });
    }).catch(() => {});
  }, []);

  return null;
}
