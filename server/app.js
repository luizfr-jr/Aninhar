import express from "express";
import multer from "multer";
import {
  randomBytes,
  randomUUID,
  createHash,
  createHmac,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { openDatabase, readDraft } from "./database.js";
import {
  validateContent,
  validateVersion,
  ValidationError,
} from "./validation.js";

const COOKIE = "aninhar_session";
const SESSION_MS = 8 * 60 * 60 * 1000;
const hash = (value) => createHash("sha256").update(value).digest("hex");
const equals = (a, b) => a.length === b.length && timingSafeEqual(a, b);

function detectImage(buffer) {
  if (
    buffer.length >= 24 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return { ext: "png", mime: "image/png" };
  if (
    buffer.length >= 12 &&
    buffer[0] === 255 &&
    buffer[1] === 216 &&
    buffer[2] === 255
  )
    return { ext: "jpg", mime: "image/jpeg" };
  if (
    buffer.length >= 16 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  )
    return { ext: "webp", mime: "image/webp" };
  return null;
}

export function createApp(options) {
  const {
    dataDir,
    seedFile,
    password,
    sessionSecret,
    appOrigin,
    production = false,
    staticDir,
    sessionTtlMs = SESSION_MS,
    loginLimit = 8,
  } = options;
  let allowedOrigin;
  try {
    const parsed = new URL(appOrigin);
    if (
      ["http:", "https:"].includes(parsed.protocol) &&
      (!production || parsed.protocol === "https:")
    )
      allowedOrigin = parsed.origin;
  } catch {
    /* Missing or invalid deployment origin disables production admin. */
  }
  const configured = Boolean(
    password &&
      password.length >= 12 &&
      sessionSecret &&
      sessionSecret.length >= 32 &&
      (!production || allowedOrigin),
  );
  const passwordSalt = randomBytes(16);
  const passwordHash = configured
    ? scryptSync(password, passwordSalt, 64)
    : null;
  const db = openDatabase({ dataDir, seedFile });
  const mediaDir = join(dataDir, "media");
  mkdirSync(mediaDir, { recursive: true, mode: 0o700 });
  const app = express();
  app.disable("x-powered-by");
  const attempts = new Map();
  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: production,
    path: "/",
  };
  const sign = (value) =>
    createHmac("sha256", sessionSecret).update(value).digest("base64url");

  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
    });
    if (production)
      res.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; frame-src https://www.youtube-nocookie.com https://www.youtube.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      );
    next();
  });
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use("/api", express.json({ limit: "2mb" }));

  function requireOrigin(req, res, next) {
    const origin = req.get("origin");
    const expected = allowedOrigin ?? `${req.protocol}://${req.get("host")}`;
    if (
      !origin ||
      origin !== expected ||
      req.get("sec-fetch-site") === "cross-site"
    )
      return res
        .status(403)
        .json({
          error:
            "Origem da solicitação não permitida. Reabra o painel pelo endereço oficial.",
        });
    next();
  }
  function sessionToken(req) {
    if (!configured) return null;
    const cookie = (req.headers.cookie ?? "")
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith(`${COOKIE}=`));
    if (!cookie) return null;
    const [token, signature] = cookie.slice(COOKIE.length + 1).split(".");
    if (!token || !signature || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    if (!equals(Buffer.from(signature), Buffer.from(sign(token)))) return null;
    const session = db
      .prepare("SELECT expires_at FROM sessions WHERE hash = ?")
      .get(hash(token));
    if (!session || session.expires_at <= Date.now()) return null;
    return token;
  }
  function requireAdmin(req, res, next) {
    if (!configured)
      return res
        .status(503)
        .json({
          error:
            "O painel ainda não foi configurado pelo responsável pela instalação.",
        });
    if (!sessionToken(req))
      return res
        .status(401)
        .json({ error: "Sua sessão expirou. Entre novamente para continuar." });
    next();
  }

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/auth/session", (req, res) =>
    res.json({ authenticated: Boolean(sessionToken(req)), configured }),
  );
  app.post("/api/auth/login", requireOrigin, (req, res) => {
    if (!configured)
      return res
        .status(503)
        .json({
          error:
            "O painel ainda não foi configurado. Defina ADMIN_PASSWORD, SESSION_SECRET e APP_ORIGIN na instalação.",
        });
    const key = req.ip;
    const now = Date.now();
    if (attempts.size > 10000)
      for (const [ip, attempt] of attempts)
        if (attempt.resetAt <= now) attempts.delete(ip);
    const attempt = attempts.get(key) ?? {
      count: 0,
      resetAt: now + 15 * 60 * 1000,
    };
    if (attempt.resetAt <= now) {
      attempt.count = 0;
      attempt.resetAt = now + 15 * 60 * 1000;
    }
    if (attempt.count >= loginLimit)
      return res
        .set("Retry-After", String(Math.ceil((attempt.resetAt - now) / 1000)))
        .status(429)
        .json({
          error:
            "Muitas tentativas. Aguarde 15 minutos antes de tentar novamente.",
        });
    attempt.count += 1;
    attempts.set(key, attempt);
    const candidate = req.body?.password;
    if (
      typeof candidate !== "string" ||
      candidate.length > 1024 ||
      !equals(scryptSync(candidate, passwordSalt, 64), passwordHash)
    )
      return res
        .status(401)
        .json({ error: "Senha incorreta. Confira e tente novamente." });
    attempts.delete(key);
    db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);
    const token = randomBytes(32).toString("base64url");
    db.prepare("INSERT INTO sessions VALUES (?, ?)").run(
      hash(token),
      now + sessionTtlMs,
    );
    res.cookie(COOKIE, `${token}.${sign(token)}`, {
      ...cookieOptions,
      maxAge: sessionTtlMs,
    });
    res.json({ authenticated: true });
  });
  app.post("/api/auth/logout", requireOrigin, (req, res) => {
    const token = sessionToken(req);
    if (token)
      db.prepare("DELETE FROM sessions WHERE hash = ?").run(hash(token));
    res.clearCookie(COOKIE, cookieOptions).json({ authenticated: false });
  });
  app.get("/api/content", (_req, res) => {
    const row = db
      .prepare("SELECT published FROM documents WHERE id = 1")
      .get();
    res.json(JSON.parse(row.published));
  });
  app.get("/api/admin/content", requireAdmin, (_req, res) =>
    res.json(readDraft(db)),
  );
  app.put("/api/admin/content", requireOrigin, requireAdmin, (req, res) => {
    const version = validateVersion(req.body?.version);
    const content = validateContent(req.body?.content);
    const result = db
      .prepare(
        "UPDATE documents SET draft = ?, version = version + 1, updated_at = ? WHERE id = 1 AND version = ?",
      )
      .run(JSON.stringify(content), new Date().toISOString(), version);
    if (result.changes !== 1)
      return res
        .status(409)
        .json({
          error:
            "Outra pessoa alterou este conteúdo. Recarregue antes de salvar para não sobrescrever as alterações.",
          version: readDraft(db).version,
        });
    res.json(readDraft(db));
  });
  app.post("/api/admin/publish", requireOrigin, requireAdmin, (req, res) => {
    const version = validateVersion(req.body?.version);
    const result = db
      .prepare(
        "UPDATE documents SET published = draft, published_version = version, published_at = ? WHERE id = 1 AND version = ?",
      )
      .run(new Date().toISOString(), version);
    if (result.changes !== 1)
      return res
        .status(409)
        .json({
          error:
            "O rascunho foi atualizado. Recarregue e revise a versão mais recente antes de publicar.",
          version: readDraft(db).version,
        });
    res.json(readDraft(db));
  });
  app.get("/api/admin/media", requireAdmin, (_req, res) => {
    const rows = db
      .prepare(
        "SELECT id, url, name, size, mime_type AS mimeType, created_at AS createdAt FROM media ORDER BY created_at DESC",
      )
      .all();
    res.json({ items: rows });
  });
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024, files: 1, fields: 0, parts: 1 },
  });
  app.post(
    "/api/admin/media",
    requireOrigin,
    requireAdmin,
    upload.single("file"),
    (req, res) => {
      const file = req.file;
      if (!file)
        throw new ValidationError("Selecione uma imagem PNG, JPEG ou WebP.");
      const image = detectImage(file.buffer);
      if (!image || image.mime !== file.mimetype)
        throw new ValidationError(
          "Arquivo inválido. Envie uma imagem PNG, JPEG ou WebP (até 8 MB).",
        );
      const id = randomUUID();
      const filename = `${id}.${image.ext}`;
      const path = join(mediaDir, filename);
      const item = {
        id,
        url: `/media/${filename}`,
        name:
          basename(file.originalname)
            .replace(/\p{Cc}/gu, "")
            .slice(0, 180) || filename,
        size: file.size,
        mimeType: image.mime,
        createdAt: new Date().toISOString(),
      };
      writeFileSync(path, file.buffer, { flag: "wx", mode: 0o600 });
      try {
        db.prepare("INSERT INTO media VALUES (?, ?, ?, ?, ?, ?)").run(
          id,
          item.url,
          item.name,
          item.size,
          item.mimeType,
          item.createdAt,
        );
      } catch (error) {
        unlinkSync(path);
        throw error;
      }
      res.status(201).json(item);
    },
  );
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "Recurso não encontrado." }),
  );
  app.use(
    "/media",
    express.static(mediaDir, {
      dotfiles: "deny",
      fallthrough: false,
      immutable: true,
      maxAge: "1y",
      index: false,
    }),
  );
  if (staticDir && existsSync(join(staticDir, "index.html"))) {
    app.use(
      express.static(resolve(staticDir), {
        index: false,
        setHeaders: (res, path) => {
          if (path.includes("/assets/"))
            res.set("Cache-Control", "public, max-age=31536000, immutable");
        },
      }),
    );
    app.get("/{*path}", (_req, res) =>
      res
        .set("Cache-Control", "no-store")
        .sendFile(join(resolve(staticDir), "index.html")),
    );
  }
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof multer.MulterError)
      return res
        .status(400)
        .json({
          error:
            error.code === "LIMIT_FILE_SIZE"
              ? "A imagem deve ter até 8 MB."
              : "Envie uma única imagem PNG, JPEG ou WebP.",
        });
    if (error instanceof ValidationError)
      return res.status(400).json({ error: error.message });
    if (error.status === 400 || error.type === "entity.parse.failed")
      return res
        .status(400)
        .json({ error: "Solicitação inválida. Confira os dados enviados." });
    if (error.type === "entity.too.large")
      return res
        .status(413)
        .json({ error: "O conteúdo enviado excede o tamanho permitido." });
    if (error.status === 404)
      return res.status(404).json({ error: "Arquivo não encontrado." });
    console.error("Falha interna na API:", error.code ?? error.name ?? "Error");
    res
      .status(500)
      .json({
        error: "Não foi possível concluir a operação. Tente novamente.",
      });
  });
  return { app, db, configured, close: () => db.close() };
}
