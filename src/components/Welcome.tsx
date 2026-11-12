import {
  ArrowRight,
  BookOpen,
  Heart,
  Sparkles,
  ShieldCheck,
  List,
} from "lucide-react";
import { useContent } from "../data/ContentContext";
import { topicHref } from "../lib/navigation";

export default function Welcome() {
  const { topics } = useContent();
  const firstTopic =
    topics.find((topic) => topic.id === "primeirosPassos") ?? topics[0];
  const preferredTopics = ["amamentacao", "sono", "higiene"]
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is NonNullable<typeof topic> => !!topic);
  const featured = preferredTopics.length
    ? preferredTopics
    : topics.slice(0, 3);
  return (
    <>
      <div className="welcome-intro">
        <span className="eyebrow">
          <span className="status-dot" /> PARA PAIS, MÃES E CUIDADORES
        </span>
        <p>Do primeiro colo às novas descobertas</p>
      </div>
      <section className="welcome-hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <Heart size={16} aria-hidden="true" /> Um lugar de acolhimento
          </span>
          <h1>
            Cuidar é aprender.
            <br />E você não está <em>só.</em>
          </h1>
          <p>
            Informação e carinho para acompanhar os primeiros dois anos do seu
            bebê. Um passo de cada vez, no seu tempo.
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
      <div className="welcome-assurance">
        <span>
          <BookOpen size={17} aria-hidden="true" /> Conteúdo para o dia a dia
        </span>
        <span>
          <ShieldCheck size={17} aria-hidden="true" /> Cuidado desde o início
        </span>
        <span>
          <Heart size={17} aria-hidden="true" /> Acolhimento para a família
        </span>
      </div>
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">POR ONDE COMEÇAR?</span>
            <h2>As dúvidas mudam. O apoio fica.</h2>
          </div>
          <span className="subtle-label">Explore no seu ritmo</span>
        </div>
        <div className="featured-grid">
          {featured.map((topic) => {
            const Icon = topic.icon;
            return (
              <a
                className="feature-card"
                href={topicHref(topic.id)}
                key={topic.id}
              >
                <span className={`feature-icon feature-${topic.id}`}>
                  <Icon size={23} aria-hidden="true" />
                </span>
                <h3>{topic.name}</h3>
                <p>{topic.description}</p>
                <span className="feature-action">
                  Explorar tema <ArrowRight size={16} aria-hidden="true" />
                </span>
              </a>
            );
          })}
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
          Escolha o que você precisa agora. Cada tema reúne orientações para
          consultar no seu ritmo.
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
