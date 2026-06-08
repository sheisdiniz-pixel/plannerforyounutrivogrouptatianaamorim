import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Truck, ShieldCheck, Star, RefreshCw, Zap, Flame } from "lucide-react";

interface Product {
  id: string;
  name: string;
  benefit: string;
  price: string;
  originalPrice?: string;
  emoji: string;
  badge?: "Mais vendido" | "Novo";
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Kit Produtividade Pro", benefit: "Organize sua rotina e ganhe 3h por dia", price: "R$ 97", originalPrice: "R$ 197", emoji: "📒", badge: "Mais vendido" },
  { id: "p2", name: "Planner Digital Premium", benefit: "Modelo editável que se adapta a você", price: "R$ 47", emoji: "🗂️", badge: "Novo" },
  { id: "p3", name: "Curso IA na Prática", benefit: "Domine IA em 7 dias com aulas guiadas", price: "R$ 197", originalPrice: "R$ 397", emoji: "🤖", badge: "Mais vendido" },
  { id: "p4", name: "Pack Templates Instagram", benefit: "30 artes prontas para vender mais", price: "R$ 37", emoji: "📱" },
  { id: "p5", name: "Mentoria Express 1:1", benefit: "Uma hora que muda seu projeto", price: "R$ 297", emoji: "💎", badge: "Novo" },
  { id: "p6", name: "E-book Vendas com IA", benefit: "Roteiros prontos para fechar negócios", price: "R$ 27", emoji: "📘" },
];

function Countdown() {
  const [seconds, setSeconds] = useState(600);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black/40 px-4 py-2 font-mono text-2xl font-extrabold text-white backdrop-blur">
      ⏱ {mm}:{ss}
    </div>
  );
}

export default function ProductsSales() {
  return (
    <section className="space-y-10 pb-10 animate-in fade-in duration-500">
      {/* HERO */}
      <Card className="relative overflow-hidden border-0 p-8 text-center" style={{ background: "linear-gradient(135deg, #0f1e2a 0%, #1d3045 60%, #2dd4bf 200%)" }}>
        <Badge className="mb-4 border-0 bg-rose-500/90 text-white animate-pulse">🔥 Frete grátis hoje</Badge>
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          Transforme sua rotina com<br />o que há de melhor
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-white/80 sm:text-lg">
          Ferramentas, cursos e templates feitos para você produzir mais e vender melhor — hoje mesmo.
        </p>
        <Button
          size="lg"
          className="mt-6 h-14 animate-pulse rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-10 text-base font-extrabold text-slate-900 shadow-[0_0_30px_rgba(45,212,191,0.6)] transition-transform hover:scale-105"
          onClick={() => document.getElementById("produtos-grid")?.scrollIntoView({ behavior: "smooth" })}
        >
          QUERO AGORA →
        </Button>
        <p className="mt-3 text-xs text-white/70">⚡ Últimas unidades disponíveis</p>
      </Card>

      {/* GRID */}
      <div id="produtos-grid">
        <h2 className="mb-4 text-center text-2xl font-extrabold text-foreground">Escolha o seu agora</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Card
              key={p.id}
              className="group relative flex flex-col overflow-hidden border-border/60 p-0 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[var(--shadow-elegant)] animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              {p.badge && (
                <span className={`absolute right-2 top-2 z-10 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${p.badge === "Mais vendido" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
                  {p.badge === "Mais vendido" ? "🔥" : "🆕"} {p.badge}
                </span>
              )}
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-muted/40 to-muted/10 text-6xl">
                {p.emoji}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.benefit}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  {p.originalPrice && <span className="text-xs text-muted-foreground line-through">{p.originalPrice}</span>}
                  <span className="text-lg font-extrabold text-emerald-600">{p.price}</span>
                </div>
                <Button
                  size="sm"
                  className="mt-2 w-full gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 font-extrabold text-white shadow-md transition-all hover:from-rose-600 hover:to-orange-600 hover:shadow-lg"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> COMPRAR
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* TRUST BAR */}
      <Card className="border-border/60 p-4">
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {[
            { icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />, label: "Pagamento seguro" },
            { icon: <Truck className="h-5 w-5 text-sky-500" />, label: "Entrega rápida" },
            { icon: <Star className="h-5 w-5 text-amber-500" />, label: "+500 clientes felizes" },
            { icon: <RefreshCw className="h-5 w-5 text-violet-500" />, label: "Troca garantida" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1.5">
              {t.icon}
              <span className="text-xs font-semibold text-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* BOTTOM CTA */}
      <Card className="overflow-hidden border-0 p-8 text-center" style={{ background: "linear-gradient(135deg, #0f1e2a 0%, #1d3045 100%)" }}>
        <Flame className="mx-auto h-10 w-10 text-rose-400" />
        <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">Não perca essa oportunidade</h2>
        <p className="mt-2 text-sm text-white/80 sm:text-base">Estoque limitado — garanta o seu agora</p>
        <Countdown />
        <div className="mt-5">
          <Button
            size="lg"
            className="h-14 animate-pulse rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-8 text-base font-extrabold text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-transform hover:scale-105"
          >
            <Zap className="mr-1 h-5 w-5" /> COMPRAR AGORA — ÚLTIMAS UNIDADES
          </Button>
        </div>
      </Card>
    </section>
  );
}
