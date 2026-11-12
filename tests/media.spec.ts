import { test, expect, type Page } from "@playwright/test";

async function injectMedia(page: Page, broken = false) {
  await page.goto("/");
  // Use the same Vite module instance as the app; fixtures exist only in this page.
  // The source catalog remains unchanged and no production media is fabricated.
  await page.evaluate(
    async ({ broken }) => {
      const modulePath = "/src/data/topics.ts";
      const { topics } = await import(modulePath);
      const topic = topics.find(
        (item: { id: string }) => item.id === "higiene",
      );
      const section = topic.sections[0];
      section.image = {
        src: broken
          ? "/test-media/unavailable.svg"
          : "/test-media/illustration.svg",
        alt: "Ilustração de teste para os cuidados no banho",
        caption: "Legenda da ilustração de teste",
      };
      section.video = {
        url: broken
          ? "https://youtube.com.evil.example/watch?v=abcdefghijk"
          : "https://youtu.be/abcdefghijk",
        title: "Vídeo de teste sobre cuidados no banho",
      };
      section.links = [
        { label: "Referência de teste", url: "https://example.org/care" },
        { label: "Link inseguro de teste", url: "javascript:alert(1)" },
      ];
      window.location.hash = `topic/higiene/${section.id}`;
    },
    { broken },
  );
  return page.getByRole("article", {
    name: "Banho do Bebê: Preparação e Segurança",
    exact: true,
  });
}

test("a topic renders its full text, illustration, video and safe reference", async ({
  page,
}) => {
  await page.route("**/test-media/illustration.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320"><rect width="640" height="320" fill="#eee"/></svg>',
    }),
  );
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<html></html>" }),
  );
  const article = await injectMedia(page);
  await expect(article).toContainText(
    "Antes de começar, aqueça bem o ambiente",
  );
  const illustration = article.getByRole("img", {
    name: "Ilustração de teste para os cuidados no banho",
  });
  await expect(illustration).toBeVisible();
  await expect
    .poll(() =>
      illustration.evaluate(
        (element) => (element as HTMLImageElement).naturalWidth,
      ),
    )
    .toBe(640);
  await expect(article).toContainText("Legenda da ilustração de teste");
  await expect(article.locator("iframe")).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
  await expect(article.locator("iframe")).toHaveAttribute(
    "title",
    "Vídeo de teste sobre cuidados no banho",
  );
  await expect(
    article.getByRole("link", { name: "Assistir no YouTube" }),
  ).toHaveAttribute("href", "https://youtu.be/abcdefghijk");
  await expect(
    article.getByRole("link", { name: "Referência de teste" }),
  ).toBeVisible();
  await expect(
    article.getByRole("link", { name: "Link inseguro de teste" }),
  ).toHaveCount(0);
  const width = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(width.page).toBeLessThanOrEqual(width.viewport + 1);
});

test("unavailable media preserves the article and offers a readable fallback", async ({
  page,
}) => {
  await page.route("**/test-media/unavailable.svg", (route) => route.abort());
  const article = await injectMedia(page, true);
  await expect(article).toContainText("Imagem indisponível:");
  await expect(article).toContainText(
    "Ilustração de teste para os cuidados no banho",
  );
  await expect(article).toContainText("Vídeo indisponível no momento.");
  await expect(article.locator("iframe")).toHaveCount(0);
  await expect(article).toContainText(
    "Antes de começar, aqueça bem o ambiente",
  );
});
