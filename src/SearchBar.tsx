import React from "react";
import * as Input from "./Input";

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
        <Input.Input value={inp} setValue={setInp} />
        <button type="submit">Søg</button>
      </div>
    </form>
  );
};
