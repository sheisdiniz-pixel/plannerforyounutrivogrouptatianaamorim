import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, User, Calendar, TrendingUp, Bell, ExternalLink, Plus, X, Smartphone, Monitor } from "lucide-react";
import { toast } from "sonner";

type Platform = "Xbox" | "Mobile" | "Ambos";

interface Game {
  id: string;
  name: string;
  platform: "Xbox" | "Mobile";
  genre: string;
  rating: number;
  badge: "🔥 Trending" | "⭐ Top Rated" | "🆕 Novo";
  url: string;
}

interface Tournament {
  id: string;
  name: string;
  game: string;
  platform: "Xbox" | "Mobile";
  startDate: string;
  endDate: string;
  prize: string;
  status: "🟢 Inscrito" | "🟡 Aberto" | "🔴 Encerrado";
  url: string;
}

interface Release {
  id: string;
  name: string;
  platform: "Xbox" | "Mobile";
  releaseDate: string;
}

interface GamerProfile {
  gamertag: string;
  mobileId: string;
  favoriteGames: string[];
  tournamentsJoined: string[];
  achievements: { id: string; label: string; emoji: string }[];
  weeklyGoal: string;
}

const TRENDING_GAMES: Game[] = [
  { id: "g1", name: "Call of Duty: Black Ops 7", platform: "Xbox", genre: "FPS / Ação", rating: 8.9, badge: "🔥 Trending", url: "https://www.callofduty.com" },
  { id: "g2", name: "Halo Infinite Season 8", platform: "Xbox", genre: "FPS / Sci-Fi", rating: 8.4, badge: "⭐ Top Rated", url: "https://www.halowaypoint.com" },
  { id: "g3", name: "Forza Motorsport 9", platform: "Xbox", genre: "Corrida", rating: 9.1, badge: "🆕 Novo", url: "https://forza.net" },
  { id: "g4", name: "Starfield: Shattered Space II", platform: "Xbox", genre: "RPG", rating: 8.6, badge: "🔥 Trending", url: "https://bethesda.net/starfield" },
  { id: "g5", name: "Free Fire MAX", platform: "Mobile", genre: "Battle Royale", rating: 8.7, badge: "🔥 Trending", url: "https://ff.garena.com" },
  { id: "g6", name: "Mobile Legends: Bang Bang", platform: "Mobile", genre: "MOBA", rating: 8.8, badge: "⭐ Top Rated", url: "https://www.mobilelegends.com" },
  { id: "g7", name: "Genshin Impact 5.5", platform: "Mobile", genre: "RPG / Aventura", rating: 9.0, badge: "⭐ Top Rated", url: "https://genshin.hoyoverse.com" },
  { id: "g8", name: "Wuthering Waves", platform: "Mobile", genre: "Action RPG", rating: 8.5, badge: "🆕 Novo", url: "https://wutheringwaves.kurogames.com" },
  { id: "g9", name: "PUBG Mobile 3.0", platform: "Mobile", genre: "Battle Royale", rating: 8.6, badge: "🔥 Trending", url: "https://www.pubgmobile.com" },
];

const TOURNAMENTS: Tournament[] = [
  { id: "t1", name: "Halo Championship Series 2026", game: "Halo Infinite", platform: "Xbox", startDate: "2026-06-20", endDate: "2026-06-22", prize: "US$ 250.000", status: "🟡 Aberto", url: "https://halo.gg" },
  { id: "t2", name: "Call of Duty League Major V", game: "Black Ops 7", platform: "Xbox", startDate: "2026-07-05", endDate: "2026-07-12", prize: "US$ 500.000", status: "🟡 Aberto", url: "https://callofdutyleague.com" },
  { id: "t3", name: "MLBB M6 World Championship", game: "Mobile Legends", platform: "Mobile", startDate: "2026-06-15", endDate: "2026-06-30", prize: "US$ 900.000", status: "🟡 Aberto", url: "https://m6.mobilelegends.com" },
  { id: "t4", name: "Free Fire World Series Rio", game: "Free Fire MAX", platform: "Mobile", startDate: "2026-08-10", endDate: "2026-08-17", prize: "US$ 2.000.000", status: "🟡 Aberto", url: "https://ffworldseries.com" },
  { id: "t5", name: "PUBG Mobile Global Open", game: "PUBG Mobile", platform: "Mobile", startDate: "2026-05-30", endDate: "2026-06-05", prize: "US$ 3.000.000", status: "🔴 Encerrado", url: "https://www.pubgmobile.com/esports" },
];

