import type { MouseEvent } from "react";
import { ArrowDown, ArrowRight, BookOpen, Heart } from "lucide-react";
import { useContent } from "../data/ContentContext";
import { topicHref } from "../lib/navigation";

export default function Welcome() {
  const { topics } = useContent();
  const firstTopic = topics.find((topic) => topic.id === "primeirosPassos") ?? topics[0];

  function showTopics(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const directory = document.getElementById("todos-os-temas");
    directory?.scrollIntoView({ block: "start" });
    directory?.focus({ preventScroll: true });
  }
  return (
    <div className="home-page">
      <header className="home-welcome">
        <div>
          <p className="eyebrow"><BookOpen size={15} aria-hidden="true" /> GUIA PARA OS PRIMEIROS DOIS ANOS</p>
          <h1>Cuidar é aprender.<br />E você não está só.</h1>
          <p className="home-intro">Encontre orientações para o cuidado com seu bebê. Escolha um tema ou use a busca acima.</p>
        </div>
        <a className="home-directory-jump" href="#todos-os-temas" onClick={showTopics}>
          Ver todos os temas <ArrowDown size={17} aria-hidden="true" />
        </a>
      </header>
      <section
        className="home-directory"
        id="todos-os-temas"
        tabIndex={-1}
        aria-labelledby="directory-title"
      >
        <div className="home-directory-heading">
          <h2 id="directory-title">Todos os temas</h2>
          <span>{topics.length} temas para consultar</span>
        </div>
        {!topics.length && (
          <div className="info-card">
            <h3>Estamos preparando novos conteúdos</h3>
            <p>Volte em breve para encontrar orientações para sua família.</p>
          </div>
        )}
        <div className="home-topic-grid">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const start = topic.id === firstTopic?.id;
            return (
              <a
                key={topic.id}
                className={`home-topic${start ? " home-topic-start" : ""}`}
                href={topicHref(topic.id)}
                aria-label={topic.name}
                aria-describedby={`home-topic-${topic.id}-description`}
              >
                <span className="home-topic-icon"><Icon size={24} aria-hidden="true" /></span>
                <div className="home-topic-copy">
                  {start && <span className="home-start-label">COMECE POR AQUI</span>}
                  <h3>{topic.name}</h3>
                  <p id={`home-topic-${topic.id}-description`}>{topic.description}</p>
                  <span className="home-topic-count">{topic.sections.length} {topic.sections.length === 1 ? "tópico" : "tópicos"}</span>
                </div>
                <ArrowRight className="home-topic-arrow" size={19} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>
      <aside className="home-support">
        <Heart size={21} aria-hidden="true" />
        <div>
          <h2>Não existe uma família igual à outra.</h2>
          <p>
            Consulte as orientações no seu ritmo e converse com a equipe que acompanha sua família.
          </p>
        </div>
      </aside>
    </div>
  );
}
