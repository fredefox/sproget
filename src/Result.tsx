import React from "react";
import "./Result.css";
import * as Cache from "./cache";

export const fetchSample = () => fetch("http://localhost:3002");

export const fetchLookup = (query: string) =>
  fetch(
    `http://localhost:3001/lookup?SearchableText=${encodeURIComponent(query)}`,
  );

const performQuery = (query: string) => fetchLookup(query);

const doQuery: (x: string) => Promise<string> = async (query: string) => {
  const response = await performQuery(query);
  const body = await response.text();
  const template = fromHTML(body);
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
