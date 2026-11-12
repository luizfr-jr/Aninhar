import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Menu,
  Search,
  X,
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import TopicReader from "./components/TopicReader";
import Welcome from "./components/Welcome";
import { searchTopics } from "./data/topics";
import { ContentProvider } from "./data/ContentProvider";
import { useContent } from "./data/ContentContext";
import { readRoute, searchHref, topicHref } from "./lib/navigation";

function About({ contact = false }: { contact?: boolean }) {
  const { pages, topics } = useContent();
  const page = contact ? pages.contact : pages.about;
  const firstTopic =
    topics.find((topic) => topic.id === "primeirosPassos") ?? topics[0];
  const email = page.email?.trim();
  const validEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div className="reading-page">
      <a className="back-link" href="#home">
        <ArrowLeft size={16} aria-hidden="true" /> Voltar ao início
      </a>
      <header className="page-heading">
        <span className="eyebrow">
          {contact ? "ORIENTAÇÃO E CONTATO" : "CONHEÇA O PROJETO"}
        </span>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </header>
      {page.sections.map((section) => (
        <section
          key={section.id}
          className="info-card"
          aria-labelledby={`page-${section.id}`}
        >
          <h2 id={`page-${section.id}`}>{section.title}</h2>
          {section.text.split(/\n\s*\n/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
      {contact && validEmail && (
        <section className="info-card">
          <h2>Contato por e-mail</h2>
          <p>
            Use seu aplicativo de e-mail para falar com a equipe do projeto.
          </p>
          <a className="text-link" href={`mailto:${email}`}>
            {email}
          </a>
        </section>
      )}
      <div className="page-actions">
        {firstTopic && (
          <a className="primary-button" href={topicHref(firstTopic.id)}>
            {firstTopic.id === "primeirosPassos"
              ? contact
                ? "Consultar primeiros cuidados"
                : "Explorar os primeiros dias"
              : `Explorar ${firstTopic.name}`}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        )}
        <a className="secondary-button" href={contact ? "#about" : "#search"}>
          {contact ? "Conhecer o projeto" : "Buscar uma orientação"}
        </a>
      </div>
      <aside className="care-note">
        <BookOpen size={20} aria-hidden="true" />
        <p>
          As informações têm caráter educativo e não substituem a avaliação de
          um profissional de saúde. Converse com a equipe que acompanha sua
          família sobre as necessidades do seu bebê.
        </p>
      </aside>
    </div>
  );
}

function UnavailablePage({ topic = false }: { topic?: boolean }) {
  return (
    <div className="empty-state">
      <img src="/aninhar-logo.jpg" alt="Aninhar" />
      <h1>{topic ? "Tema não encontrado" : "Página não encontrada"}</h1>
      <p>
        Este endereço não corresponde a uma página disponível. Volte ao início
        ou use a busca para encontrar o conteúdo que procura.
      </p>
      <div className="page-actions">
        <a href="#home" className="primary-button">
          Voltar ao início <ArrowRight size={16} aria-hidden="true" />
        </a>
        <a href="#search" className="secondary-button">
          Buscar conteúdo
        </a>
      </div>
    </div>
  );
}

function PublicApp() {
  const { topics, pages } = useContent();
  const [route, setRoute] = useState(readRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeMenuRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const topic = topics.find((item) => item.id === route.topicId);
  const query = route.page === "search" ? (route.query ?? "") : "";
  const results = route.page === "search" ? searchTopics(query, topics) : [];
  const pageLabel =
    route.page === "topic"
      ? (topic?.name ?? "Tema não encontrado")
      : route.page === "search"
        ? "Buscar conteúdo"
        : route.page === "about"
          ? pages.about.title
          : route.page === "contact"
            ? pages.contact.title
            : route.page === "not-found"
              ? "Página não encontrada"
              : "Início";

  useEffect(() => {
    const onLocationChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onLocationChange);
    return () => window.removeEventListener("hashchange", onLocationChange);
  }, []);

  useEffect(() => {
    document.title = `${pageLabel} | Aninhar`;
    if (route.page === "search") {
      // Keep typing uninterrupted, including on mobile keyboards.
      if (document.activeElement !== searchRef.current) {
        mainRef.current?.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0 });
      return;
    }
    const target =
      route.page === "topic" && route.sectionId
        ? document.getElementById(route.sectionId)
        : null;
    (target ?? mainRef.current)?.focus({ preventScroll: true });
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo({ top: 0 });
  }, [route, pageLabel]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (menuOpen) {
      dialog.showModal();
      closeMenuRef.current?.focus();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const desktop = window.matchMedia("(min-width: 1100px)");
      const closeOnDesktop = () => {
        if (desktop.matches) setMenuOpen(false);
      };
      desktop.addEventListener("change", closeOnDesktop);
      return () => {
        document.body.style.overflow = previousOverflow;
        desktop.removeEventListener("change", closeOnDesktop);
        dialog.close();
      };
    }
  }, [menuOpen]);

  function changeSearch(value: string) {
    const href = searchHref(value);
    // One history entry per search visit; typing must not flood browser history.
    if (readRoute().page === "search")
      window.history.replaceState(null, "", href);
    else window.history.pushState(null, "", href);
    setRoute(readRoute());
  }

  function chooseSearchSuggestion(value: string) {
    changeSearch(value);
    searchRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <aside className="desktop-sidebar">
        <Sidebar route={route} />
      </aside>
      <dialog
        ref={dialogRef}
        className="navigation-dialog"
        aria-label="Menu de temas"
        onCancel={() => setMenuOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMenuOpen(false);
        }}
      >
        <div className="mobile-sidebar">
          <button
            ref={closeMenuRef}
            className="icon-button close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
          <Sidebar route={route} onNavigate={() => setMenuOpen(false)} />
        </div>
      </dialog>
      <div className="main-shell">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-toggle"
            aria-label="Abrir menu de temas"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={23} />
          </button>
          <a
            className="mobile-wordmark"
            href="#home"
            aria-label="Aninhar — início"
          >
            aninhar<span>.</span>
          </a>
          <nav className="breadcrumb" aria-label="Localização na página">
            <a href="#home">Aninhar</a>
            <ChevronRight size={13} aria-hidden="true" />
            <strong aria-current="page">{pageLabel}</strong>
          </nav>
          <form
            className="search-box"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              changeSearch(query);
              searchRef.current?.focus();
            }}
          >
            <input
              ref={searchRef}
              aria-label="Buscar em todos os temas"
              placeholder="Buscar: banho, sono, vacinas…"
              value={query}
              onChange={(event) => changeSearch(event.target.value)}
              type="search"
            />
            {query && (
              <button
                type="button"
                aria-label="Limpar busca"
                onClick={() => {
                  changeSearch("");
                  searchRef.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="search-submit"
              aria-label="Buscar conteúdo"
            >
              <Search size={20} aria-hidden="true" />
            </button>
          </form>
        </header>
        <main
          ref={mainRef}
          id="main-content"
          className="main-content"
          tabIndex={-1}
        >
          {route.page === "home" && <Welcome />}
          {route.page === "topic" &&
            (topic ? (
              <TopicReader
                key={topic.id}
                topic={topic}
                sectionId={route.sectionId}
              />
            ) : (
              <UnavailablePage topic />
            ))}
          {route.page === "not-found" && <UnavailablePage />}
          {route.page === "about" && <About />}
          {route.page === "contact" && <About contact />}
          {route.page === "search" && (
            <div className="reading-page">
              <header className="page-heading">
                <span className="eyebrow">ENCONTRE O QUE PRECISA</span>
                <h1>Buscar no Aninhar</h1>
                <p>Pesquise em todos os temas, títulos e orientações.</p>
              </header>
              <p
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="search-summary"
              >
                {!query.trim()
                  ? "Digite uma palavra na busca para começar."
                  : `${results.length} resultado${results.length !== 1 ? "s" : ""} para “${query}”`}
              </p>
              {!query.trim() && (
                <div
                  className="search-suggestions"
                  aria-label="Sugestões de busca"
                >
                  {["Amamentação", "Banho", "Sono", "Vacinas"].map((term) => (
                    <button
                      className="secondary-button"
                      key={term}
                      onClick={() => chooseSearchSuggestion(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
              {results.length ? (
                <div className="search-results">
                  {results.map((result) => (
                    <a
                      className="search-result"
                      key={`${result.topic.id}/${result.section?.id ?? ""}`}
                      href={topicHref(result.topic.id, result.section?.id)}
                    >
                      <span className="eyebrow">{result.topic.name}</span>
                      <h2>
                        {result.section?.title ?? result.topic.name}
                        <ArrowRight size={18} aria-hidden="true" />
                      </h2>
                      <p>{result.excerpt}</p>
                      <span className="text-link">Ler conteúdo completo</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <img src="/aninhar-logo.jpg" alt="Aninhar" />
                  <h2>
                    {query.trim()
                      ? "Vamos tentar de outro jeito?"
                      : "Toda dúvida merece acolhimento."}
                  </h2>
                  <p>
                    {query.trim()
                      ? "Tente palavras como “banho”, “sono” ou “amamentação”. Você também pode escolher um tema no menu."
                      : "Busque uma palavra ou explore os temas do menu."}
                  </p>
                  {query.trim() && (
                    <button
                      className="secondary-button"
                      onClick={() => {
                        changeSearch("");
                        searchRef.current?.focus();
                      }}
                    >
                      Limpar e buscar novamente
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
        <footer className="site-footer">
          <div className="footer-top">
            <div>
              <strong>
                aninhar<span>.</span>
              </strong>
              <p>Cuidando com amor e informação.</p>
            </div>
            <div className="partner-logos">
              <img
                src="/PPGSMI-logo.png"
                alt="Programa de Pós-Graduação em Saúde Materno Infantil"
              />
              <img src="/ninmahub-logo.png" alt="NinMa Hub" />
              <img src="/oryum-logo.png" alt="Oryum Tech" />
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              Desenvolvido por Luiz Fernando Rodrigues Junior e Kalleby
              Evangelho Mota
            </p>
            <p>NinMa Hub · Universidade Franciscana (UFN) · Oryum Tech</p>
            <a href="/admin">Administração</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <PublicApp />
    </ContentProvider>
  );
}
