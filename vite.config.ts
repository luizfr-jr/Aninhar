import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          lucide: ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.API_TARGET || "http://127.0.0.1:3001",
        configure(proxy) {
          proxy.on("error", (error, request, response) => {
            if (
              "code" in error &&
              error.code === "ECONNREFUSED" &&
              request.url === "/api/content" &&
              "writeHead" in response &&
              !response.headersSent
            ) {
              response.writeHead(503, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({
                  code: "API_UNAVAILABLE",
                  error: "Servidor indisponível",
                }),
              );
            }
          });
        },
      },
      "/media": process.env.API_TARGET || "http://127.0.0.1:3001",
    },
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
