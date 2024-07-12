import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";

const isHTMLLinkElement = (x: unknown): x is HTMLLinkElement =>
  Boolean(x && typeof x === "object" && "href" in x);

export const Main = (): React.ReactElement => {
  const [inp, setInp] = React.useState<string>("");
  const [query, setQuery] = React.useState<string>("");
  Router.useBeforeUnload((event): void => {
    if (!isHTMLLinkElement(document.activeElement)) return;
    const { searchParams } = new URL(document.activeElement.href);
    const newInp = searchParams.get("SearchableText");
    if (newInp === null) return;
    setInp(newInp);
    setQuery(newInp);
    event.preventDefault();
  });
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(inp);
        }}
      >
        <input value={inp} onChange={(e) => setInp(e.target.value)} />
        <button type="submit">Søg</button>
      </form>
      <Result.Result query={query} />
    </>
  );
};

export const App = (): React.ReactElement => (
  <Router.BrowserRouter>
    <Main />
  </Router.BrowserRouter>
);
