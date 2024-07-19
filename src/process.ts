import * as Cache from "./cache";

const $ = (e: ParentNode, s: string): string | undefined =>
  e.querySelector(s)?.outerHTML;

const $$ = (e: ParentNode, s: string): Element[] => [...e.querySelectorAll(s)];

export type S = string | undefined;

export type RO = S;

export type Def2 = { dtrn: string; onyms: string };

export type Onym = Link;

export type Dtrn = string;

export type Def1 = { dtrn: Dtrn; onyms: Onym[]; defs: Def2[] };

export type Def3 = string | null | undefined;

export type Idiom = { idiom: Link; def: Def3[] };

export type Etym = string;

export type Def = {
  etym: Etym;
  defs: Def1[];
  idiom: Idiom[];
};

export type Link = {
  link: string;
  linktext: string;
};

export type Pos = string[];

export type Raw = { raw: string };

export type Sourcelink = Raw;

export type Ending = string;

export type Phon = string;

export type DDO = {
  head: Link;
  pos: Pos;
  sourcelink: Sourcelink;
  endings: Ending[];
  phon: Phon;
  def: Def;
};

export type Thesaurus = { word: S; ms: S[] };

export type Ods = S;

export type Result = {
  ro: RO[];
  ddo: DDO[];
  thesaurus: Thesaurus[];
  ods: Ods[];
};

const process = (doc: ParentNode): Result => {
  const ro = $$(doc, ".ro .snippet_text").map((e) => e.outerHTML);
  const ddo = $$(doc, ".ar").map(
    (ar): DDO => ({
      head: {
        link: ar.querySelector(".head a")?.getAttribute("href") || "",
        linktext: ar.querySelector(".head a")?.innerHTML || "",
      },
      pos:
        ar
          .querySelector(".pos")
          ?.textContent?.split(",")
          .map((s) => s.trim()) || [],
      sourcelink: { raw: $(ar, ".sourcelink") || "" },
      endings:
        ar
          .querySelector(".m")
          ?.textContent?.split(",")
          .map((s) => s.trim()) || [],
      phon: ar.querySelector(".phon")?.textContent?.trim() || "",
      // def: $(ar, ".def"),
      def: {
        etym: $(ar, ".etym") || "",
        defs: $$(ar, ":scope > .def > .def").map(
          (def): Def1 => ({
            dtrn: def.querySelector(":scope > .dtrn")?.innerHTML || "",
            onyms: [
              ...def.querySelectorAll(":scope > .onyms .synonym .k a"),
            ].map(
              (x): Onym => ({
                link: x.getAttribute("href") || "",
                linktext: x.innerHTML,
              }),
            ),
            defs: $$(def, ":scope > .def").map(
              (def): Def2 => ({
                dtrn: $(def, ":scope > .dtrn") || "",
                onyms: $(def, ":scope > .onyms") || "",
              }),
            ),
          }),
        ),
        idiom: $$(ar, ":scope > .def > .idiom > .idiom").map(
          (idiom): Idiom => ({
            idiom: {
              link: idiom.querySelector("a")?.getAttribute("href") || "",
              linktext: idiom.querySelector("a")?.innerHTML || "",
            },
            def: [...idiom.querySelectorAll(".dtrn")].map(
              (dtrn) => dtrn.innerHTML,
            ),
          }),
        ),
      },
    }),
  );
  const ods = $$(doc, ".articles").map((e) => e.outerHTML);
  const thesaurus = $$(doc, "#thesaurus-content li").map((li) => ({
    word: $(li, ".word"),
    ms: $$(li, ".m").map((e) => e.outerHTML),
  }));
  const res: Result = {
    // Retskrivningsordbogen
    ro,
    // Den danske ordbog
    ddo,
    // Den danske synonymordbog
    thesaurus,
    // Ordbog over det danske sprog
    ods,
  };
  return res;
};

export const processAndStore = (k: string, node: ParentNode): Result => {
  // Unsafe "as any".
  const x: Cache.Rec<string, Result> = Cache.load(
    "query-cached-processed",
  ) as any;
  const res = process(node);
  x[k] = res;
  Cache.store("query-cached-processed", x);
  return res;
};
