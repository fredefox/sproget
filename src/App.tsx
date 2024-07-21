import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";
import * as Util from "./util";
import * as SearchBar from "./SearchBar";
import * as Page from "./page";

const useInitialPage = (): Page.Page => {
  const { hash } = Router.useLocation();
  const p = hash.slice(1);
  if (!Page.isPage(p)) return "ddo";
  return p;
};

export const Main = (): React.ReactElement => {
  const [query, setQuery] = Util.useSearchParam("query");
  const [page, setPage] = React.useState<Page.Page>(useInitialPage());

  return (
    <div className={query ? "" : "no-query"}>
      <SearchBar.SearchBar
        page={page}
        setPage={setPage}
        value={query || ""}
        onChange={setQuery}
      />

      {query && <Result.Result page={page} query={query} />}
    </div>
  );
};

export const App = (): React.ReactElement => {
  const router = Router.createBrowserRouter([{ path: "/", element: <Main /> }]);
  return <Router.RouterProvider router={router}></Router.RouterProvider>;
};
