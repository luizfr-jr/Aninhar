import { ArrowRight, Sparkles, List } from "lucide-react";
import { useContent } from "../data/ContentContext";
import { topicHref } from "../lib/navigation";

export default function Welcome() {
  const { topics } = useContent();
  const firstTopic =
    topics.find((topic) => topic.id === "primeirosPassos") ?? topics[0];
  return (
    <>
      <div className="welcome-intro">
        <span className="eyebrow">
          <span className="status-dot" /> PARA PAIS, MÃES E CUIDADORES
        </span>
      </div>
      <section className="welcome-hero">
        <div className="hero-copy">
          <h1>
            Cuidar é aprender.
            <br />E você não está <em>só.</em>
          </h1>
          <p>
            Orientações para os primeiros dois anos do seu bebê. Encontre o
            cuidado que precisa, no seu tempo.
          </p>
          <div className="hero-actions">
            {firstTopic && (
              <a className="primary-button" href={topicHref(firstTopic.id)}>
                {firstTopic.id === "primeirosPassos"
                  ? "Comece pelos primeiros dias"
                  : `Explorar ${firstTopic.name}`}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            )}
            <a
              className="secondary-button"
              href="#todos-os-temas"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById("todos-os-temas")
                  ?.scrollIntoView({ block: "start" });
                document
                  .getElementById("todos-os-temas")
                  ?.focus({ preventScroll: true });
              }}
            >
              <List size={18} aria-hidden="true" /> Ver todos os temas
            </a>
          </div>
        </div>
        <div className="hero-art">
          <div className="logo-halo">
            <img
              src="/aninhar-logo.jpg"
              alt="Aninhar: mãos acolhendo um bebê em um ninho"
            />
          </div>
          <span className="art-caption">
            Pequenos passos. Grandes vínculos.
          </span>
        </div>
      </section>
      <section
        className="topics-directory"
        id="todos-os-temas"
        tabIndex={-1}
        aria-labelledby="directory-title"
      >
        <h2 id="directory-title">Todos os temas</h2>
        <p>
          Escolha um tema. Dentro dele, o índice leva direto ao assunto que
          você precisa.
        </p>
        {!topics.length && (
          <div className="info-card">
            <h3>Estamos preparando novos conteúdos</h3>
            <p>Volte em breve para encontrar orientações para sua família.</p>
          </div>
        )}
        <div className="directory-list">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <a
                key={topic.id}
                className="directory-link"
                href={topicHref(topic.id)}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{topic.name}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>
      <aside className="welcome-note">
        <span className="note-icon">
          <Sparkles size={24} aria-hidden="true" />
        </span>
        <div>
          <h2>Não existe uma família igual à outra.</h2>
          <p>
            Este espaço é seu. Use a busca ou escolha um tema no menu para
            encontrar o que faz sentido para o seu momento.
          </p>
        </div>
      </aside>
    </>
  );
}