const RELEASES: Release[] = [
  { id: "r1", name: "Fable Reborn", platform: "Xbox", releaseDate: "2026-06-25" },
  { id: "r2", name: "Perfect Dark", platform: "Xbox", releaseDate: "2026-07-15" },
  { id: "r3", name: "Honkai: Star Rail 3.0", platform: "Mobile", releaseDate: "2026-06-18" },
  { id: "r4", name: "GTA VI Mobile Companion", platform: "Mobile", releaseDate: "2026-09-01" },
  { id: "r5", name: "State of Decay 3", platform: "Xbox", releaseDate: "2026-10-12" },
  { id: "r6", name: "Marvel Mystic Mayhem", platform: "Mobile", releaseDate: "2026-07-30" },
];

const TRENDING_NOW = [
  { rank: 1, name: "Free Fire MAX", platform: "Mobile", change: "+12%" },
  { rank: 2, name: "Call of Duty: Black Ops 7", platform: "Xbox", change: "+8%" },
  { rank: 3, name: "Genshin Impact", platform: "Mobile", change: "+5%" },
  { rank: 4, name: "Halo Infinite", platform: "Xbox", change: "+3%" },
  { rank: 5, name: "Mobile Legends", platform: "Mobile", change: "+2%" },
];

const PROFILE_KEY = "gamer-orbit::profile";
const NOTIF_KEY = "gamer-orbit::release-notifs";

const loadProfile = (): GamerProfile => {
  if (typeof window === "undefined") return defaultProfile();
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "") || defaultProfile(); } catch { return defaultProfile(); }
};

const defaultProfile = (): GamerProfile => ({
  gamertag: "",
  mobileId: "",
  favoriteGames: [],
  tournamentsJoined: [],
  achievements: [
    { id: "a1", label: "Primeira Vitória", emoji: "🥇" },
    { id: "a2", label: "Maratonista", emoji: "🎮" },
  ],
  weeklyGoal: "",
});

const NEON = "#39ff14";
const PURPLE = "#a855f7";
const DARK = "#0a0a14";

