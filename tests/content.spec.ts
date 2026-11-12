import { test, expect } from "@playwright/test";
import { normalizeSearch, searchTopics, topics } from "../src/data/topics";
import { safeLink, youtubeEmbed } from "../src/lib/navigation";

test("the catalog preserves all topics and sections with unique navigation IDs", () => {
  expect(topics).toHaveLength(11);
  expect(topics[0]).toMatchObject({
    id: "primeirosPassos",
    name: "Primeiros Dias",
  });
  expect(topics.flatMap((topic) => topic.sections)).toHaveLength(79);
  expect(new Set(topics.map((topic) => topic.id)).size).toBe(topics.length);
  for (const topic of topics) {
    expect(topic.name.trim()).not.toBe("");
    expect(topic.sections.length).toBeGreaterThan(0);
    expect(new Set(topic.sections.map((section) => section.id)).size).toBe(
      topic.sections.length,
    );
    for (const section of topic.sections) {
      expect(section.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(section.title.trim()).not.toBe("");
      expect(section.text.trim()).not.toBe("");
    }
  }
});

test("search finds content-body terms and ignores accents, case and repeated spaces", () => {
  const bodyResults = searchTopics("colostro");
  expect(bodyResults).toHaveLength(1);
  expect(bodyResults[0].section?.id).toBe("o-inicio-da-amamentacao");
  expect(bodyResults[0].excerpt).toContain("colostro");
  expect(normalizeSearch("  INTRODUÇÃO ALIMENTAR  ")).toBe(
    "introducao alimentar",
  );
  const results = searchTopics("  INTRODUCAO   ALIMENTAR  ");
  expect(results[0].topic.id).toBe("alimentacao");
  expect(results[0].section).toBeUndefined();
  expect(
    results.map((result) => [result.topic.id, result.section?.id]),
  ).toEqual(
    searchTopics("introdução alimentar").map((result) => [
      result.topic.id,
      result.section?.id,
    ]),
  );
});

test("search treats symbols literally, returns no matches for empty queries and requires every word", () => {
  for (const query of [
    "",
    "   \t\n",
    "[.*",
    "(colostro|banho)",
    "xyz-inexistente-123",
  ]) {
    expect(searchTopics(query), query).toEqual([]);
  }
  expect(searchTopics("colostro leite")[0].section?.id).toBe(
    "o-inicio-da-amamentacao",
  );
  expect(searchTopics("leite colostro")).toEqual(
    searchTopics("colostro leite"),
  );
  expect(searchTopics("colostro xyz-inexistente-123")).toEqual([]);
  expect(searchTopics("umbilical consulta").length).toBeGreaterThan(0);
  for (const { topic, section } of searchTopics("umbilical consulta")) {
    const content = normalizeSearch(
      `${topic.name} ${topic.title} ${section?.title ?? topic.description} ${section?.text ?? ""}`,
    );
    expect(content).toContain("umbilical");
    expect(content).toContain("consulta");
  }
});

test("approved YouTube URL forms produce privacy-enhanced embeds", () => {
  const id = "abcdefghijk";
  const expected = `https://www.youtube-nocookie.com/embed/${id}`;
  for (const url of [
    `https://youtu.be/${id}?t=30`,
    `https://youtube.com/watch?v=${id}`,
    `https://www.youtube.com/watch?list=some-list&v=${id}`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
  ]) {
    expect(youtubeEmbed(url), url).toBe(expected);
  }
});

test("media parsing rejects malformed URLs, non-HTTPS schemes and lookalike hosts", () => {
  for (const url of [
    "",
    "not a URL",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://www.youtube.com/watch?v=abcdefghijk",
    "https://www.youtube.com.evil.example/watch?v=abcdefghijk",
    "https://youtube.com@evil.example/watch?v=abcdefghijk",
    "https://evil.example/embed/abcdefghijk",
    "https://youtu.be.evil.example/abcdefghijk",
    "https://www.youtube.com/watch?v=short",
    "https://www.youtube.com/watch?v=abcdefghijkl",
    "https://www.youtube.com/watch",
    "https://www.youtube.com/channel/abcdefghijk",
    "https://www.youtube.com/watch?v=abcdef%3C%3Eijk",
  ]) {
    expect(youtubeEmbed(url), url).toBeUndefined();
  }
  expect(safeLink("https://example.org/educational-resource")).toBe(true);
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,content",
    "file:///etc/passwd",
    "http://example.org",
    "//example.org",
    "/relative-link",
    "malformed",
  ]) {
    expect(safeLink(url), url).toBe(false);
  }
});
