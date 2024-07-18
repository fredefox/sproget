import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";

export const Main = (): React.ReactElement => {
  const q: string =
    new URL(window.location.href).searchParams.get("SearchableText") || "";
  const [inp, setInp] = React.useState<string>(q);
  const [query, setQuery] = React.useState<string>(q);
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
          <input value={inp} onChange={(e) => setInp(e.target.value)} />
          <button type="submit">Søg</button>
        </div>
      </form>
      {query && <Result.Result query={query} />}
    </div>
  );
};

export const App = (): React.ReactElement => (
  <Router.BrowserRouter>
    <Main />
  </Router.BrowserRouter>
);