export default function GamerOrbit() {
  const [platformFilter, setPlatformFilter] = useState<Platform>("Ambos");
  const [profile, setProfile] = useState<GamerProfile>(() => loadProfile());
  const [newFav, setNewFav] = useState("");
  const [notifs, setNotifs] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs)); }, [notifs]);

  const filteredGames = useMemo(
    () => TRENDING_GAMES.filter((g) => platformFilter === "Ambos" || g.platform === platformFilter),
    [platformFilter],
  );

  const filteredTrending = useMemo(
    () => TRENDING_NOW.filter((g) => platformFilter === "Ambos" || g.platform === platformFilter),
    [platformFilter],
  );

  const toggleTournament = (id: string) => {
    setProfile((p) => ({
      ...p,
      tournamentsJoined: p.tournamentsJoined.includes(id)
        ? p.tournamentsJoined.filter((x) => x !== id)
        : [...p.tournamentsJoined, id],
    }));
    toast.success("Adicionado ao calendário 🎮");
  };

  const toggleNotif = async (id: string, name: string) => {
    if (!notifs[id] && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
    setNotifs((n) => ({ ...n, [id]: !n[id] }));
    toast.success(notifs[id] ? "Notificação removida" : `Você será avisado: ${name}`);
  };

  const addFav = () => {
    if (!newFav.trim()) return;
    setProfile((p) => ({ ...p, favoriteGames: [...p.favoriteGames, newFav.trim()] }));
    setNewFav("");
  };
  const removeFav = (g: string) =>
    setProfile((p) => ({ ...p, favoriteGames: p.favoriteGames.filter((x) => x !== g) }));

  return (
    <section className="space-y-6 animate-in fade-in duration-500" style={{ color: "#e5e7eb" }}>
      {/* HEADER */}
      <Card className="overflow-hidden border-0 p-6" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #1a0b2e 50%, #0f1419 100%)`, boxShadow: `0 0 30px ${NEON}33` }}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${NEON}, ${PURPLE})`, boxShadow: `0 0 20px ${NEON}66` }}>
            <Gamepad2 className="h-7 w-7 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: NEON, textShadow: `0 0 10px ${NEON}88` }}>🎮 Órbita Gamer</h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>Seu universo gamer Xbox & Mobile em um só lugar</p>
          </div>
        </div>
        {/* Filters */}
        <div className="mt-5 flex gap-2">
          {(["Ambos", "Xbox", "Mobile"] as Platform[]).map((p) => {
            const active = platformFilter === p;
            return (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: active ? `linear-gradient(135deg, ${NEON}, ${PURPLE})` : "#1f2937",
                  color: active ? "#000" : "#9ca3af",
                  boxShadow: active ? `0 0 12px ${NEON}88` : "none",
                  border: active ? "none" : "1px solid #374151",
                }}
              >
                {p === "Xbox" ? <Monitor className="h-3 w-3" /> : p === "Mobile" ? <Smartphone className="h-3 w-3" /> : null}
                {p}
              </button>
            );
          })}
        </div>
      </Card>

      {/* SEÇÃO 1 — JOGOS EM ALTA */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: NEON }}>
          <TrendingUp className="h-5 w-5" /> Jogos em Alta
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((g, i) => (
            <Card
              key={g.id}
              className="group overflow-hidden border-0 p-4 transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
              style={{
                background: "#111827",
                border: `1px solid #1f2937`,
                animationDelay: `${i * 50}ms`,
                animationFillMode: "both",
                boxShadow: `0 0 0 transparent`,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${NEON}44`; (e.currentTarget as HTMLElement).style.borderColor = NEON; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 transparent`; (e.currentTarget as HTMLElement).style.borderColor = "#1f2937"; }}
            >
              <div className="flex items-start justify-between">
                <Gamepad2 className="h-5 w-5" style={{ color: PURPLE }} />
                <Badge variant="secondary" className="border-0 text-[10px]" style={{ background: `${NEON}22`, color: NEON }}>
                  {g.badge}
                </Badge>
              </div>
              <h4 className="mt-2 text-sm font-bold text-white">{g.name}</h4>
              <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: "#9ca3af" }}>
                <span>{g.platform}</span>
                <span>·</span>
                <span>{g.genre}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: NEON }}>⭐ {g.rating}/10</span>
                <Button
                  size="sm"
                  className="h-7 gap-1 rounded-full text-[11px]"
                  style={{ background: `linear-gradient(135deg, ${NEON}, ${PURPLE})`, color: "#000", border: "none" }}
                  onClick={() => window.open(g.url, "_blank", "noopener,noreferrer")}
                >
                  Ver mais <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SEÇÃO 2 — TORNEIOS */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: PURPLE }}>
          <Trophy className="h-5 w-5" /> Torneios e Campeonatos
        </h3>
        <div className="space-y-2">
          {TOURNAMENTS.filter((t) => platformFilter === "Ambos" || t.platform === platformFilter).map((t) => {
            const joined = profile.tournamentsJoined.includes(t.id);
            const status = joined ? "🟢 Inscrito" : t.status;
            return (
              <Card key={t.id} className="border-0 p-4" style={{ background: "#111827", border: `1px solid ${joined ? NEON : "#1f2937"}` }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>{t.game} · {t.platform}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs" style={{ color: "#9ca3af" }}>
                      <span>📅 {t.startDate} → {t.endDate}</span>
                      <span style={{ color: NEON }}>💰 {t.prize}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="border-0 text-[11px]" style={{ background: `${PURPLE}22`, color: PURPLE }}>
                    {status}
                  </Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="h-7 flex-1 gap-1 rounded-full text-[11px]" style={{ background: PURPLE, color: "#fff", border: "none" }} onClick={() => window.open(t.url, "_blank", "noopener,noreferrer")}>
                    Inscrever-se <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1 rounded-full text-[11px]" style={{ borderColor: NEON, color: NEON, background: "transparent" }} onClick={() => toggleTournament(t.id)}>
                    <Calendar className="h-3 w-3" /> {joined ? "Remover" : "Calendário"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 3 — PERFIL */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: NEON }}>
          <User className="h-5 w-5" /> Meu Perfil Gamer
        </h3>
        <Card className="border-0 p-5 space-y-4" style={{ background: "#111827", border: `1px solid #1f2937` }}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold" style={{ color: NEON }}>Gamertag Xbox</label>
              <Input value={profile.gamertag} onChange={(e) => setProfile({ ...profile, gamertag: e.target.value })} placeholder="Seu_Gamertag" className="mt-1 border-0 text-white" style={{ background: "#1f2937" }} />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: PURPLE }}>ID Mobile Favorito</label>
              <Input value={profile.mobileId} onChange={(e) => setProfile({ ...profile, mobileId: e.target.value })} placeholder="123456789" className="mt-1 border-0 text-white" style={{ background: "#1f2937" }} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: NEON }}>Jogos Favoritos</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.favoriteGames.map((g) => (
                <span key={g} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${NEON}22`, color: NEON }}>
                  {g}
                  <button onClick={() => removeFav(g)}><X className="h-3 w-3" /></button>
                </span>
              ))}
              {profile.favoriteGames.length === 0 && <span className="text-xs" style={{ color: "#6b7280" }}>Nenhum ainda</span>}
            </div>
            <div className="mt-2 flex gap-2">
              <Input value={newFav} onChange={(e) => setNewFav(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addFav()} placeholder="Adicionar jogo…" className="border-0 text-white" style={{ background: "#1f2937" }} />
              <Button size="sm" onClick={addFav} style={{ background: NEON, color: "#000", border: "none" }}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: PURPLE }}>Torneios que está participando</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.tournamentsJoined.length === 0 && <span className="text-xs" style={{ color: "#6b7280" }}>Nenhum — inscreva-se acima</span>}
              {profile.tournamentsJoined.map((id) => {
                const t = TOURNAMENTS.find((x) => x.id === id);
                if (!t) return null;
                return <span key={id} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${PURPLE}22`, color: PURPLE }}>🏆 {t.name}</span>;
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: NEON }}>Conquistas & Badges</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.achievements.map((a) => (
                <span key={a.id} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#1f2937", color: "#e5e7eb" }}>
                  {a.emoji} {a.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold" style={{ color: PURPLE }}>Meta da Semana</label>
            <Input value={profile.weeklyGoal} onChange={(e) => setProfile({ ...profile, weeklyGoal: e.target.value })} placeholder="Ex: Subir para Diamante no MLBB" className="mt-1 border-0 text-white" style={{ background: "#1f2937" }} />
          </div>
        </Card>
      </div>

      {/* SEÇÃO 4 — RADAR DE LANÇAMENTOS */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: PURPLE }}>
          <Calendar className="h-5 w-5" /> Radar de Lançamentos
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {RELEASES.filter((r) => platformFilter === "Ambos" || r.platform === platformFilter).map((r) => {
            const on = !!notifs[r.id];
            return (
              <Card key={r.id} className="flex items-center justify-between border-0 p-3" style={{ background: "#111827", border: `1px solid ${on ? NEON : "#1f2937"}` }}>
                <div>
                  <p className="text-sm font-bold text-white">{r.name}</p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>{r.platform} · 📅 {r.releaseDate}</p>
                </div>
                <button
                  onClick={() => toggleNotif(r.id, r.name)}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-all"
                  style={{ background: on ? NEON : "#1f2937", color: on ? "#000" : "#9ca3af" }}
                  title="Notificar lançamento"
                >
                  <Bell className="h-4 w-4" />
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 5 — TRENDING NOW */}
      <Card className="border-0 p-5" style={{ background: `linear-gradient(135deg, #0a0a14, #1a0b2e)`, border: `1px solid ${NEON}44` }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold" style={{ color: NEON }}>
            <TrendingUp className="h-5 w-5" /> Trending Now
          </h3>
          <span className="text-[10px]" style={{ color: "#6b7280" }}>Atualiza a cada 30min</span>
        </div>
        <div className="space-y-2">
          {filteredTrending.map((t) => (
            <button
              key={t.rank}
              onClick={() => window.open(`https://trends.google.com/trends/explore?q=${encodeURIComponent(t.name)}`, "_blank")}
              className="flex w-full items-center justify-between rounded-lg p-3 text-left transition-all hover:translate-x-1"
              style={{ background: "#0a0a14", border: "1px solid #1f2937" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold" style={{ color: PURPLE }}>#{t.rank}</span>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>{t.platform}</p>
                </div>
              </div>
              <span className="text-xs font-bold" style={{ color: NEON }}>{t.change}</span>
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
}
