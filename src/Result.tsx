import React from "react";
import "./Result.css";

const fetchSample = () => fetch("http://localhost:3001");

const fromHTML = (html: string): DocumentFragment => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
};

export const Result = (): React.ReactElement => {
  const [doc, setDoc] = React.useState<null | Element>(null);
  React.useEffect(
    () =>
      void (async () => {
        const response = await fetchSample();
        const body = await response.text();
        const template = fromHTML(body);
        const element = template.querySelector("#portal-columns");
        setDoc(element);
      })(),
  );
  console.log({ doc });
  if (doc === null) return <></>;
  return <div dangerouslySetInnerHTML={{ __html: doc.outerHTML }} />;
};
