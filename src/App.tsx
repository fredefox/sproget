import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";

export const Main = (): React.ReactElement => {
  const [searchParams, setSearchParams] = Router.useSearchParams();
  const query = searchParams.get("query");
  const [inp, setInp] = React.useState<string>(query || "");
  const setQuery = (query: string) => {
    setSearchParams({ ...(query && { query }) });
  };

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

export const App = (): React.ReactElement => {
  const router = Router.createBrowserRouter([
    { path: "/:query?", element: <Main /> },
  ]);
  return <Router.RouterProvider router={router}></Router.RouterProvider>;
};
