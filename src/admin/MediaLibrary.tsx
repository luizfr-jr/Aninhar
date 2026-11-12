import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Copy, Image, Upload } from "lucide-react";
import { adminRequest, type MediaItem } from "./api";

export default function MediaLibrary({
  onError,
  onReturn,
}: {
  onError: (error: unknown) => void;
  onReturn?: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
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
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setMessage("Escolha uma imagem PNG, JPG ou WebP.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMessage("Esta imagem ultrapassa 8 MB. Escolha uma imagem menor.");
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
        "Imagem enviada. Copie o endereço e use-o no tópico desejado.",
      );
    } catch (error) {
      onError(error);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }
  async function copy(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url);
      setMessage(`Endereço de “${item.name}” copiado.`);
    } catch {
      setMessage(
        "Não foi possível copiar automaticamente. Selecione o endereço da imagem e copie-o.",
      );
    }
  }
  const filtered = items.filter((item) =>
    item.name
      .toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR")),
  );
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
            Envie ilustrações e use seus endereços nos tópicos. Os arquivos
            ficam salvos no servidor.
          </p>
        </div>
      </header>
      <section className="adm-upload">
        <Upload size={28} aria-hidden="true" />
        <div>
          <h2>Adicionar uma imagem</h2>
          <p>
            PNG, JPG ou WebP, até 8 MB. Prefira arquivos legíveis no celular.
          </p>
          <input
            ref={inputRef}
            id="admin-media-file"
            aria-label="Selecionar imagem para enviar"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>
      </section>
      <p className="adm-inline-status" role="status">
        {message}
      </p>
      <label className="adm-field adm-search">
        <span>Buscar imagens pelo nome</span>
        <input
          className="adm-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome do arquivo"
        />
      </label>
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
                  <Copy size={16} aria-hidden="true" /> Copiar endereço
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
