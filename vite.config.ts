import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Export as async function so we can use await import(...) safely
export default defineConfig(async () => {
  // Base plugins used everywhere
  const plugins: any[] = [
    react(),
    // cast to any in case type definitions are missing
    (runtimeErrorOverlay as any)(),
  ];

  // Optional plugin used only on Replit/dev environment.
  // We import it dynamically and safely (try/catch), and cast to any to avoid TS errors.
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const m = await import("@replit/vite-plugin-cartographer");
      // m might export default or be the function itself, so try both.
      const cartographer = (m as any).default || (m as any);
      if (typeof cartographer === "function") {
        plugins.push(cartographer());
      }
    } catch (err) {
      // jika plugin tidak ada, jangan crash — cukup log dan lanjutkan
      // (ini penting saat build di Vercel yang tidak punya plugin ini)
      // eslint-disable-next-line no-console
      console.warn("Optional plugin @replit/vite-plugin-cartographer not loaded:", err);
    }
  }

  return {
    // Karena index.html ada di folder client
    root: "client",
    plugins,
    build: {
      // agar hasil build berada di root/dist (bukan client/dist)
      outDir: "../dist",
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
      },
    },
  };
});
