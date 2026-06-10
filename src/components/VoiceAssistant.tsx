import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { toast } from "sonner";

// Eventos consumidos pelo index.tsx para executar comandos
export type PlannerCommand =
  | { type: "tab"; tab: "explorar" | "minhas" | "produtos" | "aprenda" }
  | { type: "exploreMode"; mode: "checklist" | "contas" | "gamer" | "ia" }
  | { type: "newList"; nicheKeyword?: string };

export function dispatchPlannerCommand(cmd: PlannerCommand) {
  window.dispatchEvent(new CustomEvent("planner-command", { detail: cmd }));
}

// Reconhecimento simples: extrai intenção a partir de frase em PT-BR
function interpret(raw: string): { cmd: PlannerCommand | null; readable: string } {
  const text = raw.toLowerCase().trim();
  const stripped = text.replace(/^planner[,]?\s*(faça|faz|por favor)?\s*/i, "");

  // Navegação por aba
  if (/aprenda|aulas|cursos/.test(stripped)) return { cmd: { type: "tab", tab: "aprenda" }, readable: "Ir para Aprenda" };
  if (/minhas listas|meus|salvas/.test(stripped)) return { cmd: { type: "tab", tab: "minhas" }, readable: "Ir para Minhas listas" };
  if (/produtos|loja/.test(stripped)) return { cmd: { type: "tab", tab: "produtos" }, readable: "Ir para Produtos" };

  // Modos do explorar
  if (/conta|boleto|finanç/.test(stripped)) return { cmd: { type: "exploreMode", mode: "contas" }, readable: "Abrir Controle de Contas" };
  if (/gamer|jogo|xbox/.test(stripped)) return { cmd: { type: "exploreMode", mode: "gamer" }, readable: "Abrir Órbita Gamer" };
  if (/ia|inteligência|claude/.test(stripped)) return { cmd: { type: "exploreMode", mode: "ia" }, readable: "Abrir IA" };
  if (/checklist|rotina|tarefas/.test(stripped) && !/cria|criar|nova/.test(stripped))
    return { cmd: { type: "exploreMode", mode: "checklist" }, readable: "Abrir Checklist" };

  // Criação de listas
  if (/cria|criar|nova lista|novo|monta/.test(stripped)) {
    const m = stripped.match(/(?:lista|checklist)\s*(?:de|do|da|para)?\s*([\p{L}\s]+)?/u);
    const keyword = m?.[1]?.trim();
    return { cmd: { type: "newList", nicheKeyword: keyword }, readable: keyword ? `Criar lista: ${keyword}` : "Criar nova lista" };
  }

  return { cmd: null, readable: raw };
}

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join(" ");
      setHeard(transcript);
      if (e.results[e.results.length - 1].isFinal) {
        const { cmd, readable } = interpret(transcript);
        if (cmd) {
          toast.success(`🎤 ${readable}`);
          dispatchPlannerCommand(cmd);
        } else {
          toast(`Não entendi: "${transcript}"`, { description: "Tente: Planner, cria uma lista de compras" });
        }
        stop();
      }
    };
    rec.onerror = () => { stop(); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, []);

  const start = () => {
    if (!recRef.current) return;
    try {
      setHeard("");
      recRef.current.start();
      setListening(true);
    } catch {}
  };
  const stop = () => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  };

  if (!supported) return null;

  return (
    <>
      <button
        aria-label="Assistente de voz"
        onClick={() => (listening ? stop() : start())}
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 100,
          width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
          background: listening
            ? "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)"
            : "linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: listening ? "plannerPulse 1.2s ease-in-out infinite" : undefined,
        }}
      >
        {listening ? <MicOff size={22} /> : <Mic size={22} />}
      </button>

      {listening && (
        <div style={{
          position: "fixed", bottom: 88, right: 20, zIndex: 100,
          background: "#162535", border: "1px solid #1d3045", color: "#e2f0f9",
          borderRadius: 12, padding: "10px 14px", minWidth: 220, maxWidth: 320,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2dd4bf" }}>🎤 Ouvindo…</div>
            <button onClick={stop} style={{ background: "none", border: "none", color: "#7a9db8", cursor: "pointer" }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ fontSize: 13, marginTop: 4, minHeight: 18 }}>
            {heard || <span style={{ color: "#7a9db8" }}>Diga: "Planner, cria uma lista de compras"</span>}
          </div>
        </div>
      )}

      <style>{`
        @keyframes plannerPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(244,63,94,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 8px 32px rgba(244,63,94,0.7); }
        }
      `}</style>
    </>
  );
}
