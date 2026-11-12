import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Play,
  ImageOff,
} from "lucide-react";
import { topics, type Topic, type TopicSection } from "../data/topics";
import { safeLink, topicHref, youtubeEmbed } from "../lib/navigation";

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
  const Icon = topic.icon;
  const next = topics[(topics.indexOf(topic) + 1) % topics.length];
  return (
    <div className="reading-page">
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
            <p>{topic.description}</p>
          </div>
          <span className="topic-symbol">
            <Icon size={32} aria-hidden="true" />
          </span>
        </div>
        <span className="reading-meta">
          {topic.sections.length} tópicos · Leia no seu ritmo
        </span>
      </header>
      <nav className="section-index" aria-label="Neste tema">
        <h2>Neste tema</h2>
        <div>
          {topic.sections.map((section, index) => (
            <a
              key={section.id}
              href={topicHref(topic.id, section.id)}
              aria-current={sectionId === section.id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.title}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </nav>
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
      <a className="next-topic" href={topicHref(next.id)}>
        <div>
          <span>CONTINUE EXPLORANDO</span>
          <strong>{next.name}</strong>
        </div>
        <ArrowRight size={22} aria-hidden="true" />
      </a>
    </div>
  );
}
