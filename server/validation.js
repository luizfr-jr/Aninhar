const ID = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
const VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

function record(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ValidationError(`${label} deve ser um objeto.`);
  return value;
}
function text(value, label, max, optional = false) {
  if (optional && (value === undefined || value === null || value === ""))
    return undefined;
  if (
    typeof value !== "string" ||
    (!optional && !value.trim()) ||
    value.length > max
  )
    throw new ValidationError(
      `${label}: informe um texto${optional ? "" : " não vazio"} de até ${max} caracteres.`,
    );
  return value;
}
function identifier(value, label) {
  if (typeof value !== "string" || value.length > 100 || !ID.test(value))
    throw new ValidationError(
      `${label}: use letras e números, separados por hífens (até 100 caracteres).`,
    );
  return value;
}
function array(value, label, max) {
  if (!Array.isArray(value) || value.length > max)
    throw new ValidationError(`${label}: limite de ${max} itens.`);
  return value;
}
function unique(values, label) {
  if (new Set(values.map((v) => v.id)).size !== values.length)
    throw new ValidationError(`${label}: os identificadores devem ser únicos.`);
  return values;
}
function secureUrl(value, label, local = false) {
  const url = text(value, label, 2048);
  if (local && /^\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && !parsed.username && !parsed.password)
      return url;
  } catch {
    /* Report a useful field error below. */
  }
  throw new ValidationError(
    `${label}: use uma URL HTTPS válida${local ? " ou uma imagem da biblioteca" : ""}.`,
  );
}
function videoUrl(value) {
  const url = secureUrl(value, "Vídeo");
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);
  const id =
    parsed.hostname === "youtu.be"
      ? parts[0]
      : [
            "youtube.com",
            "www.youtube.com",
            "m.youtube.com",
            "www.youtube-nocookie.com",
          ].includes(parsed.hostname)
        ? parts[0] === "watch"
          ? parsed.searchParams.get("v")
          : ["embed", "shorts"].includes(parts[0])
            ? parts[1]
            : null
        : null;
  if (!id || !VIDEO_ID.test(id))
    throw new ValidationError("Vídeo: use o link de um vídeo do YouTube.");
  return url;
}
function section(value, label, withMedia) {
  const s = record(value, label);
  const result = {
    id: identifier(s.id, `${label} / ID`),
    title: text(s.title, `${label} / título`, 200),
    text: text(s.text, `${label} / texto`, 30000),
  };
  if (!withMedia) return result;
  result.links = array(s.links ?? [], `${label} / referências`, 20).map((v) => {
    const link = record(v, "Referência");
    return {
      label: text(link.label, "Nome da referência", 200),
      url: secureUrl(link.url, "Link da referência"),
    };
  });
  if (s.image) {
    const image = record(s.image, "Imagem");
    result.image = {
      src: secureUrl(image.src, "Imagem", true),
      alt: text(image.alt, "Descrição da imagem", 500),
    };
    const caption = text(image.caption, "Legenda da imagem", 1000, true);
    if (caption) result.image.caption = caption;
  }
  if (s.video) {
    const video = record(s.video, "Vídeo");
    result.video = {
      url: videoUrl(video.url),
      title: text(video.title, "Título do vídeo", 200),
    };
  }
  return result;
}
function page(value, label) {
  const p = record(value, label);
  const result = {
    title: text(p.title, `${label} / título`, 200),
    intro: text(p.intro ?? "", `${label} / introdução`, 5000, true) ?? "",
    sections: unique(
      array(p.sections, `${label} / seções`, 100).map((s) =>
        section(s, label, false),
      ),
      label,
    ),
  };
  const email = text(p.email, `${label} / e-mail`, 254, true);
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new ValidationError(`${label}: informe um e-mail válido.`);
    result.email = email;
  }
  return result;
}

export function validateContent(value) {
  const doc = record(value, "Conteúdo");
  const topics = unique(
    array(doc.topics, "Temas", 100).map((value) => {
      const topic = record(value, "Tema");
      return {
        id: identifier(topic.id, "ID do tema"),
        name: text(topic.name, "Nome do tema", 150),
        title: text(topic.title, "Título do tema", 200),
        description:
          text(topic.description ?? "", "Descrição do tema", 5000, true) ?? "",
        sections: unique(
          array(topic.sections, "Seções", 100).map((s) =>
            section(s, "Seção", true),
          ),
          "Seções do tema",
        ),
      };
    }),
    "Temas",
  );
  const pages = record(doc.pages, "Páginas");
  return {
    topics,
    pages: {
      about: page(pages.about, "Sobre"),
      contact: page(pages.contact, "Contato"),
    },
  };
}

export function validateVersion(value) {
  if (!Number.isSafeInteger(value) || value < 1)
    throw new ValidationError(
      "A versão do conteúdo é obrigatória. Recarregue o painel.",
    );
  return value;
}
