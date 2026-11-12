import { test, expect, type Page } from "@playwright/test";

async function enterEditor(page: Page) {
  await page.goto("/admin");
  await page.getByLabel("Senha de acesso").fill("Aninhar-test-only-52!");
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.getByRole("heading", { name: "Seu conteúdo, organizado" })).toBeVisible();
  await page.goto("/admin#topic/primeirosPassos");
  await expect(page.getByRole("textbox", { name: "Nome no menu", exact: true })).toBeVisible();
}

test("reading size stays comfortable across topics and reloads without changing content", async ({ page }) => {
  await page.goto("/#topic/primeirosPassos");
  const paragraph = page.getByRole("article").first().locator(".article-body > p").first();
  const originalText = await paragraph.textContent();
  const standard = page.getByRole("button", { name: "Texto padrão", exact: true });
  const larger = page.getByRole("button", { name: "Texto maior", exact: true });
  await expect(standard).toHaveAttribute("aria-pressed", "true");
  await larger.click();
  await expect(larger).toHaveAttribute("aria-pressed", "true");
  await expect(paragraph).toHaveCSS("font-size", "20px");
  await expect(paragraph).toHaveText(originalText!);
  await page.goto("/#topic/sono");
  await expect(larger).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(larger).toHaveAttribute("aria-pressed", "true");
  await standard.click();
  await expect(page.getByRole("article").first().locator(".article-body > p").first()).toHaveCSS("font-size", "16px");
});

test("corrupt reading preference never blocks the guide and largest text reflows on compact phones", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("aninhar:reading:v1", "{broken"));
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/#topic/primeirosPassos");
  await expect(page.getByRole("button", { name: "Texto padrão", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Texto maior", exact: true }).click();
  await expect(page.getByRole("article").first().locator(".article-body > p").first()).toHaveCSS("font-size", "20px");
  const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("a failed copy after a success gives accurate feedback beside the article", async ({ page }) => {
  await page.addInitScript(() => {
    let attempts = 0;
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: async () => { if (++attempts > 1) throw new Error("Clipboard denied"); },
    } });
  });
  await page.goto("/#topic/primeirosPassos");
  const article = page.getByRole("article").first();
  const copy = article.getByRole("button", { name: /^Copiar link para/ });
  await copy.click();
  await expect(copy).toHaveText("Link copiado");
  await copy.click();
  await expect(copy).toHaveText("Copiar link");
  await expect(article).toContainText("Não foi possível copiar");
});

test("unsaved work stays clearly identified on overview and validation returns to its hidden field", async ({ page }) => {
  await enterEditor(page);
  await page.getByRole("textbox", { name: "Título completo", exact: true }).fill("");
  await page.goto("/admin#overview");
  await expect(page.getByRole("heading", { name: "Há alterações para salvar", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "O site está atualizado", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Salvar rascunho", exact: true }).click();
  await expect(page).toHaveURL(/#topic\/primeirosPassos/);
  const title = page.getByRole("textbox", { name: "Título completo", exact: true });
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await expect(title).toHaveAccessibleDescription(/Preencha este campo/);
  await title.fill("Primeiros Dias — Guia do Recém-Nascido");
  await expect(title).not.toHaveAttribute("aria-invalid", "true");
});

test("adding an editorial section focuses its required input and expanded forms reflow", async ({ page }) => {
  await enterEditor(page);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole("button", { name: "Adicionar tópico", exact: true }).click();
  const title = page.getByLabel("Título do tópico", { exact: false }).last();
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("required", "");
  await title.fill("Nova orientação de teste");
  await page.getByRole("button", { name: "Salvar rascunho", exact: true }).click();
  const text = page.getByLabel("Texto completo", { exact: false }).last();
  await expect(text).toBeFocused();
  await expect(text).toHaveAttribute("aria-invalid", "true");
  await expect(text).toHaveAccessibleDescription(/Preencha este campo/);
  const dimensions = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("selecting an image returns to the same section and unsafe URLs are corrected before saving", async ({ page }) => {
  await enterEditor(page);
  await page.route("**/api/admin/media", (route) => route.fulfill({ json: { items: [{
    id: "aabbcc", url: "/media/aabbcc.png", name: "Ilustração de teste.png",
    size: 100, mimeType: "image/png", createdAt: "2026-01-01T12:00:00Z",
  }] } }));
  let writes = 0;
  await page.route("**/api/admin/content", (route) => {
    if (route.request().method() === "PUT") {
      writes++;
      return route.fulfill({ status: 500, json: { error: "Unexpected write" } });
    }
    return route.continue();
  });
  const section = page.locator("#edit-compromissos-da-primeira-semana");
  await section.locator(":scope > summary").click();
  await section.locator("summary").filter({ hasText: "Imagem ilustrativa" }).click();
  await section.getByRole("button", { name: "Abrir biblioteca", exact: true }).click();
  await page.getByRole("button", { name: "Usar imagem neste tópico", exact: true }).click();
  await expect(section).toHaveAttribute("open", "");
  await expect(section.locator(":scope > summary")).toBeFocused();
  const image = section.getByRole("textbox", { name: "Endereço da imagem", exact: true });
  await expect(image).toHaveValue("/media/aabbcc.png");
  await section.getByRole("textbox", { name: "Descrição da imagem para acessibilidade", exact: true }).fill("Ilustração para testar a seleção.");
  await image.fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Salvar rascunho", exact: true }).click();
  await expect(image).toBeFocused();
  await expect(image).toHaveAttribute("aria-invalid", "true");
  expect(writes).toBe(0);
});

test("validation finds a contact error after switching away from institutional pages", async ({ page }) => {
  await enterEditor(page);
  await page.goto("/admin#pages");
  await page.getByRole("button", { name: "Contato", exact: true }).click();
  await page.getByRole("textbox", { name: "E-mail de contato", exact: true }).fill("equipe@dominio");
  await page.goto("/admin#overview");
  await page.getByRole("button", { name: "Salvar rascunho", exact: true }).click();
  await expect(page).toHaveURL(/#pages$/);
  const email = page.getByRole("textbox", { name: "E-mail de contato", exact: true });
  await expect(email).toHaveValue("equipe@dominio");
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  const title = page.getByRole("textbox", { name: "Título da página", exact: true });
  await title.fill("");
  await title.blur();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Sobre o Aninhar", exact: true }).click();
  await expect(title).not.toBeEmpty();
  await expect(title).not.toHaveAttribute("aria-invalid", "true");
});
