export type Page = "home" | "topic" | "about" | "contact" | "search";
export interface Route {
  page: Page;
  topicId?: string;
  sectionId?: string;
}

export function readRoute(): Route {
  const [page, topicId, sectionId] = window.location.hash.slice(1).split("/");
  if (page === "topic") return { page, topicId, sectionId };
  if (page === "about" || page === "contact" || page === "search")
    return { page };
  return { page: "home" };
}

export const topicHref = (topicId: string, sectionId?: string) =>
  `#topic/${topicId}${sectionId ? `/${sectionId}` : ""}`;

export function youtubeEmbed(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return;
    const host = parsed.hostname.toLowerCase();
    const parts = parsed.pathname.split("/").filter(Boolean);
    const id =
      host === "youtu.be"
        ? parts[0]
        : [
              "youtube.com",
              "www.youtube.com",
              "m.youtube.com",
              "www.youtube-nocookie.com",
            ].includes(host)
          ? parts[0] === "watch"
            ? parsed.searchParams.get("v")
            : ["embed", "shorts"].includes(parts[0])
              ? parts[1]
              : null
          : null;
    if (id && /^[a-zA-Z0-9_-]{11}$/.test(id))
      return `https://www.youtube-nocookie.com/embed/${id}`;
  } catch {
    /* Invalid media URLs are never embedded. */
  }
}

export function safeLink(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}
