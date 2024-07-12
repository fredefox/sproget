import React from "react";
import * as Result from "./Result";

export const App = (): React.ReactElement => {
  const [inp, setInp] = React.useState<string>("");
  const [query, setQuery] = React.useState<string>("");
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
