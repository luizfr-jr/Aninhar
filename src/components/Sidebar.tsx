import {
  ChevronRight,
  Heart,
  House,
  Info,
  MessageCircle,
  Search,
} from "lucide-react";
import { useContent } from "../data/ContentContext";
import { topicHref, type Route } from "../lib/navigation";

export default function Sidebar({
  route,
  onNavigate,
}: {
  route: Route;
  onNavigate?: () => void;
}) {
  const { topics } = useContent();
  return (
    <div className="sidebar-inner">
      <a
        className="brand"
        href="#home"
        onClick={onNavigate}
        aria-label="Aninhar — início"
      >
        <img src="/aninhar-logo.jpg" alt="" />
        <div>
          <strong>
            aninhar<span>.</span>
          </strong>
          <small>Cuidar, juntos.</small>
        </div>
      </a>
      <nav className="topic-nav" aria-label="Navegação principal">
        <a
          className={`nav-link home-link${route.page === "home" ? " active" : ""}`}
          aria-current={route.page === "home" ? "page" : undefined}
          href="#home"
          onClick={onNavigate}
        >
          <House size={19} aria-hidden="true" />
          <span>Boas-vindas</span>
        </a>
        <a
          className={`nav-link${route.page === "search" ? " active" : ""}`}
          aria-current={route.page === "search" ? "page" : undefined}
          href="#search"
          onClick={onNavigate}
        >
          <Search size={19} aria-hidden="true" />
          <span>Buscar uma orientação</span>
        </a>
        <p className="nav-label">
          Temas do guia <span>{topics.length}</span>
        </p>
        {topics.map((topic, index) => {
          const Icon = topic.icon;
          const active = route.page === "topic" && route.topicId === topic.id;
          return (
            <a
              key={topic.id}
              className={`nav-link${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
              href={topicHref(topic.id)}
              onClick={onNavigate}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{topic.name}</span>
              {index === 0 ? (
                <span className="start-tag">Comece aqui</span>
              ) : (
                <ChevronRight
                  className="nav-chevron"
                  size={14}
                  aria-hidden="true"
                />
              )}
            </a>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-message">
          <Heart size={19} aria-hidden="true" />
          <p>
            Cada descoberta,
            <br />
            <strong>um cuidado a mais.</strong>
          </p>
        </div>
        <nav aria-label="Sobre o projeto">
          <a
            href="#about"
            onClick={onNavigate}
            aria-current={route.page === "about" ? "page" : undefined}
          >
            <Info size={16} aria-hidden="true" /> Sobre o Aninhar
          </a>
          <a
            href="#contact"
            onClick={onNavigate}
            aria-current={route.page === "contact" ? "page" : undefined}
          >
            <MessageCircle size={16} aria-hidden="true" /> Contato
          </a>
        </nav>
        <span className="sidebar-credit">Uma iniciativa NinMa Hub · UFN</span>
      </div>
    </div>
  );
}
