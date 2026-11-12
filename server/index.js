import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createApp } from "./app.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { app, close, configured } = createApp({
  dataDir: resolve(process.env.DATA_DIR ?? resolve(root, "data")),
  seedFile: resolve(
    process.env.CONTENT_SEED ?? resolve(root, "content/seed.json"),
  ),
  password: process.env.ADMIN_PASSWORD,
  sessionSecret: process.env.SESSION_SECRET,
  appOrigin: process.env.APP_ORIGIN,
  trustedProxy: process.env.TRUST_PROXY,
  production: process.env.NODE_ENV === "production",
  staticDir: resolve(root, "dist"),
});
const port = Number(process.env.PORT ?? 3001);
const server = app.listen(port, process.env.HOST ?? "0.0.0.0", () => {
  console.log(`Aninhar API disponível na porta ${port}.`);
  if (!configured)
    console.warn(
      "Painel desativado: configure ADMIN_PASSWORD (12+ caracteres), SESSION_SECRET (32+ caracteres) e APP_ORIGIN. As páginas públicas continuam disponíveis.",
    );
});
server.requestTimeout = 30000;
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () =>
    server.close(() => {
      close();
      process.exit(0);
    }),
  );
