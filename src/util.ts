import * as Router from "react-router-dom";

export const useSearchParam = (
  k: string,
): [string | null, (value: string) => void] => {
  const [searchParams, setSearchParams] = Router.useSearchParams();
  return [
    searchParams.get(k),
    (v: string) => setSearchParams({ ...(v && { [k]: v }) }),
  ];
};

export const words: string[] = [
  "fisk",
  "tømmermænd",
  "taber",
  "fs",
  "kvindekær",
  "bindegal",
  "kagemand",
  "huskekage",
  "drivert",
  "ballademager",
  "fedterøv",
  "uskyldig",
  "blærerøv",
  "dna-prøve",
  "fiskefars",
  "pigeglad",
  "pige-glad",
  "kvindefjendsk",
  "dameglad",
  "hapsemad",
  "haps",
  "litografi",
  "minister",
  "lappedykker",
  "kneppe",
  "sex",
  "anlade",
  "lede",
  "asdasd",
  "applikation",
  "fisksdfsdf",
  "spændeskive",
  "lampefeber",
  "fars",
  "params",
  "query",
  "jiddish",
  "yiddish",
  "heidegger",
  "hash",
  "galar",
  "hashish",
  "cannabis",
  "ganja",
  "funky",
  "bas",
  "basstemme",
  "sopran",
  "sopranstemme",
  "fistel",
  "organ",
  "bingo",
  "banko",
  "bankospil",
  "bingospil",
  "flaps",
  "flapslaps",
  "laps",
  "flap",
  "bar",
];

export const pick = <T>(xs: Array<T>): T => {
  const idx = Math.floor(Math.random() * words.length);
  return xs[idx];
};

export const fromHTML = (html: string): DocumentFragment => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
};
