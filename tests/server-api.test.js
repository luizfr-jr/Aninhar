import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/app.js";

const password = "test-password-local-only";
const secret = "test-secret-for-isolated-api-tests-123456";
const seed = {
  topics: [
    {
      id: "primeirosPassos",
      name: "Primeiros Dias",
      title: "Primeiros Dias",
      description: "Cuidados iniciais",
      sections: [
        {
          id: "consulta",
          title: "Primeira consulta",
          text: "Texto de orientação.",
          links: [],
        },
      ],
    },
  ],
  pages: {
    about: { title: "Sobre", intro: "O projeto", sections: [] },
    contact: {
      title: "Contato",
      intro: "",
      sections: [],
      email: "contato@example.org",
    },
  },
};
const cleanups = [];
after(() => {
  for (const path of cleanups) rmSync(path, { recursive: true, force: true });
});

async function setup(options = {}) {
  const dir = mkdtempSync(join(tmpdir(), "aninhar-api-"));
  cleanups.push(dir);
  const seedFile = join(dir, "seed.json");
  writeFileSync(seedFile, JSON.stringify(seed));
  const instance = createApp({
    dataDir: dir,
    seedFile,
    password,
    sessionSecret: secret,
    ...options,
  });
  const server = await new Promise((resolve) => {
    const server = instance.app.listen(0, "127.0.0.1", () => resolve(server));
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  let cookie = "";
  async function request(path, options = {}) {
    const response = await fetch(origin + path, {
      ...options,
      headers: {
        Origin: origin,
        ...(cookie ? { Cookie: cookie } : {}),
        ...options.headers,
      },
    });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) cookie = setCookie.split(";")[0];
    return response;
  }
  const json = (method, body) => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  async function login() {
    const response = await request(
      "/api/auth/login",
      json("POST", { password }),
    );
    assert.equal(response.status, 200);
    return response;
  }
  async function close() {
    await new Promise((resolve) => server.close(resolve));
    instance.close();
  }
  return {
    dir,
    instance,
    request,
    json,
    login,
    close,
    getCookie: () => cookie,
    origin,
  };
}

test("public content stays available when the admin is not configured", async () => {
  const api = await setup({ password: undefined, sessionSecret: undefined });
  try {
    assert.deepEqual(await (await api.request("/api/content")).json(), seed);
    assert.deepEqual(await (await api.request("/api/auth/session")).json(), {
      authenticated: false,
      configured: false,
    });
    assert.equal(
      (await api.request("/api/auth/login", api.json("POST", { password })))
        .status,
      503,
    );
    assert.equal((await api.request("/api/admin/content")).status, 503);
  } finally {
    await api.close();
  }
});

test("authentication, same-origin protection and logout are enforced", async () => {
  const api = await setup();
  try {
    assert.equal((await api.request("/api/admin/content")).status, 401);
    assert.equal(
      (
        await api.request(
          "/api/auth/login",
          api.json("POST", { password: "wrong" }),
        )
      ).status,
      401,
    );
    const crossSite = await api.request("/api/auth/login", {
      ...api.json("POST", { password }),
      headers: {
        "Content-Type": "application/json",
        Origin: "https://evil.example",
      },
    });
    assert.equal(crossSite.status, 403);
    const login = await api.login();
    assert.match(login.headers.get("set-cookie"), /HttpOnly/i);
    assert.match(login.headers.get("set-cookie"), /SameSite=Strict/i);
    assert.deepEqual(await (await api.request("/api/auth/session")).json(), {
      authenticated: true,
      configured: true,
    });
    assert.equal((await api.request("/api/admin/content")).status, 200);
    assert.equal(
      (await api.request("/api/auth/logout", { method: "POST" })).status,
      200,
    );
    assert.equal((await api.request("/api/admin/content")).status, 401);
  } finally {
    await api.close();
  }
});

test("save keeps draft private, rejects stale versions, and publish persists its snapshot", async () => {
  const api = await setup();
  try {
    await api.login();
    const draft = structuredClone(seed);
    draft.topics[0].name = "Primeiros Dias revisados";
    const saved = await api.request(
      "/api/admin/content",
      api.json("PUT", { content: draft, version: 1 }),
    );
    assert.equal(saved.status, 200);
    assert.equal((await saved.json()).version, 2);
    assert.deepEqual(await (await api.request("/api/content")).json(), seed);
    assert.equal(
      (
        await api.request(
          "/api/admin/content",
          api.json("PUT", { content: seed, version: 1 }),
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await api.request(
          "/api/admin/publish",
          api.json("POST", { version: 1 }),
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await api.request(
          "/api/admin/publish",
          api.json("POST", { version: 2 }),
        )
      ).status,
      200,
    );
    assert.deepEqual(await (await api.request("/api/content")).json(), draft);
    const sql = readFileSync(join(api.dir, "aninhar.sqlite")).toString();
    assert.ok(!sql.includes(password));
    assert.ok(!sql.includes(api.getCookie().split("=")[1]));
  } finally {
    await api.close();
  }
});

test("validation rejects malformed content and unsafe media URLs without changing draft", async () => {
  const api = await setup();
  try {
    await api.login();
    for (const mutate of [
      (doc) => doc.topics.push(doc.topics[0]),
      (doc) => {
        doc.topics[0].id = "../escape";
      },
      (doc) => {
        doc.topics[0].sections[0].links = [
          { label: "Link", url: "javascript:alert(1)" },
        ];
      },
      (doc) => {
        doc.topics[0].sections[0].video = {
          title: "Vídeo",
          url: "https://youtube.com.evil.example/watch?v=abcdefghijk",
        };
      },
      (doc) => {
        doc.topics[0].sections[0].image = { src: "/etc/passwd", alt: "Imagem" };
      },
      (doc) => {
        doc.pages.contact.email = "invalid";
      },
    ]) {
      const doc = structuredClone(seed);
      mutate(doc);
      assert.equal(
        (
          await api.request(
            "/api/admin/content",
            api.json("PUT", { content: doc, version: 1 }),
          )
        ).status,
        400,
      );
    }
    assert.equal(
      (await (await api.request("/api/admin/content")).json()).version,
      1,
    );
  } finally {
    await api.close();
  }
});

test("uploads require authentication, reject fake images, and persist safe files", async () => {
  const api = await setup();
  try {
    const upload = async (bytes, type, name) => {
      const data = new FormData();
      data.append("file", new Blob([bytes], { type }), name);
      return api.request("/api/admin/media", { method: "POST", body: data });
    };
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
      "base64",
    );
    assert.equal((await upload(png, "image/png", "ok.png")).status, 401);
    await api.login();
    assert.equal(
      (await upload("<svg/>", "image/svg+xml", "bad.svg")).status,
      400,
    );
    assert.equal(
      (await upload("<script>bad()</script>", "image/png", "fake.png")).status,
      400,
    );
    const result = await upload(png, "image/png", "tiny.png");
    assert.equal(result.status, 201);
    const item = await result.json();
    assert.match(item.url, /^\/media\/[a-f0-9-]+\.png$/);
    assert.equal(item.name, "tiny.png");
    const image = await api.request(item.url);
    assert.equal(image.status, 200);
    assert.equal(image.headers.get("content-type"), "image/png");
    assert.equal(image.headers.get("x-content-type-options"), "nosniff");
    assert.deepEqual(Buffer.from(await image.arrayBuffer()), png);
    assert.equal(
      (await (await api.request("/api/admin/media")).json()).items.length,
      1,
    );
  } finally {
    await api.close();
  }
});

test("login throttles repeated failures and sessions expire", async () => {
  const limited = await setup({ loginLimit: 2 });
  try {
    for (let i = 0; i < 2; i++)
      assert.equal(
        (
          await limited.request(
            "/api/auth/login",
            limited.json("POST", { password: "wrong" }),
          )
        ).status,
        401,
      );
    const response = await limited.request(
      "/api/auth/login",
      limited.json("POST", { password }),
    );
    assert.equal(response.status, 429);
    assert.ok(response.headers.has("retry-after"));
  } finally {
    await limited.close();
  }
  const api = await setup({ sessionTtlMs: 1 });
  try {
    await api.login();
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal((await api.request("/api/admin/content")).status, 401);
  } finally {
    await api.close();
  }
});

test("draft and session survive reopening the SQLite database", async () => {
  const api = await setup();
  await api.login();
  const doc = structuredClone(seed);
  doc.pages.about.intro = "Rascunho persistido";
  assert.equal(
    (
      await api.request(
        "/api/admin/content",
        api.json("PUT", { content: doc, version: 1 }),
      )
    ).status,
    200,
  );
  await api.close();
  const reopened = createApp({
    dataDir: api.dir,
    seedFile: join(api.dir, "seed.json"),
    password,
    sessionSecret: secret,
  });
  try {
    const row = reopened.db
      .prepare("SELECT draft, published, version FROM documents WHERE id = 1")
      .get();
    assert.equal(row.version, 2);
    assert.equal(
      JSON.parse(row.draft).pages.about.intro,
      "Rascunho persistido",
    );
    assert.deepEqual(JSON.parse(row.published), seed);
    assert.equal(
      reopened.db.prepare("SELECT COUNT(*) AS count FROM sessions").get().count,
      1,
    );
  } finally {
    reopened.close();
  }
});

test("upload enforces the size limit and mutations reject missing Origin", async () => {
  const api = await setup();
  try {
    await api.login();
    const form = new FormData();
    form.append(
      "file",
      new Blob([new Uint8Array(8 * 1024 * 1024 + 1)], { type: "image/png" }),
      "oversized.png",
    );
    assert.equal(
      (await api.request("/api/admin/media", { method: "POST", body: form }))
        .status,
      400,
    );
    const response = await fetch(api.origin + "/api/admin/publish", {
      ...api.json("POST", { version: 1 }),
      headers: { "Content-Type": "application/json", Cookie: api.getCookie() },
    });
    assert.equal(response.status, 403);
  } finally {
    await api.close();
  }
});

test("trusted proxy IPs keep different clients' login limits separate", async () => {
  const api = await setup({ loginLimit: 2, trustedProxy: "127.0.0.1, ::1" });
  const attempt = (ip, value = "wrong") =>
    api.request("/api/auth/login", {
      ...api.json("POST", { password: value }),
      headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
    });
  try {
    assert.equal((await attempt("203.0.113.10")).status, 401);
    assert.equal((await attempt("203.0.113.10")).status, 401);
    assert.equal((await attempt("203.0.113.10", password)).status, 429);
    assert.equal((await attempt("203.0.113.20")).status, 401);
    assert.equal((await attempt("203.0.113.20", password)).status, 200);
  } finally {
    await api.close();
  }
});

test("untrusted forwarding headers cannot bypass the direct client's limit", async () => {
  for (const trustedProxy of [undefined, "198.51.100.1/32"]) {
    const api = await setup({ loginLimit: 2, trustedProxy });
    const attempt = (ip) =>
      api.request("/api/auth/login", {
        ...api.json("POST", { password: "wrong" }),
        headers: { "Content-Type": "application/json", "X-Forwarded-For": ip },
      });
    try {
      assert.equal((await attempt("203.0.113.10")).status, 401);
      assert.equal((await attempt("203.0.113.20")).status, 401);
      assert.equal((await attempt("203.0.113.30")).status, 429);
    } finally {
      await api.close();
    }
  }
});

test("proxy configuration accepts explicit IPs/CIDRs and rejects blanket trust", async () => {
  const { parseTrustedProxy } = await import("../server/trusted-proxy.js");
  assert.deepEqual(parseTrustedProxy(), []);
  assert.deepEqual(
    parseTrustedProxy("127.0.0.1, 10.20.30.0/24, ::1, 2001:db8::/64"),
    ["127.0.0.1", "10.20.30.0/24", "::1", "2001:db8::/64"],
  );
  for (const invalid of [
    true,
    1,
    "true",
    "1",
    "loopback",
    "localhost",
    "0.0.0.0/0",
    "::/0",
    "127.0.0.1/33",
    "::1/129",
    "10.1.2.3/24/32",
    "10.1.2.3/nope",
  ]) {
    assert.throws(() => parseTrustedProxy(invalid), /TRUST_PROXY/);
  }
});
