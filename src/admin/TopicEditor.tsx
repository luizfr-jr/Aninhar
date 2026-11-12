import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  Image,
  Link,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import type { TopicRecord, TopicSection } from "../types/content";
import { validExternalUrl, validImageUrl, validVideoUrl } from "./validation";
import { Field } from "./fields";
import { moveItem, newId } from "./utils";

export default function TopicEditor({
  topic,
  onChange,
  onDelete,
  canPreview,
  onMedia,
  initialSectionId,
}: {
  topic: TopicRecord;
  onChange: (topic: TopicRecord) => void;
  onDelete: () => void;
  canPreview: boolean;
  onMedia: (sectionId: string) => void;
  initialSectionId?: string;
}) {
  const [expanded, setExpanded] = useState(
    () =>
      new Set(
        topic.sections
          .filter((section) => !section.title || section.id === initialSectionId)
          .map((section) => section.id),
      ),
  );
  useEffect(() => {
    if (!initialSectionId) return;
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(`edit-${initialSectionId}`);
      section?.querySelector("summary")?.focus({ preventScroll: true });
      section?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [initialSectionId]);
  function updateSection(index: number, patch: Partial<TopicSection>) {
    onChange({
      ...topic,
      sections: topic.sections.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    });
  }
  function addSection() {
    const section = { id: newId("secao"), title: "", text: "", links: [] };
    setExpanded((current) => new Set([...current, section.id]));
    onChange({ ...topic, sections: [...topic.sections, section] });
    requestAnimationFrame(() => {
      const element = document.getElementById(`edit-${section.id}`);
      element?.scrollIntoView({ block: "start" });
      element?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    });
  }
  const pendingSections = topic.sections.filter(
    (section) => !section.title.trim() || !section.text.trim(),
  ).length;
  return (
    <>
      <a className="adm-back" href="#topics">
        <ArrowLeft size={17} aria-hidden="true" /> Todos os temas
      </a>
      <header className="adm-page-header">
        <div>
          <p className="adm-eyebrow">EDITAR TEMA</p>
          <h1>{topic.name || "Novo tema"}</h1>
          <p className="adm-description">
            Edite a apresentação e organize os tópicos na ordem de leitura. As
            alterações só aparecem no site após publicar.
          </p>
        </div>
        {canPreview && (
          <a
            className="adm-btn adm-secondary"
            href={`/?preview=1#topic/${encodeURIComponent(topic.id)}`}
            target="_blank"
            rel="noreferrer"
          >
            Ver prévia <ExternalLink size={16} aria-hidden="true" />
          </a>
        )}
      </header>
      <section
        className="adm-card adm-stack"
        aria-labelledby="topic-details-title"
      >
        <h2 id="topic-details-title">Apresentação do tema</h2>
        <p className="adm-help">
          Campos com * são obrigatórios. O nome curto aparece no menu lateral.
        </p>
        <div className="adm-field-grid">
          <Field label="Nome no menu" required>
            <input
              className="adm-input"
              value={topic.name}
              maxLength={150}
              onChange={(e) => onChange({ ...topic, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Título completo" required>
            <input
              className="adm-input"
              value={topic.title}
              maxLength={200}
              onChange={(e) => onChange({ ...topic, title: e.target.value })}
              required
            />
          </Field>
        </div>
        <Field
          label="Descrição breve"
          help="Uma frase para explicar o que a família encontrará neste tema."
        >
          <textarea
            className="adm-textarea"
            rows={3}
            value={topic.description}
            maxLength={1000}
            onChange={(e) =>
              onChange({ ...topic, description: e.target.value })
            }
          />
        </Field>
      </section>
      <div className="adm-editor-guide">
        <div>
          <strong>Escreva primeiro. Enriqueça depois.</strong>
          <p>Comece pelo título e pelo texto. Imagem, vídeo e referências ficam nas opções de cada tópico.</p>
        </div>
        <span className={`adm-badge${pendingSections ? " is-warning" : ""}`}>
          {pendingSections
            ? `${pendingSections} ${pendingSections === 1 ? "tópico sem título ou texto" : "tópicos sem título ou texto"}`
            : `${topic.sections.length} ${topic.sections.length === 1 ? "tópico" : "tópicos"}`}
        </span>
      </div>
      <div className="adm-card-header">
        <div>
          <h2>
            Tópicos do tema{" "}
            <span className="adm-badge">{topic.sections.length}</span>
          </h2>
          <p className="adm-help">
            Abra um tópico por vez. Use Subir e Descer para mudar a ordem no site.
          </p>
        </div>
        <button className="adm-btn adm-secondary" onClick={addSection}>
          <Plus size={17} aria-hidden="true" /> Adicionar tópico
        </button>
      </div>
      {topic.sections.length > 1 && (
        <div className="adm-editor-view-controls" aria-label="Visualização dos tópicos">
          <button
            className="adm-btn adm-quiet"
            onClick={() => setExpanded(new Set(topic.sections.map((section) => section.id)))}
          >Abrir todos</button>
          <button className="adm-btn adm-quiet" onClick={() => setExpanded(new Set())}>
            Recolher todos
          </button>
        </div>
      )}
      {!topic.sections.length && (
        <div className="adm-empty">
          <h3>Este tema ainda não tem tópicos</h3>
          <p>Adicione o primeiro tópico para começar a escrever.</p>
          <button className="adm-btn adm-primary" onClick={addSection}>
            <Plus size={17} aria-hidden="true" /> Criar primeiro tópico
          </button>
        </div>
      )}
      <div className="adm-stack">
        {topic.sections.map((section, index) => (
          <details
            key={section.id}
            id={`edit-${section.id}`}
            className="adm-section"
            open={expanded.has(section.id)}
            onToggle={(event) => {
              const isOpen = event.currentTarget.open;
              setExpanded((current) => {
                if (current.has(section.id) === isOpen) return current;
                const next = new Set(current);
                if (isOpen) next.add(section.id);
                else next.delete(section.id);
                return next;
              });
            }}
          >
            <summary className="adm-section-summary">
              <span className="adm-section-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                {section.title || "Novo tópico — preencha o título"}
                <small>
                  {!section.title.trim() || !section.text.trim() ? "Falta título ou texto" : "Título e texto preenchidos"}
                  {section.image ? " · Imagem" : ""}
                  {section.video ? " · Vídeo" : ""}
                  {section.links.length ? ` · ${section.links.length} ${section.links.length === 1 ? "referência" : "referências"}` : ""}
                </small>
              </span>
            </summary>
            <div className="adm-section-body adm-stack">
              <div className="adm-section-tools">
                <span className="adm-help">
                  Posição {index + 1} de {topic.sections.length}
                </span>
                <div className="adm-row-actions">
                  <button
                    className="adm-btn adm-quiet"
                    disabled={index === 0}
                    aria-label={`Mover tópico ${section.title || index + 1} para cima`}
                    onClick={() =>
                      onChange({
                        ...topic,
                        sections: moveItem(topic.sections, index, -1),
                      })
                    }
                  >
                    <ArrowUp size={17} aria-hidden="true" /> Subir
                  </button>
                  <button
                    className="adm-btn adm-quiet"
                    disabled={index === topic.sections.length - 1}
                    aria-label={`Mover tópico ${section.title || index + 1} para baixo`}
                    onClick={() =>
                      onChange({
                        ...topic,
                        sections: moveItem(topic.sections, index, 1),
                      })
                    }
                  >
                    <ArrowDown size={17} aria-hidden="true" /> Descer
                  </button>
                  <button
                    className="adm-btn adm-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Remover o tópico “${section.title || "sem título"}” deste rascunho?`,
                        )
                      )
                        onChange({
                          ...topic,
                          sections: topic.sections.filter(
                            (_, i) => i !== index,
                          ),
                        });
                    }}
                  >
                    <Trash2 size={16} aria-hidden="true" /> Remover tópico
                  </button>
                </div>
              </div>
              <Field label="Título do tópico" required>
                <input
                  className="adm-input"
                  value={section.title}
                  maxLength={200}
                  onChange={(e) =>
                    updateSection(index, { title: e.target.value })
                  }
                  required
                />
              </Field>
              <Field
                label="Texto completo"
                required
                help="Use parágrafos curtos e revise as orientações com a responsável clínica antes de publicar."
              >
                <textarea
                  className="adm-textarea"
                  rows={9}
                  value={section.text}
                  maxLength={30000}
                  onChange={(e) =>
                    updateSection(index, { text: e.target.value })
                  }
                  required
                />
              </Field>
              <details className="adm-option-group" open={Boolean(section.image)}>
                <summary><Image size={19} aria-hidden="true" /><span>Imagem ilustrativa</span><small>Opcional</small></summary>
                <div className="adm-option-body">
                <p className="adm-help">
                  Escolha uma imagem na biblioteca para inserir neste tópico
                  ou cole o endereço HTTPS de uma ilustração aprovada.
                </p>
                <div className="adm-field-grid">
                  <Field label="Endereço da imagem" validate={(value) => validImageUrl(value) ? undefined : "Use uma imagem da biblioteca ou um endereço HTTPS válido."}>
                    <input
                      className="adm-input"
                      value={section.image?.src ?? ""}
                      placeholder="Endereço da biblioteca ou https://…"
                      onChange={(e) =>
                        updateSection(index, {
                          image: e.target.value
                            ? {
                                src: e.target.value,
                                alt: section.image?.alt ?? "",
                                ...(section.image?.caption
                                  ? { caption: section.image.caption }
                                  : {}),
                              }
                            : undefined,
                        })
                      }
                    />
                  </Field>
                  <div className="adm-field adm-field-action">
                    <span>Arquivos do projeto</span>
                    <button className="adm-btn adm-secondary" onClick={() => onMedia(section.id)}>
                      <Image size={17} aria-hidden="true" /> Abrir biblioteca
                    </button>
                  </div>
                </div>
                {section.image && (
                  <>
                    <Field
                      label="Descrição da imagem para acessibilidade"
                      required
                      help="Descreva o que a imagem ensina, sem repetir apenas o título."
                    >
                      <input
                        className="adm-input"
                        value={section.image.alt}
                        maxLength={500}
                        onChange={(e) =>
                          updateSection(index, {
                            image: { ...section.image!, alt: e.target.value },
                          })
                        }
                        required
                      />
                    </Field>
                    <Field label="Legenda e crédito">
                      <input
                        className="adm-input"
                        value={section.image.caption ?? ""}
                        maxLength={1000}
                        onChange={(e) =>
                          updateSection(index, {
                            image: {
                              ...section.image!,
                              caption: e.target.value,
                            },
                          })
                        }
                      />
                    </Field>
                    <button
                      className="adm-btn adm-quiet"
                      onClick={() => updateSection(index, { image: undefined })}
                    >
                      Retirar imagem do tópico
                    </button>
                  </>
                )}
                </div>
              </details>
              <details className="adm-option-group" open={Boolean(section.video)}>
                <summary><Video size={19} aria-hidden="true" /><span>Vídeo do YouTube</span><small>Opcional</small></summary>
                <div className="adm-option-body">
                <Field
                  label="Link do vídeo"
                  help="Cole o link de um vídeo aprovado. Ele será exibido dentro do tópico."
                  validate={(value) => validVideoUrl(value) ? undefined : "Use um link válido de vídeo do YouTube."}
                >
                  <input
                    className="adm-input"
                    value={section.video?.url ?? ""}
                    placeholder="https://www.youtube.com/watch?v=…"
                    onChange={(e) =>
                      updateSection(index, {
                        video: e.target.value
                          ? {
                              url: e.target.value,
                              title: section.video?.title ?? "",
                            }
                          : undefined,
                      })
                    }
                  />
                </Field>
                {section.video && (
                  <Field label="Título do vídeo" required>
                    <input
                      className="adm-input"
                      value={section.video.title}
                      maxLength={200}
                      onChange={(e) =>
                        updateSection(index, {
                          video: { ...section.video!, title: e.target.value },
                        })
                      }
                      required
                    />
                  </Field>
                )}
                </div>
              </details>
              <details className="adm-option-group" open={section.links.length > 0}>
                <summary><Link size={19} aria-hidden="true" /><span>Referências e leitura complementar</span><small>Opcional</small></summary>
                <div className="adm-option-body">
                <p className="adm-help">
                  Inclua fontes verificadas e links HTTPS.
                </p>
                {section.links.map((link, linkIndex) => (
                  <div className="adm-inline-fields" key={linkIndex}>
                    <Field
                      label={`Nome da referência ${linkIndex + 1}`}
                      required
                    >
                      <input
                        className="adm-input"
                        value={link.label}
                        onChange={(e) =>
                          updateSection(index, {
                            links: section.links.map((item, i) =>
                              i === linkIndex
                                ? { ...item, label: e.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                    </Field>
                    <Field
                      label={`Endereço da referência ${linkIndex + 1}`}
                      required
                      validate={(value) => validExternalUrl(value) ? undefined : "Use um endereço completo iniciado por https://."}
                    >
                      <input
                        className="adm-input"
                        value={link.url}
                        placeholder="https://…"
                        onChange={(e) =>
                          updateSection(index, {
                            links: section.links.map((item, i) =>
                              i === linkIndex
                                ? { ...item, url: e.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                    </Field>
                    <button
                      className="adm-btn adm-quiet"
                      aria-label={`Remover referência ${linkIndex + 1}`}
                      onClick={() =>
                        updateSection(index, {
                          links: section.links.filter(
                            (_, i) => i !== linkIndex,
                          ),
                        })
                      }
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <button
                  className="adm-btn adm-secondary"
                  onClick={() =>
                    updateSection(index, {
                      links: [...section.links, { label: "", url: "" }],
                    })
                  }
                >
                  <Plus size={17} aria-hidden="true" /> Adicionar referência
                </button>
                </div>
              </details>
            </div>
          </details>
        ))}
      </div>
      <section className="adm-card adm-danger-zone">
        <h2>Remover este tema</h2>
        <p>
          O tema será removido do rascunho. A mudança só alcança o site quando
          você publicar.
        </p>
        <button className="adm-btn adm-danger" onClick={onDelete}>
          <Trash2 size={17} aria-hidden="true" /> Remover tema
        </button>
      </section>
    </>
  );
}
