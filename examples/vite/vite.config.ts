import path from "path";
import { fileURLToPath } from "url";
import { cpSync, existsSync } from "fs";
import react from "@vitejs/plugin-react";
import sirv from "sirv";
import { defineConfig, type Connect, type Plugin } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.resolve(rootDir, "../web/static");

function serveExamplesStatic(): Plugin {
  const attach = (middlewares: Connect.Server) => {
    middlewares.use("/static", sirv(staticRoot, { dev: true, etag: true, single: false }));
  };
  return {
    name: "serve-examples-static",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
    closeBundle() {
      const outStatic = path.resolve(rootDir, "dist/static");
      if (existsSync(staticRoot)) {
        cpSync(staticRoot, outStatic, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  root: rootDir,
  plugins: [react(), serveExamplesStatic()],
  resolve: {
    alias: {
      "@registry/ui": path.resolve(rootDir, "../../ui/index.ts"),
      "@registry/components": path.resolve(rootDir, "../../components/index.ts"),
      "@blocks/home-variants": path.resolve(rootDir, "../data/home.variants.json"),
      "@blocks/dashboard-variants": path.resolve(rootDir, "../data/dashboard.variants.json"),
    },
  },
  server: {
    port: 5173,
    fs: {
      allow: [path.resolve(rootDir, ".."), path.resolve(rootDir, "../../")],
    },
  },
  preview: {
    port: 4173,
  },
});
