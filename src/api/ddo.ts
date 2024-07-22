import * as Util from "../util";
import * as Cache from "../cache";

const fetchLookup = (query: string): Promise<Response> =>
  fetch(`http://localhost:3002/ddo/ordbog?query=${encodeURIComponent(query)}`);

export type Result = Element;

// (/^<wms(.*)wms>$/, "<lmn$1lmn>")
export const changeTagName = (element: Element, tagName: string): void =>
  void (element.outerHTML = element.outerHTML.replace(
    new RegExp(`^<${element.tagName}(.*)${element.tagName}>$`, "i"),
    `<${tagName}$1${tagName}>`,
  ));

export const doQuery = async (query: string): Promise<Result> => {
  const response = await fetchLookup(query);
  const body = await response.text();
  const template = Util.fromHTML(body);
  const res = template.querySelector(".artikel");
  if (res === null) return Promise.reject();
  const element = res.querySelector("#content-betydninger");
  const tagName = "ol";
  element && changeTagName(element, tagName);
  debugger;
  return res;
};

const parse: Cache.Parse<Result> = (s) =>
  Util.fromHTML(s).firstChild as Element;

const encode: Cache.Encode<Result> = (res) => res.outerHTML;

const serializer: Cache.Serialize<Result> = [parse, encode];

export const doQueryCached: (x: string) => Promise<Result> =
  Cache.cached<Result>(serializer, "ddo-cache", doQuery);
