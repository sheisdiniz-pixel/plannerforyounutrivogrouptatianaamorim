import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import faviconAsset from "../assets/favicon.jpeg.asset.json";

function NotFoundComponent() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f1e2a", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
      <div style={{ textAlign: "center", color: "#e2f0f9" }}>
        <h1 style={{ fontSize: 72, fontWeight: 800, margin: 0, color: "#2dd4bf" }}>404</h1>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: "12px 0 8px" }}>Página não encontrada</h2>
        <p style={{ fontSize: 14, color: "#7a9db8", margin: "0 0 24px" }}>
          A página que você procura não existe ou foi movida.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            borderRadius: 10, background: "linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%)",
            padding: "10px 24px", fontSize: 14, fontWeight: 700, color: "#0f1e2a",
            textDecoration: "none",
          }}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0f1e2a" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Planner For You" },
      { name: "application-name", content: "Planner For You" },
      { title: "Planner For You — Listas e rotinas inteligentes" },
      { name: "description", content: "mercado, churrasco, material escolar, lista de natal, afazeres na parte da manhã ou trabalho, qualquer que seja a sua Rotina o nosso planner atenderá." },
      { name: "author", content: "Planner For You" },
      { property: "og:title", content: "Planner For You — Listas e rotinas inteligentes" },
      { property: "og:description", content: "mercado, churrasco, material escolar, lista de natal, afazeres na parte da manhã ou trabalho, qualquer que seja a sua Rotina o nosso planner atenderá." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Planner For You — Listas e rotinas inteligentes" },
      { name: "twitter:description", content: "mercado, churrasco, material escolar, lista de natal, afazeres na parte da manhã ou trabalho, qualquer que seja a sua Rotina o nosso planner atenderá." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/x6rk2HtaJnX0UtjBHe3Js5Qc4hC3/social-images/social-1777785220907-WhatsApp_Image_2026-05-02_at_2.21.03_PM.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/x6rk2HtaJnX0UtjBHe3Js5Qc4hC3/social-images/social-1777785220907-WhatsApp_Image_2026-05-02_at_2.21.03_PM.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: faviconAsset.url },
      {
        rel: "apple-touch-icon", sizes: "180x180",
        href: "https://plannerforyounutrivogrouptatianaamorim.lovable.app/assets/profile-logo-C0QyFCsK.png",
      },
      {
        rel: "icon", type: "image/png", sizes: "192x192",
        href: "https://plannerforyounutrivogrouptatianaamorim.lovable.app/assets/profile-logo-C0QyFCsK.png",
      },
      {
        rel: "icon", type: "image/png", sizes: "512x512",
        href: "https://plannerforyounutrivogrouptatianaamorim.lovable.app/assets/profile-logo-C0QyFCsK.png",
      },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            background: #0f1e2a;
            min-height: 100vh;
            width: 100%;
          }
          #root {
            min-height: 100vh;
            background: #0f1e2a;
          }
          /* Remove badge do Lovable */
          [data-lovable-badge],
          #lovable-badge,
          a[href*="lovable.dev"][style*="position: fixed"],
          a[href*="lovable.dev"][style*="position:fixed"] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
          /* Remove barras brancas laterais */
          ::-webkit-scrollbar { width: 0; background: transparent; }
        `}</style>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
