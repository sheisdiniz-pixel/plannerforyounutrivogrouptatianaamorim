import { PlayCircle, ExternalLink, MessageCircle } from "lucide-react";

type Video = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  buttonLabel?: string;
  buttonIcon?: "play" | "whatsapp";
};

// Extrai ID do YouTube para gerar thumbnail
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// 🔧 Futuro: substituir esta lista por aulas próprias
const SHOPEE_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Como se cadastrar como afiliado Shopee",
    description: "Tutorial completo para iniciantes — do zero ao primeiro link",
    url: "https://www.youtube.com/watch?v=NINukM3t8ak",
    buttonLabel: "Assistir",
    buttonIcon: "play",
  },
  {
    id: "v2",
    title: "Como encontrar, baixar e postar vídeo na Shopee",
    description: "Acesse nosso grupo exclusivo no WhatsApp com vídeos diários para afiliados",
    url: "https://chat.whatsapp.com/Ki4mPZWcZmeCVgXboh1GNA?mode=gi_t",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=70",
    buttonLabel: "Entrar no Grupo",
    buttonIcon: "whatsapp",
  },
  {
    id: "v3",
    title: "Como postar vídeo na Shopee como afiliado",
    description: "Atualizado em 2026 — dentro do app, sem complicação",
    url: "https://www.youtube.com/watch?v=NwwQgmErt2g",
    buttonLabel: "Assistir",
    buttonIcon: "play",
  },
  {
    id: "v4",
    title: "Como vender em 24h usando Shopee Vídeos",
    description: "Guia completo para começar a vender rápido",
    url: "https://www.youtube.com/watch?v=mBwDP3C7iPM",
    buttonLabel: "Assistir",
    buttonIcon: "play",
  },
];

const BRAND = {
  bg: "#0f1e2a",
  bgMid: "#162535",
  bgLight: "#1d3045",
  accent: "#2dd4bf",
  text: "#e2f0f9",
  textMuted: "#7a9db8",
};

export default function LearnSection() {
  return (
    <section>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: BRAND.text, display: "flex", alignItems: "center", gap: 8 }}>
          🎓 Aprenda
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: BRAND.textMuted }}>
          Conteúdos selecionados para você evoluir
        </p>
      </div>

      <div style={{ background: BRAND.bgMid, border: `1px solid ${BRAND.bgLight}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: BRAND.text }}>
          🛒 Como começar na Shopee Vídeo
        </h3>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: BRAND.textMuted }}>
          Passo a passo para virar afiliado e começar a faturar
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {SHOPEE_VIDEOS.map((v) => {
            const ytId = getYouTubeId(v.url);
            const thumb = v.thumbnail ?? (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);
            const isWhatsapp = v.buttonIcon === "whatsapp";
            return (
              <div
                key={v.id}
                style={{
                  background: BRAND.bg, border: `1px solid ${BRAND.bgLight}`, borderRadius: 12,
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = BRAND.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = BRAND.bgLight; }}
              >
                <div
                  onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
                  style={{
                    position: "relative", aspectRatio: "16/9", background: BRAND.bgLight,
                    cursor: "pointer", overflow: "hidden",
                  }}
                >
                  {thumb && <img src={thumb} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />}
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(0,0,0,0.3)",
                  }}>
                    <PlayCircle size={48} color="#fff" style={{ opacity: 0.95, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }} />
                  </div>
                </div>
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: BRAND.text, lineHeight: 1.3 }}>{v.title}</h4>
                  <p style={{ margin: 0, fontSize: 12, color: BRAND.textMuted, flex: 1, lineHeight: 1.4 }}>{v.description}</p>
                  <button
                    onClick={() => window.open(v.url, "_blank", "noopener,noreferrer")}
                    style={{
                      marginTop: 4, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                      fontWeight: 700, fontSize: 13,
                      background: isWhatsapp ? "#25D366" : BRAND.accent,
                      color: BRAND.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    {isWhatsapp ? <MessageCircle size={14} /> : <ExternalLink size={14} />}
                    {v.buttonLabel ?? "Assistir"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: 11, color: BRAND.textMuted, textAlign: "center", margin: 0 }}>
        ✨ Em breve: aulas exclusivas Planner For You
      </p>
    </section>
  );
}
