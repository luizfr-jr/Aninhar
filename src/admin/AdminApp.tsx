import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  ChevronRight,
  CircleHelp,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  X,
} from "lucide-react";
import type { ContentDocument, TopicRecord } from "../types/content";
import { validExternalUrl, validImageUrl, validVideoUrl } from "./validation";
import { AdminApiError, adminRequest, type DraftState, type MediaItem } from "./api";
import { formatDate, moveItem, newId } from "./utils";
import TopicEditor from "./TopicEditor";
import PageEditor from "./PageEditor";
import MediaLibrary from "./MediaLibrary";
import "./admin.css";

type Notice = {
  kind: "error" | "success" | "warning";
  message: string;
  conflict?: boolean;
};
type View = { page: string; id?: string };
const navigation = [
  { page: "overview", name: "Visão geral", icon: LayoutDashboard },
  { page: "topics", name: "Temas e conteúdos", icon: BookOpen },
  { page: "media", name: "Biblioteca de imagens", icon: Image },
  { page: "pages", name: "Páginas do site", icon: FileText },
];
function getView(): View {
  const [page, id] = window.location.hash.slice(1).split("/");
  return { page: page || "overview", id };
}
type ValidationIssue = {
  message: string;
  view: View;
  sectionId?: string;
  selectedPage?: "about" | "contact";
};
function validateContent(content: ContentDocument): ValidationIssue | null {
  for (const topic of content.topics) {
    const issue = (message: string, sectionId?: string): ValidationIssue => ({
      message, view: { page: "topic", id: topic.id }, sectionId,
    });
    if (!topic.name.trim() || !topic.title.trim())
      return issue("Preencha o nome e o título de todos os temas antes de salvar.");
    for (const section of topic.sections) {
      if (!section.title.trim() || !section.text.trim())
        return issue(`No tema “${topic.name}”, preencha o título e o texto de todos os tópicos.`, section.id);
      if (section.image && (!section.image.src.trim() || !section.image.alt.trim()))
        return issue(`No tópico “${section.title}”, informe a imagem e sua descrição de acessibilidade.`, section.id);
      if (section.image && !validImageUrl(section.image.src))
        return issue(`No tópico “${section.title}”, use uma imagem da biblioteca ou um endereço HTTPS válido.`, section.id);
      if (section.video && (!section.video.title.trim() || !validVideoUrl(section.video.url)))
        return issue(`No tópico “${section.title}”, informe o título e um link válido do YouTube.`, section.id);
      if (section.links.some((link) => !link.label.trim() || !validExternalUrl(link.url)))
        return issue(`No tópico “${section.title}”, cada referência precisa de um nome e um endereço HTTPS válido.`, section.id);
    }
  }
  for (const selectedPage of ["about", "contact"] as const) {
    const page = content.pages[selectedPage];
    const issue = (message: string): ValidationIssue => ({ message, view: { page: "pages" }, selectedPage });
    if (!page.title.trim()) return issue("Preencha o título das páginas institucionais.");
    if (page.sections.some((section) => !section.title.trim() || !section.text.trim()))
      return issue(`Na página “${page.title}”, preencha o título e o texto de todos os blocos.`);
    if (page.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(page.email))
      return issue("Informe um e-mail de contato válido ou deixe o campo vazio.");
  }
  return null;
}

