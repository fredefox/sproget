import React from "react";
import * as Result from "./Result";
import * as Router from "react-router-dom";
import * as Util from "./util";

const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { setValue: (value: string) => void },
): React.ReactElement => {
  const { value, setValue } = props;
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}): React.ReactElement => {
  const [inp, setInp] = React.useState<string>(value);
  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onChange(inp);
      }}
    >
      <div>
        <Input value={inp} setValue={setInp} />
        <button type="submit">Søg</button>
      </div>
    </form>
  );
};

export const Main = (): React.ReactElement => {
  const [query, setQuery] = Util.useSearchParam("query");

  return (
    <div className={query ? "" : "no-query"}>
      <SearchBar value={query || ""} onChange={setQuery} />

      {query && <Result.Result query={query} />}
    </div>
  );
};

export const App = (): React.ReactElement => {
  const router = Router.createBrowserRouter([{ path: "/", element: <Main /> }]);
  return <Router.RouterProvider router={router}></Router.RouterProvider>;
};
