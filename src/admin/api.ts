import type { ContentDocument } from "../types/content";

export interface DraftState {
  content: ContentDocument;
  version: number;
  publishedVersion: number | null;
  updatedAt: string | null;
  publishedAt: string | null;
}
export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
}
export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...options,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new AdminApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      0,
    );
  }
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new AdminApiError(
      body?.error || "Não foi possível concluir esta ação. Tente novamente.",
      response.status,
    );
  if (!body)
    throw new AdminApiError(
      "A administração está temporariamente indisponível. Tente novamente em instantes.",
      response.status,
    );
  return body as T;
}
