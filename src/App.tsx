import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";
import * as Util from "./util";
import * as SearchBar from "./SearchBar";

export const Main = (): React.ReactElement => {
  const [query, setQuery] = Util.useSearchParam("query");

  return (
    <div className={query ? "" : "no-query"}>
      <SearchBar.SearchBar value={query || ""} onChange={setQuery} />

      {query && <Result.Result query={query} />}
    </div>
  );
};

export const App = (): React.ReactElement => {
  const router = Router.createBrowserRouter([{ path: "/", element: <Main /> }]);
  return <Router.RouterProvider router={router}></Router.RouterProvider>;
};
