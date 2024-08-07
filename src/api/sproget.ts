import * as Cache from "../cache";
import * as Process from "../process";
import * as Util from "../util";

export const fetchLookup = (query: string): Promise<Response> =>
  fetch(
    `http://localhost:3001/lookup?SearchableText=${encodeURIComponent(query)}`,
  );

const performQuery = (query: string) => fetchLookup(query);

const doQuery = async (query: string): Promise<Process.Result> => {
  const response = await performQuery(query);
  const body = await response.text();
  const template = Util.fromHTML(body);
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

export const doQueryCached: (x: string) => Promise<Process.Result> =
  Cache.cached<Process.Result>(serializer, "query-cache", doQuery);
