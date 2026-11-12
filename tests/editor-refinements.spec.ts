import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { ContentDocument } from "../src/types/content";

const seed: ContentDocument = JSON.parse(readFileSync(new URL("../content/seed.json", import.meta.url), "utf8"));

async function mockWorkspace(page: Page) {
  let content = structuredClone(seed);
  let version = 1;
  let saves = 0;
  const state = () => ({ content, version, publishedVersion: 1, updatedAt: "2026-01-01T12:00:00Z", publishedAt: "2026-01-01T12:00:00Z" });
  await page.context().route("**/api/auth/session", (route) => route.fulfill({ json: { authenticated: true, configured: true } }));
  await page.context().route("**/api/content", (route) => route.fulfill({ json: seed }));
  await page.context().route("**/api/admin/content", (route) => {
    if (route.request().method() === "PUT") {
      content = route.request().postDataJSON().content;
      saves++;
      version++;
    }
    return route.fulfill({ json: state() });
  });
  await page.context().route("**/api/admin/media", (route) => route.fulfill({ json: { items: [] } }));
  return { saves: () => saves };
}

test("admin search finds body text and opens the exact section", async ({ page }) => {
  await mockWorkspace(page);
  await page.goto("/admin#topics");
  await page.getByRole("searchbox", { name: "Buscar temas e tópicos" }).fill("aréola");
  const link = page.getByRole("link", { name: "Editar tópico Pega e Posicionamento em Amamentação", exact: true });
  await expect(link).toBeVisible();
  await link.click();
  const section = page.locator("#edit-pega-e-posicionamento");
  await expect(section).toHaveAttribute("open", "");
  await expect(section.locator(":scope > summary")).toBeFocused();
  const otherSection = page.locator("#edit-o-inicio-da-amamentacao");
  await otherSection.locator(":scope > summary").click();
  await otherSection.locator("summary").filter({ hasText: "Imagem ilustrativa" }).click();
  await otherSection.getByRole("button", { name: "Abrir biblioteca", exact: true }).click();
  await page.getByRole("button", { name: "Voltar ao editor", exact: true }).click();
  await expect(page).toHaveURL(/#topic\/amamentacao\/o-inicio-da-amamentacao$/);
  await expect(otherSection.locator(":scope > summary")).toBeFocused();
});

test("hidden invalid sections reappear for correction without losing filtered editing", async ({ page }) => {
  const api = await mockWorkspace(page);
  await page.goto("/admin#topic/primeirosPassos");
  const section = page.locator("#edit-compromissos-da-primeira-semana");
  await section.locator(":scope > summary").click();
  const title = section.getByRole("textbox", { name: "Título do tópico", exact: true });
  await title.fill("");
  const filter = page.getByRole("searchbox", { name: "Buscar tópicos deste tema" });
  await filter.fill("certidao");
  await expect(section).not.toBeVisible();
  await expect(page.locator("#edit-certidao-de-nascimento")).toBeVisible();
  await page.getByRole("button", { name: "Salvar rascunho", exact: true }).click();
  await expect(filter).toBeEmpty();
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  expect(api.saves()).toBe(0);
});

test("adding and removing sections and references restores a useful keyboard position", async ({ page }) => {
  await mockWorkspace(page);
  await page.goto("/admin#topic/primeirosPassos");
  await page.getByRole("searchbox", { name: "Buscar tópicos deste tema" }).fill("sem resultado xyz");
  await page.getByRole("button", { name: "Adicionar tópico", exact: true }).click();
  const section = page.locator(".adm-section").last();
  const title = section.getByRole("textbox", { name: "Título do tópico", exact: true });
  await expect(title).toBeFocused();
  await title.fill("Nova orientação");
  await section.locator("summary").filter({ hasText: "Referências e leitura complementar" }).click();
  await section.getByRole("button", { name: "Adicionar referência", exact: true }).click();
  await expect(section.getByRole("textbox", { name: "Nome da referência 1", exact: true })).toBeFocused();
  await section.getByRole("button", { name: "Remover referência 1", exact: true }).click();
  await expect(section.getByRole("button", { name: "Adicionar referência", exact: true })).toBeFocused();
  page.once("dialog", (dialog) => dialog.accept());
  await section.getByRole("button", { name: "Remover tópico", exact: true }).click();
  await expect(page.locator(".adm-section").last().locator(":scope > summary")).toBeFocused();
});

test("institutional preview opens the selected page and keyboard shortcuts save the draft only", async ({ page }) => {
  const api = await mockWorkspace(page);
  await page.goto("/admin#pages");
  await page.getByRole("button", { name: "Contato", exact: true }).click();
  const preview = page.getByRole("button", { name: "Ver prévia da página", exact: true });
  const popupPromise = page.waitForEvent("popup");
  await preview.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\?preview=1#contact$/);
  await expect(popup.getByRole("heading", { level: 1 })).toHaveText(seed.pages.contact.title);
  await popup.close();
  await page.getByRole("textbox", { name: "Apresentação", exact: true }).fill("Contato revisado no rascunho.");
  await expect(preview).toBeDisabled();
  await page.keyboard.press("Control+s");
  await expect(page.getByText("Rascunho salvo. Revise a prévia e publique quando estiver pronto.", { exact: true })).toBeVisible();
  expect(api.saves()).toBe(1);
  await expect(preview).toBeEnabled();
  await page.getByRole("textbox", { name: "Apresentação", exact: true }).fill("Segunda revisão.");
  await page.keyboard.press("Meta+s");
  await expect(preview).toBeEnabled();
  expect(api.saves()).toBe(2);
  await expect(page.getByRole("button", { name: "Publicar", exact: true })).toBeEnabled();
});

test("public matches preserve accented text and highlight search results", async ({ page }) => {
  await page.goto("/#search?q=certidao");
  const result = page.getByRole("link").filter({ has: page.getByRole("heading", { name: "Certidão de Nascimento", exact: true }) });
  await expect(result).toBeVisible();
  await expect(result.locator("mark").first()).toHaveText("Certidão");
  await result.click();
  await expect(page.getByRole("article", { name: "Certidão de Nascimento", exact: true })).toBeFocused();
});

test("filtering a public index keeps the complete article and original section number", async ({ page }) => {
  await page.goto("/#topic/primeirosPassos");
  const index = page.getByRole("navigation", { name: "Neste tema", exact: true });
  const details = index.locator("details");
  if ((await details.getAttribute("open")) === null) await details.locator("summary").click();
  const filter = page.getByRole("searchbox", { name: "Encontrar neste tema", exact: true });
  await filter.fill("certidao");
  await expect(index.getByRole("link")).toHaveCount(1);
  await expect(index.getByRole("link")).toContainText("05");
  await expect(page.getByRole("article")).toHaveCount(7);
  await filter.fill("sem resultado xyz");
  await page.getByRole("button", { name: "Ver todos os tópicos", exact: true }).click();
  await expect(index.getByRole("link")).toHaveCount(7);
});
