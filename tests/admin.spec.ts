import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { ContentDocument } from "../src/types/content";

async function login(page: Page) {
  await page.goto("/admin");
  await page.getByLabel("Senha de acesso").fill("Aninhar-test-only-52!");
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu conteúdo, organizado" }),
  ).toBeVisible();
}

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
}

test("admin screens are readable, accessible, responsive and support keyboard navigation", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Administração do Aninhar" }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await login(page);
  for (const [route, title] of [
    ["overview", "Seu conteúdo, organizado"],
    ["topics", "Temas e conteúdos"],
    ["media", "Biblioteca de imagens"],
    ["pages", "Páginas do site"],
    ["topic/primeirosPassos", "Primeiros Dias"],
  ]) {
    await page.goto(`/admin#${route}`);
    await expect(
      page.getByRole("heading", { level: 1, name: title, exact: true }),
    ).toBeVisible();
    await noOverflow(page);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
  const toggle = page.getByRole("button", {
    name: "Abrir menu administrativo",
  });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(
      page.getByRole("dialog", { name: "Menu administrativo" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Fechar menu administrativo" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page
      .getByRole("link", { name: "Páginas do site", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Páginas do site", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("dialog", { name: "Menu administrativo" }),
    ).not.toBeVisible();
  }
});

test("draft editing, reload, authenticated preview and publication use persistent API data", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Mutations run once against the shared disposable database.",
  );
  await page.goto("/admin");
  await page.getByLabel("Senha de acesso").fill("senha-incorreta");
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.getByRole("alert")).toContainText("Senha incorreta");
  await page.getByLabel("Senha de acesso").fill("Aninhar-test-only-52!");
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu conteúdo, organizado" }),
  ).toBeVisible();
  const initial: ContentDocument = await (
    await page.request.get("/api/content")
  ).json();
  const origin = new URL(page.url()).origin;
  try {
    await page
      .getByRole("link", { name: "Temas e conteúdos", exact: true })
      .click();
    await page.getByRole("button", { name: "Novo tema", exact: true }).click();
    await page.getByLabel("Nome no menu").fill("Guia de teste automatizado");
    await page.getByLabel("Título completo").fill("Guia de teste automatizado");
    await page
      .getByLabel("Descrição breve")
      .fill("Rascunho para testar o fluxo editorial.");
    await page
      .getByRole("button", { name: "Adicionar tópico", exact: true })
      .click();
    await page
      .getByLabel("Título do tópico", { exact: false })
      .fill("Orientação de teste");
    await page
      .getByLabel("Texto completo", { exact: false })
      .fill(
        "Este texto foi criado em uma base temporária para testar edição e prévia.",
      );
    await page
      .getByRole("button", { name: "Salvar rascunho", exact: true })
      .click();
    await expect(
      page.getByText(
        "Rascunho salvo. Revise a prévia e publique quando estiver pronto.",
      ),
    ).toBeVisible();
    const draft = await (await page.request.get("/api/admin/content")).json();
    const created = draft.content.topics.find(
      (topic: { name: string }) => topic.name === "Guia de teste automatizado",
    );
    expect(created).toBeTruthy();
    const published = await (await page.request.get("/api/content")).json();
    expect(
      published.topics.some((topic: { id: string }) => topic.id === created.id),
    ).toBe(false);
    await page.reload();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Guia de teste automatizado",
      }),
    ).toBeVisible();
    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Ver prévia" }).click();
    const popup = await popupPromise;
    await expect(
      popup.getByRole("heading", {
        level: 1,
        name: "Guia de teste automatizado",
      }),
    ).toBeVisible();
    await expect(
      popup.getByRole("complementary", { name: "Prévia administrativa" }),
    ).toContainText("Prévia do rascunho");
    await expect(popup.getByRole("article")).toContainText("base temporária");
    await popup.close();
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("button", { name: "Remover tema", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Salvar rascunho", exact: true })
      .click();
    await expect(
      page.getByText(
        "Rascunho salvo. Revise a prévia e publique quando estiver pronto.",
      ),
    ).toBeVisible();
    await page.goto("/admin#topic/primeirosPassos");
    await page
      .getByLabel("Descrição breve")
      .fill(initial.topics[0].description + " Revisão de interface.");
    await page
      .getByRole("button", { name: "Salvar rascunho", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Publicar", exact: true }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "Publicar", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Publicar esta versão?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Publicar agora" }).click();
    await expect(
      page.getByText(
        "Conteúdo publicado. As alterações já estão disponíveis no site público.",
      ),
    ).toBeVisible();
    const live = await (await page.request.get("/api/content")).json();
    expect(live.topics[0].description).toContain("Revisão de interface.");
  } finally {
    const current = await (await page.request.get("/api/admin/content")).json();
    const saved = await page.request.put("/api/admin/content", {
      headers: { Origin: origin },
      data: { content: initial, version: current.version },
    });
    const state = await saved.json();
    await page.request.post("/api/admin/publish", {
      headers: { Origin: origin },
      data: { version: state.version },
    });
  }
});

test("media library uploads real image files and offers their persistent URL", async ({
  page,
}) => {
  await login(page);
  await page.goto("/admin#media");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aOioAAAAASUVORK5CYII=",
    "base64",
  );
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: `ilustracao-${Date.now()}.png`,
      mimeType: "image/png",
      buffer: png,
    });
  await expect(
    page.getByText(
      "Imagem enviada. Copie o endereço e use-o no tópico desejado.",
    ),
  ).toBeVisible();
  const card = page.locator(".adm-media-card").first();
  await expect(card.getByRole("img")).toBeVisible();
  const url = await card
    .getByLabel("Endereço para usar no conteúdo")
    .inputValue();
  expect(url).toMatch(/^\/media\/[a-f0-9-]+\.png$/);
  expect((await page.request.get(url)).ok()).toBe(true);
});
