export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
export function formatDate(value: string | null | undefined) {
  if (!value) return "Ainda não publicado";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Data indisponível"
    : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
