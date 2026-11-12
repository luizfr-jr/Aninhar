import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ContentDocument, PageRecord } from "../types/content";
import { Field } from "./fields";
import { moveItem, newId } from "./utils";

export default function PageEditor({
  pages,
  onChange,
}: {
  pages: ContentDocument["pages"];
  onChange: (pages: ContentDocument["pages"]) => void;
}) {
  const [selected, setSelected] = useState<"about" | "contact">("about");
  const page = pages[selected];
  const update = (next: PageRecord) => onChange({ ...pages, [selected]: next });
  return (
    <>
      <header className="adm-page-header">
        <div>
          <h1>Páginas do site</h1>
          <p className="adm-description">
            Mantenha as informações institucionais e os canais de contato
            atualizados.
          </p>
        </div>
      </header>
      <div className="adm-tabs" role="group" aria-label="Escolha uma página">
        <button
          className={`adm-btn ${selected === "about" ? "adm-primary" : "adm-secondary"}`}
          aria-pressed={selected === "about"}
          onClick={() => setSelected("about")}
        >
          Sobre o Aninhar
        </button>
        <button
          className={`adm-btn ${selected === "contact" ? "adm-primary" : "adm-secondary"}`}
          aria-pressed={selected === "contact"}
          onClick={() => setSelected("contact")}
        >
          Contato
        </button>
      </div>
      <section className="adm-card adm-stack">
        <h2>{selected === "about" ? "Sobre o Aninhar" : "Contato"}</h2>
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
        <h2>Blocos de conteúdo</h2>
        <button
          className="adm-btn adm-secondary"
          onClick={() =>
            update({
              ...page,
              sections: [
                ...page.sections,
                { id: newId("bloco"), title: "", text: "" },
              ],
            })
          }
        >
          <Plus size={17} aria-hidden="true" /> Adicionar bloco
        </button>
      </div>
      <div className="adm-stack">
        {page.sections.map((section, index) => (
          <section key={section.id} className="adm-card adm-stack">
            <div className="adm-section-tools">
              <h3>Bloco {index + 1}</h3>
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
                </button>
                <button
                  className="adm-btn adm-danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Remover o bloco “${section.title || index + 1}” do rascunho?`,
                      )
                    )
                      update({
                        ...page,
                        sections: page.sections.filter((_, i) => index !== i),
                      });
                  }}
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
