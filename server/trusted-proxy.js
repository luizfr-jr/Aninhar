import { isIP } from "node:net";

/** Only explicit proxy addresses/subnets are accepted; never trust arbitrary hops. */
export function parseTrustedProxy(value) {
  if (value === undefined || value === null || value === "") return [];
  if (typeof value !== "string") {
    throw new Error(
      "TRUST_PROXY deve ser uma lista de endereços IP ou redes CIDR, separada por vírgulas.",
    );
  }
  const addresses = value
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  for (const address of addresses) {
    const parts = address.split("/");
    const version = isIP(parts[0]);
    const prefix = parts[1];
    if (
      !version ||
      parts.length > 2 ||
      (prefix !== undefined &&
        (!/^\d+$/.test(prefix) ||
          Number(prefix) < 1 ||
          Number(prefix) > (version === 4 ? 32 : 128)))
    ) {
      throw new Error(
        "TRUST_PROXY inválido. Use somente IPs ou redes CIDR específicas dos proxies, sem nomes, contagem de saltos ou redes /0.",
      );
    }
  }
  return [...new Set(addresses)];
}
