import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

// These values apply only to a disposable local test database.
const dir = await mkdtemp(join(tmpdir(), "aninhar-e2e-"));
const child = spawn(process.execPath, ["server/index.js"], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: "4301",
    APP_ORIGIN: "http://127.0.0.1:4173",
    DATA_DIR: dir,
    ADMIN_PASSWORD: "Aninhar-test-only-52!",
    SESSION_SECRET: "test-only-session-secret-for-isolated-e2e-1234567890",
    NODE_ENV: "test",
  },
});
let stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  child.kill("SIGTERM");
  await rm(dir, { recursive: true, force: true });
  process.exitCode = code;
}
child.on("error", (error) => {
  console.error(error.message);
  void stop(1);
});
child.on("exit", (code) => void stop(code ?? 0));
process.on("SIGTERM", () => void stop());
process.on("SIGINT", () => void stop());
