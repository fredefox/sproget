import React from "react";
import * as Input from "./Input";
import * as Page from "./page";

export const SearchBar = ({
  value,
  onChange,
  page,
  setPage,
}: {
  value: string;
  onChange: (value: string) => void;
  page: Page.Page;
  setPage: (page: Page.Page) => void;
}): React.ReactElement => {
  const [inp, setInp] = React.useState<string>(value);
  const Tab = ({
    target,
    children,
  }: {
    target: Page.Page;
    children: React.ReactNode;
  }) => (
    <a
      onClick={() => setPage(target)}
      href={`#${target}`}
      className={page === target ? "active" : ""}
    >
      {children}
    </a>
  );

  return (
    <div className="menu">
      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          onChange(inp);
        }}
      >
        <div>
          <Input.Input value={inp} setValue={setInp} />
          <button type="submit">Søg</button>
        </div>
      </form>
      <div className="nav">
        <Tab target="ddo">Den danske ordbog</Tab>
        <Tab target="ods">Ordbog over det danske sprog</Tab>
        <Tab target="ro">Retskrivningsordbogen</Tab>
        <Tab target="thesaurus">Dansk Synonymordbog</Tab>
      </div>
    </div>
  );
};
