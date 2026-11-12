import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Play,
  ImageOff,
  ArrowUp,
  Link,
  Search,
  X,
} from "lucide-react";
import { normalizeSearch, type Topic, type TopicSection } from "../data/topics";
import { useContent } from "../data/ContentContext";
import { safeLink, topicHref, youtubeEmbed } from "../lib/navigation";

type TextSize = "standard" | "large" | "extra-large";
const readingPreferenceKey = "aninhar:reading:v1";

function readTextSize(): TextSize {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(readingPreferenceKey) ?? "null",
    );
    if (saved === "large" || saved === "extra-large") return saved;
  } catch {
    // Reading remains available when browser storage is disabled.
  }
  return "standard";
}

function SectionMedia({ section }: { section: TopicSection }) {
  const [imageFailed, setImageFailed] = useState(false);
  const embed = section.video && youtubeEmbed(section.video.url);
  return (
    <>
      {section.image && (
        <figure className="section-media">
          {imageFailed ? (
            <p className="media-fallback">
              <ImageOff size={20} aria-hidden="true" /> Imagem indisponível:{" "}
              {section.image.alt}
            </p>
          ) : (
            <img
              src={section.image.src}
              alt={section.image.alt}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          )}
          {section.image.caption && (
            <figcaption>{section.image.caption}</figcaption>
          )}
        </figure>
      )}
      {section.video && embed && (
        <figure className="section-media">
          <iframe
            src={embed}
            title={section.video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <figcaption>
            <Play size={14} aria-hidden="true" /> {section.video.title}{" "}
            <a href={section.video.url} target="_blank" rel="noreferrer">
              Assistir no YouTube <ExternalLink size={13} aria-hidden="true" />
            </a>
          </figcaption>
        </figure>
      )}
      {section.video && !embed && (
        <p className="media-fallback">Vídeo indisponível no momento.</p>
      )}
      {section.links.length > 0 && (
        <ul className="resource-links">
          {section.links
            .filter((link) => safeLink(link.url))
            .map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label} <ExternalLink size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}

export default function TopicReader({
  topic,
  sectionId,
}: {
  topic: Topic;
  sectionId?: string;
}) {
  const { topics } = useContent();
  const [indexOpen, setIndexOpen] = useState(() => window.innerWidth >= 700);
  const [copyMessage, setCopyMessage] = useState("");
  const [copyFeedbackSection, setCopyFeedbackSection] = useState("");
  const [copiedSection, setCopiedSection] = useState("");
  const [textSize, setTextSize] = useState<TextSize>(readTextSize);
  const [indexQuery, setIndexQuery] = useState("");
  const indexSearchRef = useRef<HTMLInputElement>(null);
  const indexTerms = normalizeSearch(indexQuery).split(/\s+/).filter(Boolean);
  const visibleIndexSections = topic.sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => {
      const content = normalizeSearch(`${section.title} ${section.text}`);
      return indexTerms.every((term) => content.includes(term));
    });
  function changeTextSize(size: TextSize) {
    setTextSize(size);
    try {
      localStorage.setItem(readingPreferenceKey, JSON.stringify(size));
    } catch {
      // The chosen size still applies for this visit.
    }
  }
  function returnToIndex() {
    setIndexOpen(true);
    requestAnimationFrame(() => {
      const index = document.getElementById("topic-index");
      index?.scrollIntoView({ block: "start" });
      index?.querySelector("summary")?.focus({ preventScroll: true });
    });
  }
  async function copySectionLink(id: string) {
    setCopyFeedbackSection(id);
    setCopyMessage("");
    const url = new URL(window.location.href);
    url.hash = topicHref(topic.id, id);
    try {
      await navigator.clipboard.writeText(url.href);
      setCopiedSection(id);
      setCopyMessage("Link copiado. Você já pode compartilhá-lo.");
    } catch {
      setCopiedSection("");
      setCopyMessage(
        "Não foi possível copiar. Abra o tópico e copie o endereço do navegador.",
      );
    }
  }
  const Icon = topic.icon;
  const next =
    topics[
      (topics.findIndex((item) => item.id === topic.id) + 1) % topics.length
    ];
  if (!topic.sections.length)
    return (
      <div className="reading-page">
        <a className="back-link" href="#home">
          <ArrowLeft size={16} aria-hidden="true" /> Início
        </a>
        <header className="page-heading">
          <h1>{topic.name}</h1>
          {topic.title !== topic.name && (
            <p className="topic-full-title">{topic.title}</p>
          )}
          <p>{topic.description}</p>
        </header>
        <section className="info-card">
          <h2>Conteúdo em preparação</h2>
          <p>
            Estamos organizando as orientações deste tema. Você pode explorar os
            outros assuntos do guia enquanto isso.
          </p>
          <a className="secondary-button" href="#home">
            Ver outros temas
          </a>
        </section>
      </div>
    );
  return (
    <div className="reading-page topic-reading-page" data-text-size={textSize}>
      <a className="back-link" href="#home">
        <ArrowLeft size={16} aria-hidden="true" /> Início
      </a>
      <header className="page-heading">
        <span className="eyebrow">
          <BookOpen size={15} aria-hidden="true" /> GUIA DE CUIDADOS
        </span>
        <div className="title-row">
          <div>
            <h1>{topic.name}</h1>
            {topic.title !== topic.name && (
              <p className="topic-full-title">{topic.title}</p>
            )}
            <p>{topic.description}</p>
          </div>
          <span className="topic-symbol">
            <Icon size={32} aria-hidden="true" />
          </span>
        </div>
        <div className="reader-tools">
          <span className="reading-meta">
            {topic.sections.length} tópicos · Leia no seu ritmo
          </span>
          <button className="text-button" onClick={returnToIndex}>
            Ver índice do tema <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="reading-preferences">
        <fieldset>
          <legend>Tamanho do texto</legend>
          <div className="text-size-options">
            {([
              ["standard", "Padrão"],
              ["large", "Grande"],
              ["extra-large", "Maior"],
            ] as const).map(([size, label]) => (
              <button
                key={size}
                type="button"
                aria-label={`Texto ${label.toLocaleLowerCase("pt-BR")}`}
                aria-pressed={textSize === size}
                onClick={() => changeTextSize(size)}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <p>Escolha um tamanho confortável para ler.</p>
      </div>
      <nav aria-label="Neste tema">
        <details
          id="topic-index"
          className="section-index"
          open={indexOpen}
          onToggle={(event) => setIndexOpen(event.currentTarget.open)}
        >
          <summary>
            Neste tema{" "}
            <small>{topic.sections.length} tópicos para consultar</small>
          </summary>
          <div className="topic-index-content">
            {topic.sections.length > 5 && (
              <form
                className="topic-index-search"
                role="search"
                aria-label="Busca no índice deste tema"
                onSubmit={(event) => event.preventDefault()}
              >
                <label htmlFor="topic-index-query">Encontrar neste tema</label>
                <div className="topic-index-search-input">
                  <Search size={18} aria-hidden="true" />
                  <input
                    ref={indexSearchRef}
                    id="topic-index-query"
                    type="search"
                    value={indexQuery}
                    placeholder="Digite uma palavra ou assunto"
                    aria-describedby="topic-index-search-help"
                    aria-controls="topic-index-links"
                    onChange={(event) => setIndexQuery(event.target.value)}
                  />
                  {indexQuery && (
                    <button
                      type="button"
                      aria-label="Limpar busca neste tema"
                      onClick={() => { setIndexQuery(""); indexSearchRef.current?.focus(); }}
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  )}
                </div>
                <p id="topic-index-search-help">Busca nos títulos e no texto das orientações.</p>
              </form>
            )}
            {indexTerms.length > 0 && (
              <p className="topic-index-count" aria-live="polite" aria-atomic="true">
                {visibleIndexSections.length} de {topic.sections.length} tópicos encontrados
              </p>
            )}
            <div className="section-index-links" id="topic-index-links">
            {visibleIndexSections.map(({ section, index }) => (
              <a
                key={section.id}
                onClick={() => {
                  if (window.innerWidth < 700) setIndexOpen(false);
                  requestAnimationFrame(() => {
                    const article = document.getElementById(section.id);
                    article?.focus({ preventScroll: true });
                    article?.scrollIntoView({ block: "start" });
                  });
                }}
                href={topicHref(topic.id, section.id)}
                aria-current={sectionId === section.id ? "location" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            ))}
            </div>
            {!visibleIndexSections.length && (
              <div className="topic-index-empty">
                <p>Nenhum tópico corresponde a esta busca. Tente outra palavra ou volte ao índice completo.</p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => { setIndexQuery(""); indexSearchRef.current?.focus(); }}
                >
                  Ver todos os tópicos
                </button>
              </div>
            )}
          </div>
        </details>
      </nav>
      <p className="sr-only" role="status">
        {copyMessage}
      </p>
      <div className="articles">
        {topic.sections.map((section, index) => (
          <article
            className={`article-card${sectionId === section.id ? " is-selected" : ""}`}
            id={section.id}
            key={section.id}
            tabIndex={-1}
            aria-labelledby={`${section.id}-heading`}
          >
            <span className="article-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="article-body">
              <h2 id={`${section.id}-heading`}>{section.title}</h2>
              <p>{section.text}</p>
              <SectionMedia section={section} />
              <div className="article-actions">
                <button onClick={returnToIndex}>
                  <ArrowUp size={15} aria-hidden="true" /> Voltar ao índice
                </button>
                <button
                  onClick={() => copySectionLink(section.id)}
                  aria-label={`Copiar link para ${section.title}`}
                >
                  <Link size={15} aria-hidden="true" />
                  {copiedSection === section.id ? "Link copiado" : "Copiar link"}
                </button>
              </div>
              {copyFeedbackSection === section.id && copyMessage && (
                <p className="copy-feedback">{copyMessage}</p>
              )}
            </div>
          </article>
        ))}
      </div>
      <aside className="care-note">
        <BookOpen size={19} aria-hidden="true" />
        <p>
          Informação para apoiar o cuidado. Este guia é educativo e não
          substitui a avaliação de um profissional de saúde.
        </p>
      </aside>
      {next && next.id !== topic.id && (
        <a className="next-topic" href={topicHref(next.id)}>
          <div>
            <span>CONTINUE EXPLORANDO</span>
            <strong>{next.name}</strong>
          </div>
          <ArrowRight size={22} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
