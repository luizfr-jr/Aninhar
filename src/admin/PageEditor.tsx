import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ContentDocument, PageRecord } from "../types/content";
import { Field } from "./fields";
import { moveItem, newId } from "./utils";

export default function PageEditor({
  pages,
  onChange,
  selectedPage,
  onPageChange,
}: {
  pages: ContentDocument["pages"];
  onChange: (pages: ContentDocument["pages"]) => void;
  selectedPage?: "about" | "contact";
  onPageChange?: (page: "about" | "contact") => void;
}) {
  const [selected, setSelected] = useState<"about" | "contact">(selectedPage ?? "about");
  const addButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (selectedPage) setSelected(selectedPage);
  }, [selectedPage]);
  const page = pages[selected];
  const update = (next: PageRecord) => onChange({ ...pages, [selected]: next });
  function addBlock() {
    const id = newId("bloco");
    update({ ...page, sections: [...page.sections, { id, title: "", text: "" }] });
    requestAnimationFrame(() => {
      const block = document.getElementById(`page-block-${id}`);
      block?.scrollIntoView({ block: "start" });
      block?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    });
  }
  function removeBlock(index: number) {
    const section = page.sections[index];
    if (!window.confirm(`Remover o bloco “${section.title || index + 1}” do rascunho?`)) return;
    const remaining = page.sections.filter((_, i) => index !== i);
    update({ ...page, sections: remaining });
    requestAnimationFrame(() => {
      const next = remaining[Math.min(index, remaining.length - 1)];
      const input = next
        ? document.getElementById(`page-block-${next.id}`)?.querySelector<HTMLInputElement>("input")
        : null;
      (input ?? addButton.current)?.focus();
    });
  }
  return (
    <>
      <header className="adm-page-header">
        <div>
          <p className="adm-eyebrow">INFORMAÇÕES DO PROJETO</p>
          <h1>Páginas do site</h1>
          <p className="adm-description">
            Mantenha as informações institucionais e os canais de contato
            atualizados.
          </p>
        </div>
      </header>
      <div className="adm-tabs adm-page-picker" role="group" aria-label="Escolha uma página">
        <button
          className={`adm-btn ${selected === "about" ? "adm-primary" : "adm-secondary"}`}
          aria-pressed={selected === "about"}
          aria-label="Sobre o Aninhar"
          onClick={() => { setSelected("about"); onPageChange?.("about"); }}
        >
          <span><strong>Sobre o Aninhar</strong><small>Apresente o projeto e sua proposta.</small></span>
        </button>
        <button
          className={`adm-btn ${selected === "contact" ? "adm-primary" : "adm-secondary"}`}
          aria-pressed={selected === "contact"}
          aria-label="Contato"
          onClick={() => { setSelected("contact"); onPageChange?.("contact"); }}
        >
          <span><strong>Contato</strong><small>Oriente como falar com a equipe.</small></span>
        </button>
      </div>
      <section className="adm-card adm-stack">
        <h2>{selected === "about" ? "Sobre o Aninhar" : "Contato"}</h2>
        <p className="adm-help">Edite a apresentação abaixo e organize os blocos na sequência de leitura. Campos com * são obrigatórios.</p>
        <Field label="Título da página" required>
          <input
            className="adm-input"
            value={page.title}
            maxLength={200}
            onChange={(e) => update({ ...page, title: e.target.value })}
          />
        </Field>
        <Field
          label="Apresentação"
          help="Um resumo que aparece logo abaixo do título."
        >
          <textarea
            className="adm-textarea"
            rows={3}
            value={page.intro}
            maxLength={1000}
            onChange={(e) => update({ ...page, intro: e.target.value })}
          />
        </Field>
        {selected === "contact" && (
          <Field
            label="E-mail de contato"
            help="Opcional. Só informe um endereço oficial que realmente receba mensagens; ele aparecerá no site como um link para enviar e-mail."
            validate={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Informe um e-mail de contato válido."}
          >
            <input
              className="adm-input"
              type="email"
              value={page.email ?? ""}
              placeholder="contato@instituicao.org.br"
              onChange={(e) => update({ ...page, email: e.target.value })}
            />
          </Field>
        )}
      </section>
      <div className="adm-card-header">
        <div>
          <h2>Blocos de conteúdo <span className="adm-badge">{page.sections.length}</span></h2>
          <p className="adm-help">Cada bloco aparece como uma seção da página pública.</p>
        </div>
        <button
          ref={addButton}
          className="adm-btn adm-secondary"
          onClick={addBlock}
        >
          <Plus size={17} aria-hidden="true" /> Adicionar bloco
        </button>
      </div>
      <div className="adm-stack">
        {page.sections.map((section, index) => (
          <section key={section.id} id={`page-block-${section.id}`} className="adm-card adm-stack adm-page-block">
            <div className="adm-section-tools">
              <div>
                <p className="adm-block-position">Bloco {index + 1} de {page.sections.length}</p>
                <h3>{section.title || "Novo bloco"}</h3>
              </div>
              <div className="adm-row-actions">
                <button
                  className="adm-btn adm-quiet"
                  disabled={index === 0}
                  onClick={() =>
                    update({
                      ...page,
                      sections: moveItem(page.sections, index, -1),
                    })
                  }
                  aria-label={`Mover bloco ${index + 1} para cima`}
                >
                  <ArrowUp size={17} aria-hidden="true" />
                  <span>Subir</span>
                </button>
                <button
                  className="adm-btn adm-quiet"
                  disabled={index === page.sections.length - 1}
                  onClick={() =>
                    update({
                      ...page,
                      sections: moveItem(page.sections, index, 1),
                    })
                  }
                  aria-label={`Mover bloco ${index + 1} para baixo`}
                >
                  <ArrowDown size={17} aria-hidden="true" />
                  <span>Descer</span>
                </button>
                <button
                  className="adm-btn adm-danger"
                  onClick={() => removeBlock(index)}
                >
                  <Trash2 size={16} aria-hidden="true" /> Remover
                </button>
              </div>
            </div>
            <Field label={`Título do bloco ${index + 1}`} required>
              <input
                className="adm-input"
                value={section.title}
                maxLength={200}
                onChange={(e) =>
                  update({
                    ...page,
                    sections: page.sections.map((item, i) =>
                      i === index ? { ...item, title: e.target.value } : item,
                    ),
                  })
                }
              />
            </Field>
            <Field label={`Texto do bloco ${index + 1}`} required>
              <textarea
                className="adm-textarea"
                rows={7}
                value={section.text}
                maxLength={30000}
                onChange={(e) =>
                  update({
                    ...page,
                    sections: page.sections.map((item, i) =>
                      i === index ? { ...item, text: e.target.value } : item,
                    ),
                  })
                }
              />
            </Field>
          </section>
        ))}
      </div>
      {!page.sections.length && (
        <div className="adm-empty">
          <h3>Nenhum bloco de conteúdo</h3>
          <p>Adicione um bloco para explicar esta página aos visitantes.</p>
        </div>
      )}
    </>
  );
}
