import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";

const words = [
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

export const pick = <T,>(xs: Array<T>): T => {
  const idx = Math.floor(Math.random() * words.length);
  return xs[idx];
};

const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { setValue: (value: string) => void },
): React.ReactElement => {
  const { value, setValue } = props;
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const useSearchParam = (
  k: string,
): [string | null, (value: string) => void] => {
  const [searchParams, setSearchParams] = Router.useSearchParams();
  return [
    searchParams.get(k),
    (v: string) => setSearchParams({ ...(v && { [k]: v }) }),
  ];
};
export const Main = (): React.ReactElement => {
  const [query, setQuery] = useSearchParam("query");
  const [inp, setInp] = React.useState<string>(query || "");
  // const [sample, setSample] = React.useState("");
  // React.useEffect(() => setSample(pick(words)), []);

  return (
    <div className={query ? "" : "no-query"}>
      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(inp);
        }}
      >
        <div>
          <Input value={inp} setValue={setInp} />
          <button type="submit">Søg</button>
        </div>
      </form>

      {query && <Result.Result query={query} />}
    </div>
  );
};

export const App = (): React.ReactElement => {
  const router = Router.createBrowserRouter([{ path: "/", element: <Main /> }]);
  return <Router.RouterProvider router={router}></Router.RouterProvider>;
};
