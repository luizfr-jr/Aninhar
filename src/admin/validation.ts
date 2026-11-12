import { youtubeEmbed } from "../lib/navigation";

/** Match the URLs accepted by the content API before submitting an edit. */
export function validExternalUrl(value: string): boolean {
  if (!value.trim() || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validImageUrl(value: string): boolean {
  if (value.length > 2048) return false;
  return /^\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(value) || validExternalUrl(value);
}

export function validVideoUrl(value: string): boolean {
  return validExternalUrl(value) && Boolean(youtubeEmbed(value));
}
