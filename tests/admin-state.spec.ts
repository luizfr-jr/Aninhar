import { test, expect, type Page } from "@playwright/test";

async function openEditor(page: Page) {
  await page.goto("/admin");
  await page.getByLabel("Senha de acesso").fill("Aninhar-test-only-52!");
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(
    page.getByRole("heading", { name: "Seu conteúdo, organizado" }),
  ).toBeVisible();
  await page.goto("/admin#topic/primeirosPassos");
  await expect(page.getByLabel("Descrição breve")).toBeVisible();
}

test("session expiry preserves unsaved writing when the editor signs in again", async ({
  page,
}) => {
  await openEditor(page);
  const text = "Descrição que ainda não foi salva e deve ser recuperada.";
  await page.getByLabel("Descrição breve").fill(text);
  await page.route("**/api/admin/content", (route) =>
    route.request().method() === "PUT"
      ? route.fulfill({ status: 401, json: { error: "Sua sessão expirou." } })
      : route.continue(),
  );
  await page
    .getByRole("button", { name: "Salvar rascunho", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Administração do Aninhar" }),
  ).toBeVisible();
  await page.unroute("**/api/admin/content");
  await page.getByLabel("Senha de acesso").fill("Aninhar-test-only-52!");
  await page.getByRole("button", { name: "Entrar no painel" }).click();
  await expect(page.getByLabel("Descrição breve")).toHaveValue(text);
  await expect(
    page.getByRole("button", { name: "Salvar rascunho", exact: true }),
  ).toBeEnabled();
});

test("version conflicts keep local changes until the editor explicitly discards them", async ({
  page,
}) => {
  await openEditor(page);
  await page.getByLabel("Descrição breve").fill("Edição local em conflito.");
  await page.route("**/api/admin/content", (route) =>
    route.request().method() === "PUT"
      ? route.fulfill({
          status: 409,
          json: {
            error:
              "Outra pessoa alterou este conteúdo. Recarregue antes de salvar.",
          },
        })
      : route.continue(),
  );
  await page
    .getByRole("button", { name: "Salvar rascunho", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Outra pessoa alterou");
  await expect(page.getByLabel("Descrição breve")).toHaveValue(
    "Edição local em conflito.",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Recarregar versão atual" }).click();
  await expect(page.getByLabel("Descrição breve")).not.toHaveValue("Edição local em conflito.");
});

test("administration fits compact phones and wide screens", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "The viewport matrix runs once.");
  await openEditor(page);
  for (const width of [320, 375, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "overview",
      "topics",
      "topic/primeirosPassos",
      "media",
      "pages",
    ]) {
      await page.goto(`/admin#${route}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  }
});
