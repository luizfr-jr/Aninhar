import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
const seed = JSON.parse(
  readFileSync(new URL("../content/seed.json", import.meta.url), "utf8"),
);
import type { ContentDocument } from "../src/types/content";

function documentFixture(): ContentDocument {
  return structuredClone(seed);
}

async function servePublished(page: Page, content: ContentDocument) {
  await page.route("**/api/content", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(content),
    }),
  );
}

test("published API content drives topics, articles, institutional pages and search", async ({
  page,
}) => {
  const content = documentFixture();
  content.topics[0].name = "Tema revisado para famílias";
  content.topics[0].title = "Tema revisado para famílias";
  content.topics[0].sections[0].title = "Orientação publicada";
  content.topics[0].sections[0].text =
    "Este cuidado-publicado-xyz veio do documento publicado pela API.";
  content.pages.about.title = "Conheça a equipe do projeto";
  content.pages.about.intro =
    "Apresentação institucional atualizada pela equipe.";
  await servePublished(page, content);
  await page.goto("/#topic/primeirosPassos");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Tema revisado para famílias",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("article", { name: "Orientação publicada", exact: true }),
  ).toContainText("cuidado-publicado-xyz");
  await page
    .getByRole("searchbox", { name: "Buscar em todos os temas" })
    .fill("cuidado-publicado-xyz");
  const result = page.getByRole("link").filter({
    has: page.getByRole("heading", {
      name: "Orientação publicada",
      exact: true,
    }),
  });
  await expect(result).toBeVisible();
  await result.click();
  await expect(
    page.getByRole("article", { name: "Orientação publicada", exact: true }),
  ).toBeFocused();
  await page.goto("/#about");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Conheça a equipe do projeto",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toContainText(
    "Apresentação institucional atualizada pela equipe.",
  );
});

test("an empty catalog keeps the home usable without links to deleted topics", async ({
  page,
}) => {
  const content = documentFixture();
  content.topics = [];
  await servePublished(page, content);
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Estamos preparando novos conteúdos",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('a[href^="#topic/"]')).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Ver todos os temas", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Buscar em todos os temas" })
    .fill("banho");
  await expect(page.getByRole("status")).toContainText("0 resultados");
});

test("a topic without sections offers a preparation state and recovery navigation", async ({
  page,
}) => {
  const content = documentFixture();
  content.topics[0].sections = [];
  await servePublished(page, content);
  await page.goto("/#topic/primeirosPassos");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Primeiros Dias",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Conteúdo em preparação", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Neste tema", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("link", { name: "Ver outros temas", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Ver todos os temas", exact: true }),
  ).toBeVisible();
});

test("unauthenticated preview does not expose seeded or draft content", async ({
  page,
}) => {
  let publishedCalls = 0;
  await page.route("**/api/content", (route) => {
    publishedCalls++;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(documentFixture()),
    });
  });
  await page.route("**/api/admin/content", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "Authentication required" }),
    }),
  );
  await page.goto("/?preview=1#topic/primeirosPassos");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Entre para visualizar a prévia",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ir para a administração", exact: true }),
  ).toHaveAttribute("href", "/admin");
  await expect(
    page.getByRole("heading", { name: "Primeiros Dias", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("article")).toHaveCount(0);
  expect(publishedCalls).toBe(0);
});

test("authenticated preview renders the draft envelope and identifies unpublished content", async ({
  page,
}) => {
  const draft = documentFixture();
  draft.topics[0].name = "Título em revisão";
  let publishedCalls = 0;
  await page.route("**/api/content", (route) => {
    publishedCalls++;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(documentFixture()),
    });
  });
  await page.route("**/api/admin/content", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ content: draft, version: 3, publishedVersion: 2 }),
    }),
  );
  await page.goto("/?preview=1#topic/primeirosPassos");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Título em revisão",
      exact: true,
    }),
  ).toBeVisible();
  const banner = page.getByRole("complementary", {
    name: "Prévia administrativa",
    exact: true,
  });
  await expect(banner).toContainText("Prévia do rascunho");
  await expect(
    banner.getByRole("link", { name: "Voltar à administração", exact: true }),
  ).toHaveAttribute("href", "/admin");
  expect(publishedCalls).toBe(0);
});

test("server errors stay visible instead of falling back to seed and retry recovers", async ({
  page,
}) => {
  let attempts = 0;
  let recovered = false;
  await page.route("**/api/content", (route) => {
    attempts++;
    return route.fulfill({
      status: recovered ? 200 : 500,
      contentType: "application/json",
      body: JSON.stringify(
        recovered ? documentFixture() : { error: "Storage unavailable" },
      ),
    });
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Conteúdo temporariamente indisponível",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Ver todos os temas", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("alert")).toBeVisible();
  recovered = true;
  await page
    .getByRole("button", { name: "Tentar novamente", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Ver todos os temas", exact: true }),
  ).toBeVisible();
  expect(attempts).toBeGreaterThanOrEqual(2);
});
