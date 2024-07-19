import React from "react";
import "./Result.css";
import * as Cache from "./cache";
import * as Process from "./process";

export const fetchSample = () => fetch("http://localhost:3002");

export const fetchLookup = (query: string) =>
  fetch(
    `http://localhost:3001/lookup?SearchableText=${encodeURIComponent(query)}`,
  );

const performQuery = (query: string) => fetchLookup(query);

const doQuery = async (query: string): Promise<Process.Result> => {
  const response = await performQuery(query);
  const body = await response.text();
  const template = fromHTML(body);
  const element = template.querySelector("#portal-columns");
  element &&
    [...element.querySelectorAll("a")].forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || !href.match(/^lookup/)) return;
      const m = href.match(/\?.*/);
      if (!m) return;
      const query = new URLSearchParams(m[0]).get("SearchableText");
      a.setAttribute("href", `?query=${query}`);
    });
  return Process.processAndStore(query, template);
};

const parse: Cache.Parse<Process.Result> = (s) => JSON.parse(s);
const encode: Cache.Encode<Process.Result> = (res) => JSON.stringify(res);

const serializer: Cache.Serialize<Process.Result> = [parse, encode];

const doQueryCached: (x: string) => Promise<Process.Result> =
  Cache.cached<Process.Result>(serializer, "query-cache", doQuery);

const fromHTML = (html: string): DocumentFragment => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
};

const Link = ({
  value: { link, linktext },
}: {
  value: Process.Link;
}): React.ReactElement => (
  <a href={link} dangerouslySetInnerHTML={{ __html: linktext }}></a>
);

const Pos = ({ value }: { value: Process.Pos }): React.ReactElement => (
  <>
    {value.map((p, idx) => [
      idx > 0 && ", ",
      <span key={idx} dangerouslySetInnerHTML={{ __html: p }}></span>,
    ])}
  </>
);

export const Sourcelink = ({
  value: { raw },
}: {
  value: Process.Sourcelink;
}): React.ReactElement => (
  <span dangerouslySetInnerHTML={{ __html: raw }}></span>
);

export const Ending = ({
  value,
}: {
  value: Process.Ending;
}): React.ReactElement => <li>{value}</li>;

export const Phon = ({
  value,
}: {
  value: Process.Phon;
}): React.ReactElement => <p className="phon">{value}</p>;

export const Etym = ({
  value,
}: {
  value: Process.Etym;
}): React.ReactElement => (
  <>{value && <p dangerouslySetInnerHTML={{ __html: value }}></p>}</>
);

export const Dtrn = ({
  value,
}: {
  value: Process.Dtrn;
}): React.ReactElement => (
  <div dangerouslySetInnerHTML={{ __html: value }}></div>
);

export const Onym = ({
  value,
}: {
  value: Process.Onym;
}): React.ReactElement => <Link value={value} />;

export const Def2 = ({
  value: { dtrn, onyms },
}: {
  value: Process.Def2;
}): React.ReactElement => (
  <>
    <div dangerouslySetInnerHTML={{ __html: dtrn }}></div>
    <div dangerouslySetInnerHTML={{ __html: onyms }}></div>
  </>
);

export const Def1 = ({
  value: { dtrn, onyms, defs },
}: {
  value: Process.Def1;
}): React.ReactElement => (
  <>
    <Dtrn value={dtrn} />
    {onyms.length > 0 && (
      <ul>
        {onyms.map((onym, idx) => (
          <Onym key={idx} value={onym} />
        ))}
      </ul>
    )}
    {defs.length > 0 && (
      <ol>
        {defs.map((def2, idx) => (
          <li>
            <Def2 key={idx} value={def2} />
          </li>
        ))}
      </ol>
    )}
  </>
);

export const Idiom = (_: { value: Process.Idiom }): React.ReactElement => <></>;

export const Def = ({
  value: { etym, defs, idiom },
}: {
  value: Process.Def;
}): React.ReactElement => (
  <>
    <Etym value={etym} />
    <ol>
      <div>
        {defs.map((def1, idx) => (
          <li>
            <Def1 key={idx} value={def1} />
          </li>
        ))}
      </div>
      <div>
        {idiom.map((idiom, idx) => (
          <Idiom key={idx} value={idiom} />
        ))}
      </div>
    </ol>
  </>
);

const DDO = ({
  value: { head, pos, endings, phon, def },
}: {
  value: Process.DDO;
}): React.ReactElement => (
  <section>
    <p>
      <Link value={head} />
      ;&nbsp;
      <span>
        <Pos value={pos} />
      </span>
      ;&nbsp;
      <span>
        {endings.length > 0 && (
          <ul className="endings">
            {endings.map((ending, idx) => [
              idx > 0 && ", ",
              <Ending key={idx} value={ending} />,
            ])}
          </ul>
        )}
      </span>
      ;
    </p>
    <Phon value={phon} />
    <Def value={def} />
  </section>
);

export const Result = ({ query }: { query: string }): React.ReactElement => {
  const [result, setResult] = React.useState<null | Process.Result>(null);
  React.useEffect(
    () =>
      void (async () => {
        const element = await doQueryCached(query);
        setResult(element);
      })(),
    [query],
  );
  if (result === null) return <></>;
  return (
    <>
      {result.ddo.map((ddo, idx) => (
        <DDO key={idx} value={ddo} />
      ))}
    </>
  );
};

const main = () => {
  const cache: Cache.Cache = Cache.loadCache("query-cache");
  const xs: Record<string, Process.Result> = Object.fromEntries(
    Object.entries<string | undefined>(cache).flatMap(([k, s]) => {
      if (!s) return [];
      return [[k, Process.processAndStore(k, fromHTML(s))]];
    }),
  );
  Cache.store("query-cached-processed", xs);
  console.log(xs);
  console.log(xs?.fisk?.ddo[0]);
};

main();
