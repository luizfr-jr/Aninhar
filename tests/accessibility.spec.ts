import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of [
  "/#home",
  "/#topic/primeirosPassos",
  "/#search",
  "/#about",
  "/#contact",
]) {
  test(`accessible landmarks and contrast at ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("mobile drawer is accessible", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile",
    "Desktop uses the permanent sidebar.",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu de temas" }).click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
