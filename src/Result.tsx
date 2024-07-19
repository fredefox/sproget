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
    {value.map((p, idx) => (
      <div key={idx} dangerouslySetInnerHTML={{ __html: p }}></div>
    ))}
  </>
);
const Sourcelink = ({
  value: { raw },
}: {
  value: Process.Sourcelink;
}): React.ReactElement => <div dangerouslySetInnerHTML={{ __html: raw }}></div>;

const Ending = ({ value }: { value: Process.Ending }): React.ReactElement => (
  <li>{value}</li>
);

const Phon = ({ value }: { value: Process.Phon }): React.ReactElement => (
  <div className="phon">{value}</div>
);

const Etym = ({ value }: { value: Process.Etym }): React.ReactElement => (
  <>{value && <div dangerouslySetInnerHTML={{ __html: value }}></div>}</>
);

const Dtrn = ({ value }: { value: Process.Dtrn }): React.ReactElement => (
  <div dangerouslySetInnerHTML={{ __html: value }}></div>
);

const Onym = ({ value }: { value: Process.Onym }): React.ReactElement => (
  <Link value={value} />
);

const Def2 = ({
  value: { dtrn, onyms },
}: {
  value: Process.Def2;
}): React.ReactElement => (
  <>
    <div dangerouslySetInnerHTML={{ __html: dtrn }}></div>
    <div dangerouslySetInnerHTML={{ __html: onyms }}></div>
  </>
);

const Def1 = ({
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
      <ul>
        {defs.map((def2, idx) => (
          <Def2 key={idx} value={def2} />
        ))}
      </ul>
    )}
  </>
);

const Idiom = (_: { value: Process.Idiom }): React.ReactElement => <></>;

const Def = ({
  value: { etym, defs, idiom },
}: {
  value: Process.Def;
}): React.ReactElement => (
  <div>
    <Etym value={etym} />
    <div>
      {defs.map((def1, idx) => (
        <Def1 key={idx} value={def1} />
      ))}
    </div>
    <div>
      {idiom.map((idiom, idx) => (
        <Idiom key={idx} value={idiom} />
      ))}
    </div>
  </div>
);

const DDO = ({
  value: { head, pos, sourcelink, endings, phon, def },
}: {
  value: Process.DDO;
}): React.ReactElement => (
  <section>
    <Link value={head} />
    <Pos value={pos} />
    <Sourcelink value={sourcelink} />
    {endings.length > 0 && (
      <ul>
        {endings.map((ending, idx) => (
          <Ending key={idx} value={ending} />
        ))}
      </ul>
    )}
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