function Login({
  configured,
  loading,
  onLogin,
  notice,
  onRetry,
}: {
  configured: boolean;
  loading: boolean;
  onLogin: (password: string) => void;
  notice: Notice | null;
  onRetry: () => void;
}) {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  return (
    <div className="adm-root adm-login">
      <section className="adm-login-card">
        <img className="adm-login-logo" src="/aninhar-logo.jpg" alt="Aninhar" />
        <p className="adm-eyebrow">ÁREA DA EQUIPE</p>
        <h1>Administração do Aninhar</h1>
        <p className="adm-description">
          Organize os conteúdos, revise os rascunhos e publique com segurança.
        </p>
        {!configured ? (
          <div className="adm-alert adm-warning">
            <h2>Acesso ainda não configurado</h2>
            <p>
              Peça ao responsável pelo site para configurar o acesso
              administrativo. Não há uma senha padrão.
            </p>
            <button className="adm-btn adm-secondary" onClick={onRetry}>
              Verificar novamente
            </button>
          </div>
        ) : (
          <form
            className="adm-login-form"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin(password);
            }}
          >
            <div className="adm-field">
              <label htmlFor="admin-password">
                Senha de acesso{" "}
                <span className="adm-required" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="adm-password">
                <input
                  autoComplete="current-password"
                  autoFocus
                  className="adm-input"
                  id="admin-password"
                  name="password"
                  aria-invalid={notice?.kind === "error" ? true : undefined}
                  aria-describedby="login-password-help"
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="adm-help" id="login-password-help">Use a senha de acesso fornecida pela equipe responsável pelo site.</p>
            </div>
            <button
              type="submit"
              className="adm-btn adm-primary"
              disabled={loading || !password}
            >
              {loading ? "Entrando…" : "Entrar no painel"}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>
        )}
        {notice && (
          <div className={`adm-alert adm-${notice.kind}`} role="alert">
            {notice.message}
          </div>
        )}
        <a className="adm-login-back" href="/">
          <Home size={16} aria-hidden="true" /> Voltar ao site público
        </a>
      </section>
    </div>
  );
}

