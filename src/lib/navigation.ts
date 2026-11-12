export type Page =
  | "home"
  | "topic"
  | "about"
  | "contact"
  | "search"
  | "not-found";
export interface Route {
  page: Page;
  topicId?: string;
  sectionId?: string;
  query?: string;
}

/** Read only supported application routes; malformed links get an explicit fallback. */
export function readRoute(): Route {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === "home") return { page: "home" };
  const separator = hash.indexOf("?");
  const rawPath = separator >= 0 ? hash.slice(0, separator) : hash;
  const search = separator >= 0 ? hash.slice(separator + 1) : "";
  try {
    const path = decodeURIComponent(rawPath);
    if (path === "search") {
      return {
        page: "search",
        query: new URLSearchParams(search).get("q") ?? "",
      };
    }
    if (search) return { page: "not-found" };
    if (path === "about" || path === "contact") return { page: path };
    const parts = path.split("/");
    if (
      parts[0] === "topic" &&
      parts.length >= 2 &&
      parts.length <= 3 &&
      parts
        .slice(1)
        .every((part) => /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(part))
    ) {
      return { page: "topic", topicId: parts[1], sectionId: parts[2] };
    }
  } catch {
    // decodeURIComponent rejects malformed percent-encoded paths.
  }
  return { page: "not-found" };
}

export const topicHref = (topicId: string, sectionId?: string) =>
  `#topic/${encodeURIComponent(topicId)}${sectionId ? `/${encodeURIComponent(sectionId)}` : ""}`;

export const searchHref = (query: string) =>
  query ? `#search?${new URLSearchParams({ q: query }).toString()}` : "#search";

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
