import { test, expect, type Page } from "@playwright/test";

const topicNames = [
  "Primeiros Dias",
  "Amamentação",
  "Introdução Alimentar",
  "Sono",
  "Desenvolvimento",
  "Vacinas",
  "Saúde e Doenças",
  "Cuidando dos Pais",
  "Higiene e Cuidados Diários",
  "Segurança e Prevenção de Acidentes",
  "Licenças Maternidade e Paternidade",
];

async function openNavigation(page: Page) {
  const toggle = page.getByRole("button", { name: "Abrir menu de temas" });
  if (await toggle.isVisible()) await toggle.click();
  return page.getByRole("navigation", { name: "Navegação principal" });
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test("all 11 themes open their full content from the navigation", async ({
  page,
}) => {
  await page.goto("/");
  let navigation = await openNavigation(page);
  const links = navigation.locator('a[href^="#topic/"]');
  await expect(links).toHaveCount(11);
  await expect(links.first()).toContainText("Primeiros Dias");

  for (const [index, name] of topicNames.entries()) {
    if (index > 0) navigation = await openNavigation(page);
    await navigation
      .getByRole("link", { name: new RegExp(`^${name}`) })
      .click();
    await expect(
      page.getByRole("heading", { level: 1, name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Neste tema" }),
    ).toBeVisible();
    const articles = page.getByRole("article");
    expect(await articles.count()).toBeGreaterThan(0);
    expect((await articles.first().innerText()).length).toBeGreaterThan(100);
    await expect(
      page.getByRole("dialog", { name: "Menu de temas" }),
    ).not.toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("accent-insensitive search opens the exact section and survives history and reload", async ({
  page,
}) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", {
    name: "Buscar em todos os temas",
  });
  await search.fill("  AMAMENTACAO  ");
  await expect(
    page.getByRole("heading", { name: "Buscar no Aninhar" }),
  ).toBeVisible();
  const firstSection = page.getByRole("link").filter({
    has: page.getByRole("heading", {
      name: "O Início da Amamentação",
      exact: true,
    }),
  });
  await expect(page).toHaveURL(/#search\?q=/);
  await page.reload();
  await expect(search).toHaveValue("  AMAMENTACAO  ");
  await expect(firstSection).toBeVisible();
  await firstSection.click();
  const breastfeedingArticle = page.getByRole("article", {
    name: "O Início da Amamentação",
    exact: true,
  });
  await expect(breastfeedingArticle).toBeFocused();
  await expect(page).toHaveURL(/#topic\/amamentacao\/o-inicio-da-amamentacao$/);

  await search.fill("banho");
  const bathResult = page.getByRole("link").filter({
    has: page.getByRole("heading", {
      name: "Banho do Bebê: Preparação e Segurança",
      exact: true,
    }),
  });
  await bathResult.click();
  const bathArticle = page.getByRole("article", {
    name: "Banho do Bebê: Preparação e Segurança",
    exact: true,
  });
  await expect(page).toHaveURL(
    /#topic\/higiene\/banho-do-bebe-preparacao-e-seguranca$/,
  );
  await expect(bathArticle).toBeFocused();
  await expect(bathArticle).toBeInViewport();
  await page.reload();
  await expect(bathArticle).toBeFocused();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Buscar no Aninhar" }),
  ).toBeVisible();
  await expect(search).toHaveValue("banho");
  await page.reload();
  await expect(search).toHaveValue("banho");
  await expect(bathResult).toBeVisible();
  await page.goForward();
  await expect(bathArticle).toBeFocused();
});

test("empty and unmatched searches offer useful content and can be cleared", async ({
  page,
}) => {
  await page.goto("/#search");
  await expect(
    page.getByRole("heading", { name: "Toda dúvida merece acolhimento." }),
  ).toBeVisible();
  const search = page.getByRole("searchbox", {
    name: "Buscar em todos os temas",
  });
  await search.fill("[.* termo inexistente");
  await expect(page.getByRole("status")).toContainText("0 resultados");
  await expect(
    page.getByRole("heading", { name: "Vamos tentar de outro jeito?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("img", { name: "Aninhar", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar e buscar novamente" }).click();
  await expect(search).toBeEmpty();
  await expect(search).toBeFocused();
  await search.fill("   ");
  await expect(page.getByRole("status")).toHaveText(
    "Digite uma palavra na busca para começar.",
  );
});

test("mobile menu contains keyboard focus and closes through Escape and overlay", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "The desktop sidebar is always visible.",
  );
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu de temas" });
  const dialog = page.getByRole("dialog", { name: "Menu de temas" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: "Fechar menu" })).toBeFocused();
  for (let index = 0; index < 20; index++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate(
        (element) =>
          // Native modal dialogs can cycle through browser chrome (reported as BODY).
          // App controls outside the dialog must never receive keyboard focus.
          element.contains(document.activeElement) ||
          document.activeElement === document.body,
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(page.viewportSize()!.width - 5, 20);
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toBeFocused();
});

test("layouts fit 320, 375, 390, 768 and 1280 pixel viewports", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "The viewport matrix runs once.",
  );
  for (const width of [320, 375, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 850 });
    for (const route of [
      "/#home",
      "/#topic/primeirosPassos",
      "/#topic/acidentes",
      "/#topic/licencas",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
    const navigation = await openNavigation(page);
    await expect(
      navigation.getByRole("link", {
        name: /^Licenças Maternidade e Paternidade/,
      }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    const toggle = page.getByRole("button", { name: "Fechar menu" });
    if (await toggle.isVisible()) await toggle.click();
  }
});

test("search from a long page keeps input focus and presents results at the top", async ({
  page,
}) => {
  await page.goto("/#topic/amamentacao");
  await page.getByRole("article").last().scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  const search = page.getByRole("searchbox", {
    name: "Buscar em todos os temas",
  });
  await search.fill("colostro");
  await expect(search).toBeFocused();
  await expect(page).toHaveURL(/#search\?q=colostro$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(
    page.getByRole("heading", { name: "O Início da Amamentação" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar busca", exact: true }).click();
  await expect(search).toBeEmpty();
  await expect(search).toBeFocused();
  await expect(page).toHaveURL(/#search$/);
  await page.getByRole("button", { name: "Vacinas", exact: true }).click();
  await expect(search).toHaveValue("Vacinas");
  await expect(search).toBeFocused();
  await expect(page.getByRole("status")).toContainText("Vacinas");
  await page.goBack();
  await expect(page).toHaveURL(/#topic\/amamentacao$/);
});

test("unknown and malformed links offer navigation without a blank page", async ({
  page,
}) => {
  for (const hash of [
    "#admin",
    "#topic",
    "#topic/%E0%A4%A",
    "#topic/sono/extra/invalid",
  ]) {
    await page.goto(`/${hash}`);
    await expect(
      page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Voltar ao início" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Buscar conteúdo" }),
    ).toBeVisible();
  }
  await page.goto("/#topic/tema-inexistente");
  await expect(
    page.getByRole("heading", { level: 1, name: "Tema não encontrado" }),
  ).toBeVisible();
});