function TopicsList({
  content,
  onChange,
  onCreate,
}: {
  content: ContentDocument;
  onChange: (content: ContentDocument) => void;
  onCreate: () => void;
}) {
  const [search, setSearch] = useState("");
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const filtered = content.topics.filter((topic) =>
    normalize(`${topic.name} ${topic.description}`).includes(normalize(search)),
  );
  return (
    <>
      <header className="adm-page-header">
        <div>
          <h1>Temas e conteúdos</h1>
          <p className="adm-description">
            A ordem desta lista é a ordem do menu do site. Use as setas para
            reorganizar os temas.
          </p>
        </div>
        <button className="adm-btn adm-primary" onClick={onCreate}>
          <Plus size={18} aria-hidden="true" /> Novo tema
        </button>
      </header>
      <label className="adm-field adm-search">
        <span>Buscar tema</span>
        <div className="adm-search-input">
          <Search size={18} aria-hidden="true" />
          <input
            className="adm-input"
            type="search"
            placeholder="Digite um nome ou assunto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </label>
      <div className="adm-list-heading">
        <p role="status">{filtered.length} de {content.topics.length} temas{search ? " encontrados" : " no menu"}</p>
        <span>As setas mudam a ordem após a publicação.</span>
      </div>
      <div className="adm-list">
        {filtered.map((topic) => {
          const index = content.topics.indexOf(topic);
          return (
            <article className="adm-list-row" key={topic.id}>
              <div className="adm-row-main">
                <span className="adm-order">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <a
                    href={`#topic/${encodeURIComponent(topic.id)}`}
                    className="adm-topic-title"
                  >
                    {topic.name}
                  </a>
                  <p>
                    {topic.description ||
                      "Adicione uma descrição para orientar os visitantes."}
                  </p>
                  <span className="adm-help">
                    {topic.sections.length} tópicos
                    {index === 0 ? " · Primeiro no menu" : ""}
                  </span>
                </div>
              </div>
              <div className="adm-row-actions">
                <button
                  className="adm-btn adm-quiet"
                  disabled={index === 0}
                  aria-label={`Mover ${topic.name} para cima`}
                  onClick={() =>
                    onChange({
                      ...content,
                      topics: moveItem(content.topics, index, -1),
                    })
                  }
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  className="adm-btn adm-quiet"
                  disabled={index === content.topics.length - 1}
                  aria-label={`Mover ${topic.name} para baixo`}
                  onClick={() =>
                    onChange({
                      ...content,
                      topics: moveItem(content.topics, index, 1),
                    })
                  }
                >
                  <ArrowDown size={18} />
                </button>
                <a
                  href={`#topic/${encodeURIComponent(topic.id)}`}
                  className="adm-btn adm-secondary"
                  aria-label={`Editar ${topic.name}`}
                >
                  Editar <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="adm-empty">
          <h2>
            {content.topics.length
              ? "Nenhum tema encontrado"
              : "Comece pelo primeiro tema"}
          </h2>
          <p>
            {content.topics.length
              ? "Tente outro termo ou limpe a busca."
              : "Crie um tema e acrescente os tópicos que deseja publicar."}
          </p>
          <button
            className="adm-btn adm-secondary"
            onClick={() => (content.topics.length ? setSearch("") : onCreate())}
          >
            {content.topics.length ? "Limpar busca" : "Criar tema"}
          </button>
        </div>
      )}
    </>
  );
}

function AdminWorkspace() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [state, setState] = useState<DraftState | null>(null);
  const [content, setContent] = useState<ContentDocument | null>(null);
  const [snapshot, setSnapshot] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [view, setView] = useState(getView);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mediaReturn, setMediaReturn] = useState<string | null>(null);
  const [mediaTarget, setMediaTarget] = useState<{ topicId: string; sectionId: string } | null>(null);
  const [validationIssue, setValidationIssue] = useState<ValidationIssue | null>(null);
  const [selectedPage, setSelectedPage] = useState<"about" | "contact">("about");
  const mobileRef = useRef<HTMLDialogElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const publishRef = useRef<HTMLDialogElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const dirty = content !== null && JSON.stringify(content) !== snapshot;
  const editorRef = useRef({ content, state, snapshot, dirty });
  editorRef.current = { content, state, snapshot, dirty };
  const recoveryRef = useRef<{
    content: ContentDocument;
    state: DraftState;
    snapshot: string;
  } | null>(null);
  const published = !!state && state.publishedVersion === state.version;

  const handleError = useCallback((error: unknown) => {
    if (error instanceof AdminApiError && error.status === 401) {
      const current = editorRef.current;
      if (current.dirty && current.content && current.state)
        recoveryRef.current = {
          content: current.content,
          state: current.state,
          snapshot: current.snapshot,
        };
      setAuthenticated(false);
      setState(null);
      setContent(null);
      setSnapshot("");
      setNotice({
        kind: "warning",
        message:
          "Sua sessão terminou. Entre novamente para continuar; suas alterações desta janela serão preservadas.",
      });
      return;
    }
    setNotice({
      kind: "error",
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível concluir esta ação. Tente novamente.",
      conflict: error instanceof AdminApiError && error.status === 409,
    });
  }, []);
  const checkSession = useCallback(async () => {
    setBusy(true);
    try {
      const session = await adminRequest<{
        authenticated: boolean;
        configured?: boolean;
      }>("/api/auth/session");
      setConfigured(session.configured !== false);
      setAuthenticated(session.authenticated);
    } catch (error) {
      setAuthenticated(false);
      handleError(error);
    } finally {
      setBusy(false);
    }
  }, [handleError]);
  const loadDraft = useCallback(async () => {
    setBusy(true);
    try {
      const result = await adminRequest<DraftState>("/api/admin/content");
      const recovery = recoveryRef.current;
      recoveryRef.current = null;
      if (recovery) {
        setContent(recovery.content);
        setState(recovery.state);
        setSnapshot(recovery.snapshot);
        setNotice(
          result.version === recovery.state.version
            ? {
                kind: "warning",
                message:
                  "Suas alterações não salvas foram recuperadas nesta janela. Confira e salve o rascunho para continuar.",
              }
            : {
                kind: "error",
                message:
                  "Suas alterações foram preservadas, mas existe uma versão mais recente no servidor. Copie o que deseja manter antes de recarregar a versão atual.",
                conflict: true,
              },
        );
      } else {
        setState(result);
        setContent(result.content);
        setSnapshot(JSON.stringify(result.content));
        setNotice(null);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }, [handleError]);
  useEffect(() => {
    void checkSession();
  }, [checkSession]);
  useEffect(() => {
    if (authenticated) void loadDraft();
  }, [authenticated, loadDraft]);
  useEffect(() => {
    const changeView = () => {
      setView(getView());
      setMobileOpen(false);
    };
    window.addEventListener("hashchange", changeView);
    return () => window.removeEventListener("hashchange", changeView);
  }, []);
  useEffect(() => {
    document.title = "Administração | Aninhar";
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [view]);
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  useEffect(() => {
    const dialog = mobileRef.current;
    if (!mobileOpen || !dialog) return;
    dialog.showModal();
    mobileCloseRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      dialog.close();
    };
  }, [mobileOpen]);

  async function login(password: string) {
    setBusy(true);
    setNotice(null);
    try {
      await adminRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setAuthenticated(true);
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível entrar. Tente novamente.",
      });
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (
      dirty &&
      !window.confirm("Há alterações não salvas. Deseja sair e descartá-las?")
    )
      return;
    setBusy(true);
    try {
      await adminRequest("/api/auth/logout", { method: "POST", body: "{}" });
      recoveryRef.current = null;
      setAuthenticated(false);
      setState(null);
      setContent(null);
      setSnapshot("");
      setNotice(null);
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }
  function edit(next: ContentDocument) {
    setContent(next);
    setNotice(null);
    setValidationIssue(null);
  }
  async function save() {
    if (!content || !state) return;
    const validation = validateContent(content);
    if (validation) {
      setNotice({ kind: "error", message: validation.message });
      revealValidation(validation);
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const next = await adminRequest<DraftState>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ content, version: state.version }),
      });
      setState(next);
      setContent(next.content);
      setSnapshot(JSON.stringify(next.content));
      setNotice({
        kind: "success",
        message:
          "Rascunho salvo. Revise a prévia e publique quando estiver pronto.",
      });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    if (!state || dirty) return;
    setBusy(true);
    try {
      const next = await adminRequest<DraftState>("/api/admin/publish", {
        method: "POST",
        body: JSON.stringify({ version: state.version }),
      });
      setState(next);
      setContent(next.content);
      setSnapshot(JSON.stringify(next.content));
      publishRef.current?.close();
      setNotice({
        kind: "success",
        message:
          "Conteúdo publicado. As alterações já estão disponíveis no site público.",
      });
    } catch (error) {
      publishRef.current?.close();
      handleError(error);
    } finally {
      setBusy(false);
    }
  }
  function createTopic() {
    if (!content) return;
    const topic: TopicRecord = {
      id: newId("tema"),
      name: "Novo tema",
      title: "Novo tema",
      description: "",
      sections: [],
    };
    edit({ ...content, topics: [...content.topics, topic] });
    window.location.hash = `topic/${topic.id}`;
  }
  function removeTopic(topic: TopicRecord) {
    if (
      !content ||
      !window.confirm(
        `Remover o tema “${topic.name}” e seus ${topic.sections.length} tópicos do rascunho?`,
      )
    )
      return;
    edit({
      ...content,
      topics: content.topics.filter((item) => item.id !== topic.id),
    });
    window.location.hash = "topics";
  }
  function openMedia(sectionId: string) {
    if (!view.id) return;
    setMediaTarget({ topicId: view.id, sectionId });
    setMediaReturn(window.location.hash || "#overview");
    window.location.hash = "media";
  }
  function useMedia(item: MediaItem) {
    if (!content || !mediaTarget || !mediaReturn) return;
    edit({
      ...content,
      topics: content.topics.map((itemTopic) => itemTopic.id === mediaTarget.topicId ? {
        ...itemTopic,
        sections: itemTopic.sections.map((section) => section.id === mediaTarget.sectionId ? {
          ...section,
          image: section.image?.src === item.url ? section.image : { src: item.url, alt: "" },
        } : section),
      } : itemTopic),
    });
    window.location.hash = mediaReturn;
    setMediaReturn(null);
  }
  function revealValidation(issue: ValidationIssue) {
    setValidationIssue({ ...issue });
    if (issue.selectedPage) setSelectedPage(issue.selectedPage);
    window.location.hash = `${issue.view.page}${issue.view.id ? `/${encodeURIComponent(issue.view.id)}` : ""}`;
  }
  const focusValidation = useCallback((issue: ValidationIssue) => {
    const scope = issue.sectionId ? document.getElementById(`edit-${issue.sectionId}`) : mainRef.current;
    scope?.querySelectorAll("details").forEach((detail) => { detail.open = true; });
    if (scope instanceof HTMLDetailsElement) scope.open = true;
    window.dispatchEvent(new Event("aninhar:validate"));
    requestAnimationFrame(() => {
      const field = scope?.querySelector<HTMLElement>('[aria-invalid="true"], input:invalid, textarea:invalid');
      const target = field ?? scope?.querySelector<HTMLElement>("summary, input, textarea") ?? mainRef.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: "center", behavior: "auto" });
    });
  }, []);
  useEffect(() => {
    if (!validationIssue || view.page !== validationIssue.view.page || view.id !== validationIssue.view.id) return;
    const frame = requestAnimationFrame(() => focusValidation(validationIssue));
    return () => cancelAnimationFrame(frame);
  }, [validationIssue, view, selectedPage, focusValidation]);
  const topic = content?.topics.find((item) => item.id === view.id);
  const topicCount = content?.topics.length ?? 0;
  const sectionCount =
    content?.topics.reduce((count, item) => count + item.sections.length, 0) ??
    0;
  const mediaCount =
    content?.topics.reduce(
      (count, item) =>
        count +
        item.sections.filter((section) => section.image || section.video)
          .length,
      0,
    ) ?? 0;
  const sidebar = (
    <>
      <a className="adm-brand" href="#overview">
        <img src="/aninhar-logo.jpg" alt="" />
        <div>
          <strong>aninhar.</strong>
          <small>Administração do conteúdo</small>
        </div>
      </a>
      <p className="adm-nav-caption">SEU ESPAÇO DE TRABALHO</p>
      <nav className="adm-nav" aria-label="Administração">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active =
            view.page === item.page ||
            (item.page === "topics" && view.page === "topic");
          return (
            <a
              className={`adm-nav-link${active ? " is-active" : ""}`}
              href={`#${item.page}`}
              key={item.page}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              {item.name}
            </a>
          );
        })}
      </nav>
      <div className="adm-sidebar-footer">
        <a className="adm-nav-link" href="/" target="_blank" rel="noreferrer">
          <Home size={20} aria-hidden="true" /> Abrir site público
        </a>
        <button
          className="adm-nav-link"
          onClick={() => void logout()}
          disabled={busy}
        >
          <LogOut size={20} aria-hidden="true" /> Sair da conta
        </button>
        <p>
          Salvar guarda um rascunho. Publicar torna o conteúdo visível para as
          famílias.
        </p>
      </div>
    </>
  );

  if (authenticated === null)
    return (
      <div className="adm-root adm-login">
        <p role="status">Verificando acesso…</p>
      </div>
    );
  if (!authenticated)
    return (
      <Login
        configured={configured}
        loading={busy}
        onLogin={(password) => void login(password)}
        notice={notice}
        onRetry={() => void checkSession()}
      />
    );
  return (
    <div className="adm-root">
      <a
        className="adm-skip"
        href="#admin-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <aside className="adm-sidebar adm-desktop-sidebar">{sidebar}</aside>
      <dialog
        ref={mobileRef}
        className="adm-mobile-drawer"
        aria-label="Menu administrativo"
        onCancel={() => setMobileOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setMobileOpen(false);
        }}
      >
        <div className="adm-sidebar">
          <button
            className="adm-mobile-close adm-btn adm-quiet"
            ref={mobileCloseRef}
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu administrativo"
          >
            <X size={22} />
          </button>
          {sidebar}
        </div>
      </dialog>
      <div className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-title">
            <button
              className="adm-mobile-toggle adm-btn adm-quiet"
              aria-label="Abrir menu administrativo"
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
              <span>Menu</span>
            </button>
            <div>
              <strong className="adm-breadcrumb">
                <a href="#overview">Painel</a><ChevronRight size={14} aria-hidden="true" />
                <span>{view.page === "topic" ? topic?.name ?? "Tema" : navigation.find((item) => item.page === view.page)?.name ?? "Gestão de conteúdo"}</span>
              </strong>
              <span className="adm-saving" role="status" data-state={busy ? "busy" : dirty ? "unsaved" : published ? "published" : "draft"}>
                {busy
                  ? "Aguarde…"
                  : dirty
                    ? "Alterações ainda não salvas"
                    : published
                      ? "Conteúdo publicado"
                      : "Rascunho salvo"}
              </span>
            </div>
          </div>
          <div className="adm-actions">
            <button
              className="adm-btn adm-secondary"
              onClick={() => void save()}
              disabled={!dirty || busy || !content}
            >
              <Save size={17} aria-hidden="true" /> Salvar rascunho
            </button>
            <button
              className="adm-btn adm-primary"
              disabled={dirty || busy || !state || published}
              aria-describedby="publish-guidance"
              onClick={() => publishRef.current?.showModal()}
            >
              <Send size={17} aria-hidden="true" /> Publicar
            </button>
          </div>
          <span className="adm-sr-only" id="publish-guidance">
            {dirty ? "Salve o rascunho antes de publicar." : published ? "As alterações salvas já estão publicadas." : "Publicar torna o rascunho salvo visível no site."}
          </span>
        </header>
        <main
          id="admin-content"
          ref={mainRef}
          tabIndex={-1}
          className="adm-content"
        >
          {notice && (
            <div
              role={notice.kind === "error" ? "alert" : "status"}
              className={`adm-alert adm-${notice.kind}`}
            >
              <span>{notice.message}</span>
              {validationIssue && (
                <button className="adm-btn adm-secondary" onClick={() => revealValidation(validationIssue)}>
                  Ir ao campo <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
              {notice.conflict && (
                <button
                  className="adm-btn adm-secondary"
                  onClick={() => {
                    if (
                      !dirty ||
                      window.confirm(
                        "Recarregar a versão mais recente? As alterações locais não salvas serão descartadas.",
                      )
                    )
                      void loadDraft();
                  }}
                >
                  <RotateCcw size={16} aria-hidden="true" /> Recarregar versão
                  atual
                </button>
              )}
            </div>
          )}
          {dirty && (
            <div className="adm-alert adm-warning">
              <span>
                Você está editando um rascunho. Salve as alterações para abrir a
                prévia e habilitar a publicação.
              </span>
              <button
                className="adm-btn adm-quiet"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      "Descartar todas as alterações não salvas e recuperar o último rascunho salvo?",
                    )
                  )
                    void loadDraft();
                }}
              >
                Descartar alterações
              </button>
            </div>
          )}
          {!content ? (
            <section className="adm-empty">
              <h1>
                {busy
                  ? "Carregando conteúdo…"
                  : "Não foi possível carregar o conteúdo"}
              </h1>
              {!busy && (
                <button
                  className="adm-btn adm-secondary"
                  onClick={() => void loadDraft()}
                >
                  Tentar novamente
                </button>
              )}
            </section>
          ) : (
            <fieldset className="adm-editor-area" disabled={busy}>
              {view.page === "overview" && (
                <>
                  <header className="adm-page-header">
                    <div>
                      <p className="adm-eyebrow">PAINEL INICIAL</p>
                      <h1>Seu conteúdo, organizado</h1>
                      <p className="adm-description">
                        Prepare as orientações com calma, confira a prévia e
                        publique quando estiver tudo revisado.
                      </p>
                    </div>
                  </header>
                  <div className="adm-overview-layout">
                    <section className="adm-card adm-publication-card" aria-labelledby="publication-status-title">
                      <div className="adm-card-header">
                        <div>
                          <p className="adm-eyebrow">SITUAÇÃO DO CONTEÚDO</p>
                          <h2 id="publication-status-title">
                            {dirty ? "Há alterações para salvar" : published ? "O site está atualizado" : "Há um rascunho para revisar"}
                          </h2>
                        </div>
                        <span className={`adm-badge ${dirty ? "is-warning" : published ? "is-success" : ""}`}>
                          {dirty ? "Não salvo" : published ? "Publicado" : "Rascunho"}
                        </span>
                      </div>
                      <p>
                        {dirty ? "Suas últimas edições estão apenas nesta janela. Salve para guardá-las e conferir a prévia." : published ? "O conteúdo salvo é o mesmo que as famílias veem no site." : "O rascunho está guardado. Confira a prévia antes de torná-lo público."}
                      </p>
                      <ol className="adm-workflow" aria-label="Etapas de atualização do conteúdo">
                        <li className={dirty ? "is-current" : "is-done"}><span aria-hidden="true">1</span> Editar e salvar</li>
                        <li className={!dirty && !published ? "is-current" : published && !dirty ? "is-done" : ""}><span aria-hidden="true">2</span> Conferir a prévia</li>
                        <li className={published && !dirty ? "is-done" : ""}><span aria-hidden="true">3</span> Publicar</li>
                      </ol>
                      <div className="adm-status-dates">
                        <p><strong>Último salvamento</strong><br />{formatDate(state?.updatedAt)}</p>
                        <p><strong>Última publicação</strong><br />{formatDate(state?.publishedAt)}</p>
                      </div>
                      <div className="adm-actions">
                        <button
                          className="adm-btn adm-secondary"
                          disabled={dirty}
                          aria-describedby={dirty ? "overview-preview-help" : undefined}
                          onClick={() => window.open("/?preview=1", "_blank", "noopener,noreferrer")}
                        ><Eye size={17} aria-hidden="true" /> Abrir prévia</button>
                        <a className="adm-btn adm-quiet" href="/" target="_blank" rel="noreferrer">
                          Ver site público <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      </div>
                      {dirty && <p className="adm-help" id="overview-preview-help">A prévia fica disponível depois de salvar o rascunho.</p>}
                    </section>
                    <section className="adm-card adm-task-card" aria-labelledby="admin-tasks-title">
                      <h2 id="admin-tasks-title">O que você quer atualizar?</h2>
                      <p>Escolha uma tarefa para começar.</p>
                      <a className="adm-task-link" href="#topics">
                        <BookOpen size={22} aria-hidden="true" />
                        <span><strong>Editar temas</strong><small>Textos, vídeos e ordem do menu</small></span>
                        <ChevronRight size={18} aria-hidden="true" />
                      </a>
                      <a className="adm-task-link" href="#media">
                        <Image size={22} aria-hidden="true" />
                        <span><strong>Adicionar imagens</strong><small>Enviar e encontrar ilustrações</small></span>
                        <ChevronRight size={18} aria-hidden="true" />
                      </a>
                      <a className="adm-task-link" href="#pages">
                        <FileText size={22} aria-hidden="true" />
                        <span><strong>Atualizar Sobre e Contato</strong><small>Apresentação e informações da equipe</small></span>
                        <ChevronRight size={18} aria-hidden="true" />
                      </a>
                    </section>
                  </div>
                  <div className="adm-metrics" aria-label="Resumo do conteúdo">
                    <section className="adm-metric"><BookOpen size={22} aria-hidden="true" /><strong>{topicCount}</strong><span>Temas no menu</span></section>
                    <section className="adm-metric"><FileText size={22} aria-hidden="true" /><strong>{sectionCount}</strong><span>Tópicos de orientação</span></section>
                    <section className="adm-metric"><Image size={22} aria-hidden="true" /><strong>{mediaCount}</strong><span>Tópicos com imagem ou vídeo</span></section>
                  </div>
                  <details className="adm-guide">
                    <summary><CircleHelp size={20} aria-hidden="true" /> Como atualizar o site <ChevronRight size={18} aria-hidden="true" /></summary>
                    <ol className="adm-steps">
                      <li><strong>Edite e organize.</strong> Atualize os temas, os textos e as imagens.</li>
                      <li><strong>Salve o rascunho.</strong> Guarde as alterações sem mudar o site público.</li>
                      <li><strong>Revise a prévia.</strong> Confira a leitura e peça a revisão clínica necessária.</li>
                      <li><strong>Publique.</strong> Disponibilize a versão revisada para as famílias.</li>
                    </ol>
                  </details>
                </>
              )}
              {view.page === "topics" && (
                <TopicsList
                  content={content}
                  onChange={edit}
                  onCreate={createTopic}
                />
              )}
              {view.page === "topic" &&
                (topic ? (
                  <TopicEditor
                    key={topic.id}
                    topic={topic}
                    onChange={(next) =>
                      edit({
                        ...content,
                        topics: content.topics.map((item) =>
                          item.id === next.id ? next : item,
                        ),
                      })
                    }
                    onDelete={() => removeTopic(topic)}
                    canPreview={!dirty}
                    onMedia={openMedia}
                    initialSectionId={mediaTarget?.topicId === topic.id ? mediaTarget.sectionId : undefined}
                  />
                ) : (
                  <section className="adm-empty">
                    <h1>Tema não encontrado</h1>
                    <p>O tema pode ter sido removido do rascunho.</p>
                    <a className="adm-btn adm-primary" href="#topics">
                      Voltar aos temas
                    </a>
                  </section>
                ))}
              {view.page === "media" && (
                <MediaLibrary
                  onError={handleError}
                  onSelect={mediaReturn && mediaTarget ? useMedia : undefined}
                  onReturn={
                    mediaReturn
                      ? () => {
                          window.location.hash = mediaReturn;
                          setMediaReturn(null);
                        }
                      : undefined
                  }
                />
              )}
              {view.page === "pages" && (
                <PageEditor
                  pages={content.pages}
                  selectedPage={selectedPage}
                  onPageChange={setSelectedPage}
                  onChange={(pages) => edit({ ...content, pages })}
                />
              )}
              {!["overview", "topics", "topic", "media", "pages"].includes(
                view.page,
              ) && (
                <section className="adm-empty">
                  <h1>Página não encontrada</h1>
                  <p>Escolha uma área no menu para continuar.</p>
                  <a className="adm-btn adm-primary" href="#overview">
                    Ir à visão geral
                  </a>
                </section>
              )}
            </fieldset>
          )}
        </main>
      </div>
      <dialog
        ref={publishRef}
        className="adm-dialog"
        aria-labelledby="publish-title"
      >
        <div className="adm-dialog-body">
          <CheckCircle2 size={30} aria-hidden="true" />
          <h2 id="publish-title">Publicar esta versão?</h2>
          <p>
            Os {topicCount} temas, {sectionCount} tópicos e as páginas
            institucionais desta versão ficarão visíveis no site público.
          </p>
          <p>
            Confira se textos, imagens e vídeos foram revisados antes de
            continuar.
          </p>
          <div className="adm-dialog-actions">
            <button
              className="adm-btn adm-secondary"
              disabled={busy}
              onClick={() => publishRef.current?.close()}
            >
              Continuar revisando
            </button>
            <button
              className="adm-btn adm-primary"
              disabled={busy || dirty}
              onClick={() => void publish()}
            >
              {busy ? "Publicando…" : "Publicar agora"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default function AdminApp() {
  if (import.meta.env.VITE_STATIC_PUBLIC_FALLBACK === "1") {
    return (
      <main className="adm-root adm-login">
        <section className="adm-login-card">
          <img
            className="adm-login-logo"
            src="/aninhar-logo.jpg"
            alt="Aninhar"
          />
          <p className="adm-eyebrow">ÁREA DA EQUIPE</p>
          <h1>Administração indisponível nesta hospedagem</h1>
          <p className="adm-description">
            Esta hospedagem mantém uma versão estática do site público. Para
            editar e publicar conteúdos, use a instalação do Aninhar com o
            servidor administrativo e armazenamento persistente configurados.
          </p>
          <a className="adm-btn adm-primary" href="/">
            <Home size={18} aria-hidden="true" /> Voltar ao site público
          </a>
        </section>
      </main>
    );
  }
  return <AdminWorkspace />;
}
