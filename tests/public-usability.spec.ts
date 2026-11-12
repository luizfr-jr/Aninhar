import { test, expect } from "@playwright/test";

test("the first guide topic is visible without scrolling on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#home");
  const directory = page.getByRole("region", { name: "Todos os temas", exact: true });
  await expect(directory.getByRole("link").first()).toBeInViewport({ ratio: 1 });
  await expect(page.getByRole("searchbox", { name: "Buscar em todos os temas" })).toBeInViewport();
});

test("public pages share the original sans-serif typography and readable search field", async ({
  page,
}) => {
  for (const route of [
    "/#home",
    "/#topic/primeirosPassos",
    "/#search",
    "/#about",
    "/#contact",
  ]) {
    await page.goto(route);
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    const fonts = await heading.evaluate((element) => ({
      heading: getComputedStyle(element).fontFamily,
      body: getComputedStyle(document.documentElement).fontFamily,
    }));
    expect(fonts.heading).toBe(fonts.body);
    expect(fonts.heading).not.toMatch(/Georgia|Times New Roman/i);
    const searchFontSize = await page
      .getByRole("searchbox", { name: "Buscar em todos os temas" })
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(searchFontSize).toBeGreaterThanOrEqual(16);
  }
});

test("home provides direct access to all eleven topics", async ({ page }) => {
  await page.goto("/#home");
  await page
    .getByRole("link", { name: "Ver todos os temas", exact: true })
    .click();
  const directory = page.getByRole("region", {
    name: "Todos os temas",
    exact: true,
  });
  await expect(directory).toBeFocused();
  await expect(directory).toBeInViewport();
  await expect(directory.getByRole("link")).toHaveCount(11);
  await expect(directory.getByRole("link").first()).toHaveAccessibleName(
    "Primeiros Dias",
  );
  await directory.getByRole("link", { name: "Vacinas", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Vacinas", exact: true }),
  ).toBeVisible();
});

test("topic index opens on demand and repeated section links restore reading focus", async ({
  page,
}, testInfo) => {
  await page.goto("/#topic/primeirosPassos");
  const index = page
    .getByRole("navigation", { name: "Neste tema", exact: true })
    .locator("details");
  const summary = index.locator("summary");
  if (testInfo.project.name === "mobile") {
    await expect(index).not.toHaveAttribute("open", "");
    await summary.click();
  }
  await expect(index).toHaveAttribute("open", "");
  const sectionLink = index.getByRole("link", {
    name: /Certidão de Nascimento/,
  });
  const article = page.getByRole("article", {
    name: "Certidão de Nascimento",
    exact: true,
  });
  await sectionLink.click();
  await expect(article).toBeFocused();
  await expect(article).toBeInViewport();
  await expect(page).toHaveURL(
    /#topic\/primeirosPassos\/certidao-de-nascimento$/,
  );
  if (testInfo.project.name === "mobile")
    await expect(index).not.toHaveAttribute("open", "");

  await article
    .getByRole("button", { name: "Voltar ao índice", exact: true })
    .click();
  await expect(index).toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
  await expect(index).toBeInViewport();
  await sectionLink.click();
  await expect(article).toBeFocused();
  await expect(article).toBeInViewport();
});

test("copying a section link copies its shareable URL and confirms the action", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#topic/primeirosPassos");
  const article = page.getByRole("article", {
    name: "Certidão de Nascimento",
    exact: true,
  });
  await article
    .getByRole("button", {
      name: "Copiar link para Certidão de Nascimento",
      exact: true,
    })
    .click();
  await expect(page.getByRole("status")).toContainText("Link copiado");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  const url = new URL(copied);
  expect(url.hash).toBe("#topic/primeirosPassos/certidao-de-nascimento");
  expect(url.origin).toBe(new URL(page.url()).origin);
});

test("information and recovery pages offer useful working next steps", async ({
  page,
}) => {
  await page.goto("/#about");
  await expect(
    page.getByRole("heading", { level: 1, name: "Sobre o Aninhar" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explorar os primeiros dias", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Primeiros Dias",
      exact: true,
    }),
  ).toBeVisible();

  await page.goto("/#contact");
  await expect(
    page.getByRole("heading", {
      name: "Canal de contato ainda não disponível",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("main").getByRole("textbox")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Consultar primeiros cuidados", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Primeiros Dias",
      exact: true,
    }),
  ).toBeVisible();

  await page.goto("/#pagina-inexistente");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Página não encontrada",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Buscar conteúdo", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Buscar no Aninhar",
      exact: true,
    }),
  ).toBeVisible();
});
