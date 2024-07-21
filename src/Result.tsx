import React from "react";
import "./Result.css";
import * as Process from "./process";
import * as Query from "./query";

const Link = ({
  value: { link, linktext },
}: {
  value: Process.Link;
}): React.ReactElement => (
  <a href={link} dangerouslySetInnerHTML={{ __html: linktext }}></a>
);

const Pos = ({ value }: { value: Process.Pos }): React.ReactElement => (
  <>
    {value.map((p, idx) => [
      idx > 0 && ", ",
      <span key={idx} dangerouslySetInnerHTML={{ __html: p }}></span>,
    ])}
  </>
);

export const Sourcelink = ({
  value: { raw },
}: {
  value: Process.Sourcelink;
}): React.ReactElement => (
  <span dangerouslySetInnerHTML={{ __html: raw }}></span>
);

export const Ending = ({
  value,
}: {
  value: Process.Ending;
}): React.ReactElement => <span>{value}</span>;

export const Phon = ({
  value,
}: {
  value: Process.Phon;
}): React.ReactElement => <p className="phon">{value}</p>;

export const Etym = ({
  value,
}: {
  value: Process.Etym;
}): React.ReactElement => (
  <>{value && <p dangerouslySetInnerHTML={{ __html: value }}></p>}</>
);

export const Dtrn = ({
  value,
}: {
  value: Process.Dtrn;
}): React.ReactElement => (
  <div dangerouslySetInnerHTML={{ __html: value }}></div>
);

export const Onym = ({
  value,
}: {
  value: Process.Onym;
}): React.ReactElement => <Link value={value} />;

export const Def2 = ({
  value: { dtrn, onyms },
}: {
  value: Process.Def2;
}): React.ReactElement => (
  <>
    <div dangerouslySetInnerHTML={{ __html: dtrn }}></div>
    <div dangerouslySetInnerHTML={{ __html: onyms }}></div>
  </>
);

export const Def1 = ({
  value: { dtrn, onyms, defs },
}: {
  value: Process.Def1;
}): React.ReactElement => (
  <>
    <Dtrn value={dtrn} />
    {onyms.length > 0 && (
      <ul>
        {onyms.map((onym, idx) => (
          <Onym key={idx} value={onym} />
        ))}
      </ul>
    )}
    {defs.length > 0 && (
      <ol>
        {defs.map((def2, idx) => (
          <li key={idx}>
            <Def2 value={def2} />
          </li>
        ))}
      </ol>
    )}
  </>
);

export const Idiom = (_: { value: Process.Idiom }): React.ReactElement => <></>;

export const Def = ({
  value: { etym, defs, idiom },
}: {
  value: Process.Def;
}): React.ReactElement => (
  <div>
    <Etym value={etym} />
    <ol>
      <div>
        {defs.length > 0 &&
          defs.map((def1, idx) => (
            <li key={idx}>
              <Def1 value={def1} />
            </li>
          ))}
      </div>
      <div>
        {idiom.length > 0 &&
          idiom.map(
            (idiom, idx): React.ReactNode =>
              Boolean(console.log({ idx })) || (
                <Idiom key={idx} value={idiom} />
              ),
          )}
      </div>
    </ol>
  </div>
);

const DDO = ({
  value: { head, pos, endings, phon, def },
}: {
  value: Process.DDO;
}): React.ReactElement => (
  <section>
    <p>
      <Link value={head} />
      ;&nbsp;
      <span>
        <Pos value={pos} />
      </span>
      ;&nbsp;
      <span>
        {endings.length > 0 && (
          <span className="endings">
            {endings.map((ending, idx) => [
              idx > 0 && ", ",
              <Ending key={idx} value={ending} />,
            ])}
          </span>
        )}
      </span>
      ;
    </p>
    <Phon value={phon} />
    <Def value={def} />
  </section>
);

export const Result = ({ query }: { query: string }): React.ReactElement => {
  const [result, setResult] = React.useState<null | Process.Result>(null);
  React.useEffect(
    () =>
      void (async () => {
        const element = await Query.doQueryCached(query);
        setResult(element);
      })(),
    [query],
  );
  if (result === null) return <></>;
  return (
    <>
      {result.ddo.map((ddo, idx) => (
        <DDO key={idx} value={ddo} />
      ))}
    </>
  );
};
