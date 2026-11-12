import {
  ArrowRight,
  BookOpen,
  Heart,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { topics } from "../data/topics";
import { topicHref } from "../lib/navigation";

export default function Welcome() {
  const featured = ["amamentacao", "sono", "higiene"].map(
    (id) => topics.find((topic) => topic.id === id)!,
  );
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
          <a className="primary-button" href={topicHref("primeirosPassos")}>
            Comece pelos primeiros dias{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
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
