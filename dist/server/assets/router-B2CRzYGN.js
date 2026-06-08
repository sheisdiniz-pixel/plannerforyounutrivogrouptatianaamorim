import { jsx, jsxs } from "react/jsx-runtime";
import { createRootRoute, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter, useRouter } from "@tanstack/react-router";
const appCss = "/assets/styles-BsulzdDE.css";
const url = "/__l5e/assets-v1/4c909467-a230-48a7-ac63-c5d39f3ff652/favicon.jpeg";
const faviconAsset = {
  url
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { style: { minHeight: "100vh", background: "#0f1e2a", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }, children: /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", color: "#e2f0f9" }, children: [
    /* @__PURE__ */ jsx("h1", { style: { fontSize: 72, fontWeight: 800, margin: 0, color: "#2dd4bf" }, children: "404" }),
    /* @__PURE__ */ jsx("h2", { style: { fontSize: 20, fontWeight: 600, margin: "12px 0 8px" }, children: "Página não encontrada" }),
    /* @__PURE__ */ jsx("p", { style: { fontSize: 14, color: "#7a9db8", margin: "0 0 24px" }, children: "A página que você procura não existe ou foi movida." }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          background: "linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%)",
          padding: "10px 24px",
          fontSize: 14,
          fontWeight: 700,
          color: "#0f1e2a",
          textDecoration: "none"
        },
        children: "Voltar ao início"
      }
    )
  ] }) });
}
const Route$1 = createRootRoute({
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
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/x6rk2HtaJnX0UtjBHe3Js5Qc4hC3/social-images/social-1777785220907-WhatsApp_Image_2026-05-02_at_2.21.03_PM.webp" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: faviconAsset.url },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "https://plannerforyounutrivogrouptatianaamorim.lovable.app/assets/profile-logo-C0QyFCsK.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "https://plannerforyounutrivogrouptatianaamorim.lovable.app/assets/profile-logo-C0QyFCsK.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "https://plannerforyounutrivogrouptatianaamorim.lovable.app/assets/profile-logo-C0QyFCsK.png"
      },
      { rel: "manifest", href: "/manifest.json" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(HeadContent, {}),
      /* @__PURE__ */ jsx("style", { children: `
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
        ` })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const $$splitComponentImporter = () => import("./index-C1WjvYco.js");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Planner For You — Listas e rotinas inteligentes"
    }, {
      name: "description",
      content: "Listas de compras por nicho e checklists de rotina com rank, XP e recompensas. Planeje sua vida em segundos."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router;
};
export {
  getRouter
};
