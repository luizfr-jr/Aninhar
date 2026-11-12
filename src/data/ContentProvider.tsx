/// <reference types="vite/client" />
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookOpen } from "lucide-react";
import seed from "../../content/seed.json";
import type {
  ContentDocument,
  PageRecord,
  TopicRecord,
  TopicSection,
} from "../types/content";
import { topics as seedTopics } from "./topics";
import { ContentContext, type ContentContextValue } from "./ContentContext";

const topicAppearance = new Map(
  seedTopics.map((topic) => [
    topic.id,
    { icon: topic.icon, color: topic.color },
  ]),
);

type LoadState =
  | { status: "loading" }
  | { status: "ready"; content: ContentDocument }
  | { status: "error"; message: string; unauthorized?: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function isSection(value: unknown): value is TopicSection {
  if (
    !isRecord(value) ||
    ![value.id, value.title, value.text].every(
      (item) => typeof item === "string",
    ) ||
    !Array.isArray(value.links)
  )
    return false;
  if (
    !value.links.every(
      (link) =>
        isRecord(link) &&
        typeof link.label === "string" &&
        typeof link.url === "string",
    )
  )
    return false;
  if (
    value.image !== undefined &&
    (!isRecord(value.image) ||
      typeof value.image.src !== "string" ||
      typeof value.image.alt !== "string")
  )
    return false;
  if (
    value.video !== undefined &&
    (!isRecord(value.video) ||
      typeof value.video.url !== "string" ||
      typeof value.video.title !== "string")
  )
    return false;
  return true;
}
function isTopic(value: unknown): value is TopicRecord {
  return (
    isRecord(value) &&
    [value.id, value.name, value.title, value.description].every(
      (item) => typeof item === "string",
    ) &&
    Array.isArray(value.sections) &&
    value.sections.every(isSection)
  );
}
function isPage(value: unknown): value is PageRecord {
  return (
    isRecord(value) &&
    typeof value.title === "string" &&
    typeof value.intro === "string" &&
    (value.email === undefined || typeof value.email === "string") &&
    Array.isArray(value.sections) &&
    value.sections.every(
      (section) =>
        isRecord(section) &&
        [section.id, section.title, section.text].every(
          (item) => typeof item === "string",
        ),
    )
  );
}
function isDocument(value: unknown): value is ContentDocument {
  return (
    isRecord(value) &&
    Array.isArray(value.topics) &&
    value.topics.every(isTopic) &&
    isRecord(value.pages) &&
    isPage(value.pages.about) &&
    isPage(value.pages.contact)
  );
}

/** All public content comes from the published API. Preview requires an admin cookie. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const preview =
    new URLSearchParams(window.location.search).get("preview") === "1";
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const feedbackHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === "error") {
      feedbackHeadingRef.current?.focus({ preventScroll: true });
    }
  }, [state.status]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    setState({ status: "loading" });
    async function load() {
      try {
        const response = await fetch(
          preview ? "/api/admin/content" : "/api/content",
          {
            credentials: "same-origin",
            cache: "no-store",
            signal: controller.signal,
          },
        );
        const payload: unknown = await response.json().catch(() => null);
        if (!active) return;
        // Explicit compatibility mode for a static host returning index.html for /api.
        // A real API error, JSON response, or protected preview must never use seed data.
        if (
          !preview &&
          import.meta.env.VITE_STATIC_PUBLIC_FALLBACK === "1" &&
          response.ok &&
          response.headers
            .get("content-type")
            ?.toLowerCase()
            .includes("text/html") &&
          payload === null
        ) {
          setState({ status: "ready", content: seed });
          return;
        }
        // The Vite proxy explicitly identifies a missing local API. Never hide a server error.
        if (
          !preview &&
          import.meta.env.DEV &&
          response.status === 503 &&
          isRecord(payload) &&
          payload.code === "API_UNAVAILABLE"
        ) {
          setState({ status: "ready", content: seed });
          return;
        }
        if (preview && (response.status === 401 || response.status === 403)) {
          setState({
            status: "error",
            unauthorized: true,
            message:
              "Entre na administração para visualizar o rascunho. O conteúdo não publicado só pode ser visto por uma pessoa autenticada.",
          });
          return;
        }
        if (!response.ok) throw new Error("request failed");
        const content =
          preview && isRecord(payload) ? payload.content : payload;
        if (!isDocument(content)) throw new Error("invalid content");
        setState({ status: "ready", content });
      } catch {
        if (active)
          setState({
            status: "error",
            message:
              "Não foi possível carregar o conteúdo agora. Verifique sua conexão e tente novamente.",
          });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void load();
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt, preview]);

  const value = useMemo<ContentContextValue | undefined>(
    () =>
      state.status === "ready"
        ? {
            topics: state.content.topics.map((topic) => ({
              ...topic,
              ...(topicAppearance.get(topic.id) ?? {
                icon: BookOpen,
                color: "text-purple-600",
              }),
            })),
            pages: state.content.pages,
            preview,
          }
        : undefined,
    [state, preview],
  );

  if (!value)
    return (
      <main className="content-feedback" aria-busy={state.status === "loading"}>
        <a href="/" aria-label="Aninhar — início">
          <img src="/aninhar-logo.jpg" alt="" />
        </a>
        {state.status !== "error" ? (
          <>
            <h1>Preparando o seu guia</h1>
            <p role="status">Carregando o conteúdo do Aninhar…</p>
          </>
        ) : (
          <>
            <h1 ref={feedbackHeadingRef} tabIndex={-1}>
              {state.unauthorized
                ? "Entre para visualizar a prévia"
                : "Conteúdo temporariamente indisponível"}
            </h1>
            <p role="alert">{state.message}</p>
            <div className="page-actions">
              {state.unauthorized && (
                <a className="primary-button" href="/admin">
                  Ir para a administração
                </a>
              )}
              <button
                className={state.unauthorized ? "secondary-button" : "primary-button"}
                onClick={() => setAttempt((value) => value + 1)}
              >
                Tentar novamente
              </button>
              {preview && (
                <a className="secondary-button" href="/">
                  Ver site público
                </a>
              )}
            </div>
          </>
        )}
      </main>
    );

  return (
    <ContentContext.Provider value={value}>
      {preview && (
        <aside className="preview-banner" aria-label="Prévia administrativa">
          <strong>Prévia do rascunho</strong>
          <span>Estas alterações ainda não estão publicadas.</span>
          <a href="/admin">Voltar à administração</a>
        </aside>
      )}
      {children}
    </ContentContext.Provider>
  );
}
