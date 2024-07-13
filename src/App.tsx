import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";

export const Main = (): React.ReactElement => {
  const q: string =
    new URL(window.location.href).searchParams.get("SearchableText") || "";
  const [inp, setInp] = React.useState<string>(q);
  const [query, setQuery] = React.useState<string>(q);
  return (
    <div>
      <form
        className="search-bar margin"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(inp);
        }}
      >
        <div className="margin row-reverse">
          <input value={inp} onChange={(e) => setInp(e.target.value)} />
          <span className="margin" />
          <button type="submit">Søg</button>
        </div>
      </form>
      {query && <Result.Result query={query} />}
      {!query && <p>Please input query</p>}
    </div>
  );
};

export const App = (): React.ReactElement => (
  <Router.BrowserRouter>
    <Main />
  </Router.BrowserRouter>
);
