export type Page = "ddo" | "ods" | "ro" | "thesaurus";

export const isPage = (x: string): x is Page =>
  ["ddo", "ods", "ro", "thesaurus"].includes(x);
