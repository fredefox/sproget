export type Rec<K extends keyof any, T> = Record<K, T | undefined>;

export type Cache = Rec<string, string>;

export const store = <T>(k: string, x: T) =>
  localStorage.setItem(k, JSON.stringify(x));

export const load = (k: string): unknown => {
  const s = localStorage.getItem(k);
  if (!s) return {};
  return JSON.parse(s);
};

export const isCache = (x: unknown): x is Cache =>
  Boolean(
    x &&
      typeof x === "object" &&
      Object.keys(x).every((x) => typeof x === "string"),
  );

export const loadCache = (k: string): Cache => {
  const cache: unknown = load(k);
  if (!isCache(cache)) return {};
  return cache;
};

export type Encode<T> = (t: T) => string;

export type Parse<T> = (s: string) => T;

export type Serialize<T> = [Parse<T>, Encode<T>];

export const cached =
  <T>(
    [parse, encode]: Serialize<T>,
    k: string,
    f: (x: string) => Promise<T>,
  ): ((x: string) => Promise<T>) =>
  async (x: string): Promise<T> => {
    const cache = loadCache(k);
    const c = cache[x];
    if (c) return parse(c);
    const y = await f(x);
    store(k, { ...cache, [x]: encode(y) });
    return y;
  };
