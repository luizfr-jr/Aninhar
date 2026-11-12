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
import { searchTopics, topics } from "./data/topics";
import { readRoute, topicHref } from "./lib/navigation";

function About({ contact = false }: { contact?: boolean }) {
  return (
    <div className="reading-page">
      <a className="back-link" href="#home">
        <ArrowLeft size={16} aria-hidden="true" /> Início
      </a>
      <header className="page-heading">
        <span className="eyebrow">FEITO PARA ACOLHER</span>
        <h1>{contact ? "Contato" : "Sobre o Aninhar"}</h1>
        <p>Um ambiente de informação para famílias.</p>
      </header>
      {contact ? (
        <section className="info-card">
          <h2>Vamos cuidar dessa conversa</h2>
          <p>
            O canal de contato do projeto ainda não está disponível neste site.
            Para dúvidas sobre a saúde do bebê, procure a equipe de saúde que
            acompanha sua família.
          </p>
          <a className="text-link" href="#about">
            Conheça o projeto <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>
      ) : (
        <>
          <section className="info-card">
            <h2>Conhecimento que acolhe</h2>
            <p>
              O Projeto Aninhar é fruto de um trabalho de Mestrado ligado ao
              Programa de Pós-Graduação em Saúde Materno Infantil da
              Universidade Franciscana (UFN), desenvolvido por uma pediatra e
              mestranda.
            </p>
            <p>
              Gratuito e disponível para famílias de todo o Brasil, o projeto
              tem um vínculo especial com a Maternidade Santa Isabel do Hospital
              Casa de Saúde, em Santa Maria/RS. Nasce do desejo de facilitar a
              transição dos pais para casa com seu bebê.
            </p>
          </section>
          <section className="info-card">
            <h2>Nossa missão</h2>
            <p>
              Simplificar a jornada de cuidados com o bebê e apoiar mães, pais e
              cuidadores com informações acessíveis para os primeiros dois anos
              de vida.
            </p>
            <p>
              Explore os temas, leia as orientações e converse com a equipe de
              saúde sobre as necessidades da sua família.
            </p>
          </section>
          <aside className="care-note">
            <BookOpen size={20} aria-hidden="true" />
            <p>
              As informações têm caráter educativo e não substituem a avaliação
              de um profissional de saúde.
            </p>
          </aside>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeMenuRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const topic = topics.find((item) => item.id === route.topicId);
  const results = route.page === "search" ? searchTopics(query) : [];

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.title = `${route.page === "topic" && topic ? topic.name : route.page === "search" ? "Buscar" : route.page === "about" ? "Sobre" : route.page === "contact" ? "Contato" : "Cuidar, juntos"} | Aninhar`;
    if (route.page === "search") return;
    const target =
      route.page === "topic" && route.sectionId
        ? document.getElementById(route.sectionId)
        : null;
    (target ?? mainRef.current)?.focus({ preventScroll: true });
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo({ top: 0 });
  }, [route, topic]);

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
    setQuery(value);
    if (route.page !== "search") window.location.hash = "search";
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
          <div className="breadcrumb">
            <span>Aninhar</span>
            <ChevronRight size={13} aria-hidden="true" />
            <strong>
              {route.page === "topic" && topic
                ? topic.name
                : route.page === "search"
                  ? "Busca"
                  : route.page === "about"
                    ? "Sobre"
                    : route.page === "contact"
                      ? "Contato"
                      : "Boas-vindas"}
            </strong>
          </div>
          <form
            className="search-box"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              changeSearch(query);
              searchRef.current?.focus();
            }}
          >
            <Search size={18} aria-hidden="true" />
            <input
              ref={searchRef}
              aria-label="Buscar em todos os temas"
              placeholder="O que você quer saber?"
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
              <div className="empty-state">
                <img src="/aninhar-logo.jpg" alt="Aninhar" />
                <h1>Tema não encontrado</h1>
                <p>Escolha um dos temas no menu para continuar.</p>
                <a href="#home" className="primary-button">
                  Ir para o início <ArrowRight size={16} />
                </a>
              </div>
            ))}
          {route.page === "about" && <About />}
          {route.page === "contact" && <About contact />}
          {route.page === "search" && (
            <div className="reading-page">
              <header className="page-heading">
                <span className="eyebrow">ENCONTRE O QUE PRECISA</span>
                <h1>Buscar no Aninhar</h1>
                <p>Pesquise em todos os temas, títulos e orientações.</p>
              </header>
              <p role="status" className="search-summary">
                {!query.trim()
                  ? "Digite uma palavra na busca para começar."
                  : `${results.length} resultado${results.length !== 1 ? "s" : ""} para “${query}”`}
              </p>
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
          </div>
        </footer>
      </div>
    </div>
  );
}
