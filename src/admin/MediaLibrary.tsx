import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Copy, Image, Search, Upload } from "lucide-react";
import { adminRequest, type MediaItem } from "./api";

export default function MediaLibrary({
  onError,
  onReturn,
  onSelect,
}: {
  onError: (error: unknown) => void;
  onReturn?: () => void;
  onSelect?: (item: MediaItem) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadFailed(false);
    adminRequest<{ items: MediaItem[] }>("/api/admin/media")
      .then((data) => {
        if (mounted) setItems(data.items);
      })
      .catch((error) => {
        if (mounted) setLoadFailed(true);
        onError(error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [onError, reloadCount]);
  async function upload(file: File) {
    setMessageError(false);
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setMessage("Escolha uma imagem PNG, JPG ou WebP.");
      setMessageError(true);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage("Esta imagem ultrapassa 8 MB. Escolha uma imagem menor.");
      setMessageError(true);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      const item = await adminRequest<MediaItem>("/api/admin/media", {
        method: "POST",
        body: form,
      });
      setItems((current) => [item, ...current]);
      setMessage(
        onSelect
          ? "Imagem enviada. Selecione Usar imagem neste tópico para inseri-la."
          : "Imagem enviada. Ela já está disponível para selecionar no editor de tópicos.",
      );
    } catch (error) {
      onError(error);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }
  async function copy(item: MediaItem) {
    setMessageError(false);
    try {
      await navigator.clipboard.writeText(item.url);
      setMessage(`Endereço de “${item.name}” copiado.`);
      setCopiedId(item.id);
    } catch {
      setCopiedId(null);
      setMessageError(true);
      setMessage(
        "Não foi possível copiar automaticamente. Selecione o endereço da imagem e copie-o.",
      );
    }
  }
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  const filtered = items.filter((item) => normalize(item.name).includes(normalize(query)));
  return (
    <>
      {onReturn && (
        <button className="adm-back" onClick={onReturn}>
          <ArrowLeft size={17} aria-hidden="true" /> Voltar ao editor
        </button>
      )}
      <header className="adm-page-header">
        <div>
          <h1>Biblioteca de imagens</h1>
          <p className="adm-description">
            {onSelect
              ? "Escolha uma imagem para o tópico em edição ou envie uma nova. Depois, descreva o que ela ensina no editor."
              : "Reúna as ilustrações do projeto. Para inserir uma imagem, abra a biblioteca pelo tópico em edição."}
          </p>
        </div>
      </header>
      <section className="adm-upload" aria-busy={uploading} aria-labelledby="media-upload-title">
        <Upload size={28} aria-hidden="true" />
        <div>
          <h2 id="media-upload-title">Adicionar uma imagem</h2>
          <p id="media-upload-help">
            PNG, JPG ou WebP, até 8 MB. O envio começa ao selecionar o arquivo.
          </p>
          <input
            ref={inputRef}
            id="admin-media-file"
            aria-label="Selecionar imagem para enviar"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={uploading}
            aria-describedby="media-upload-help"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>
      </section>
      <p className={`adm-inline-status${messageError ? " is-error" : ""}`} role={messageError ? "alert" : "status"} aria-atomic="true">
        {uploading ? "Enviando imagem… aguarde a confirmação antes de sair desta página." : message}
      </p>
      <label className="adm-field adm-search">
        <span>Buscar imagens pelo nome</span>
        <div className="adm-search-input">
          <Search size={18} aria-hidden="true" />
          <input className="adm-input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Digite o nome do arquivo" />
        </div>
      </label>
      {!loading && !loadFailed && items.length > 0 && <p className="adm-result-count">{filtered.length} de {items.length} imagens{query ? " encontradas" : " na biblioteca"}</p>}
      {loading ? (
        <p role="status">Carregando imagens…</p>
      ) : loadFailed ? (
        <div className="adm-empty">
          <h2>Não foi possível carregar as imagens</h2>
          <p>
            Verifique a conexão e tente novamente. Seus arquivos continuam no
            servidor.
          </p>
          <button
            className="adm-btn adm-secondary"
            onClick={() => setReloadCount((count) => count + 1)}
          >
            Tentar novamente
          </button>
        </div>
      ) : !items.length ? (
        <div className="adm-empty">
          <Image size={32} aria-hidden="true" />
          <h2>Sua biblioteca está vazia</h2>
          <p>Envie a primeira imagem para ilustrar o conteúdo do Aninhar.</p>
        </div>
      ) : !filtered.length ? (
        <div className="adm-empty">
          <h2>Nenhuma imagem encontrada</h2>
          <p>Tente outro nome ou limpe a busca.</p>
          <button
            className="adm-btn adm-secondary"
            onClick={() => setQuery("")}
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="adm-media-grid">
          {filtered.map((item) => (
            <article className="adm-media-card" key={item.id}>
              <img
                className="adm-media-image"
                src={item.url}
                alt={item.name}
                loading="lazy"
              />
              <div className="adm-media-body">
                <h2>{item.name}</h2>
                <p>
                  {Math.max(1, Math.round(item.size / 1024))} KB ·{" "}
                  {item.mimeType.replace("image/", "").toUpperCase()}
                </p>
                {onSelect && (
                  <button className="adm-btn adm-primary" onClick={() => onSelect(item)}>
                    <Check size={16} aria-hidden="true" /> Usar imagem neste tópico
                  </button>
                )}
                <label className="adm-field">
                  <span>Endereço para usar no conteúdo</span>
                  <input
                    className="adm-input"
                    value={item.url}
                    readOnly
                    onFocus={(e) => e.target.select()}
                  />
                </label>
                <button
                  className="adm-btn adm-secondary"
                  onClick={() => void copy(item)}
                >
                  {copiedId === item.id ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copiedId === item.id ? "Endereço copiado" : "Copiar endereço"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
