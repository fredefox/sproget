import React from "react";
import "./Result.css";
import * as Cache from "./cache";

export const fetchSample = () => fetch("http://localhost:3002");

export const fetchLookup = (query: string) =>
  fetch(
    `http://localhost:3001/lookup?SearchableText=${encodeURIComponent(query)}`,
  );

const performQuery = (query: string) => fetchLookup(query);

const $ = (e: ParentNode, s: string): string | undefined =>
  e.querySelector(s)?.outerHTML;

const $$ = (e: ParentNode, s: string): Element[] => [...e.querySelectorAll(s)];

type S = string | undefined;

type RO = S;

type Def2 = { dtrn: S; onyms: S };

type Def1 = { dtrn: S; onyms: S; defs: Def2[] };

type Idiom = { idiom: S; def: S };

type Def = {
  etym: S;
  defs: Def1[];
  idiom: Idiom[];
};

type DDO = { head: S; pos: S; sourcelink: S; m: S; phon: S; def: Def };

type Thesaurus = { word: S; ms: S[] };

type ODS = S;

type Processed = {
  ro: RO[];
  ddo: DDO[];
  thesaurus: Thesaurus[];
  ods: ODS[];
};

const process = (doc: ParentNode): Processed => {
  const ro = $$(doc, ".ro .snippet_text").map((e) => e.outerHTML);
  const ddo = $$(doc, ".ar").map(
    (ar): DDO => ({
      head: $(ar, ".head"),
      pos: $(ar, ".pos"),
      sourcelink: $(ar, ".sourcelink"),
      m: $(ar, ".m"),
      phon: $(ar, ".phon"),
      // def: $(ar, ".def"),
      def: {
        etym: $(ar, ".etym"),
        defs: $$(ar, ":scope > .def > .def").map(
          (def): Def1 => ({
            dtrn: $(def, ":scope > .dtrn"),
            onyms: $(def, ":scope > .onyms"),
            defs: $$(def, ":scope > .def").map(
              (def): Def2 => ({
                dtrn: $(def, ":scope > .dtrn"),
                onyms: $(def, ":scope > .onyms"),
              }),
            ),
          }),
        ),
        idiom: $$(ar, ":scope > .def > .idiom > .idiom").map((idiom) => ({
          idiom: $(idiom, "a"),
          def: $(idiom, ".def"),
        })),
      },
    }),
  );
  const ods = $$(doc, ".articles").map((e) => e.outerHTML);
  const thesaurus = $$(doc, "#thesaurus-content li").map((li) => ({
    word: $(li, ".word"),
    ms: $$(li, ".m").map((e) => e.outerHTML),
  }));
  const res: Processed = {
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

const processAndStore = (k: string, node: ParentNode): Processed => {
  // Unsafe "as any".
  const x: Cache.Rec<string, Processed> = Cache.load(
    "query-cached-processed",
  ) as any;
  const res = process(node);
  x[k] = res;
  Cache.store("query-cached-processed", x);
  return res;
};

const doQuery = async (query: string): Promise<string> => {
  const response = await performQuery(query);
  const body = await response.text();
  const template = fromHTML(body);
  processAndStore(query, template);
  const element = template.querySelector("#portal-columns");
  return element?.outerHTML || "";
};

const parse: Cache.Parse<string> = (s) => s;
const encode: Cache.Encode<string> = (s) => s;

const serializer: Cache.Serialize<string> = [parse, encode];

const doQueryCached: (x: string) => Promise<string> = Cache.cached(
  serializer,
  "query-cache",
  doQuery,
);

const fromHTML = (html: string): DocumentFragment => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
};

export const Result = ({ query }: { query: string }): React.ReactElement => {
  const [html, setHtml] = React.useState<null | string>(null);
  React.useEffect(
    () =>
      void (async () => {
        const element = await doQueryCached(query);
        setHtml(element);
      })(),
    [query],
  );
  // console.log({ doc });
  if (html === null) return <></>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const main = () => {
  const cache: Cache.Cache = Cache.loadCache("query-cache");
  const _x: { [k: string]: undefined | "" | Processed } = Object.fromEntries(
    Object.entries(cache)
      // .slice(0, 1)
      .map(([k, s]) => [k, s && processAndStore(k, fromHTML(s))]),
  );
};

main();
