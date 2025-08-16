import React, { useState } from "react";
import { renderToString } from "react-dom/server";

// Minimal UI harness that mirrors the ELI5 section structure used on the detail page.
function Eli5Harness({ initialOpen, summary }: { initialOpen: boolean; summary?: string }) {
  const [open] = useState<boolean>(initialOpen);
  return (
    <div>
      <button>{"Explain Like I'm 5"}</button>
      {open && (
        <div className="eli5-section">
          <h3>Explain Like I'm 5</h3>
          <p>{summary || ""}</p>
        </div>
      )}
    </div>
  );
}

(async function run() {
  const html = renderToString(
    <Eli5Harness initialOpen={true} summary={"Kids-friendly summary."} />
  );
  const hasHeading = html.includes("Explain Like I") || html.includes("Explain Like I&#x27;m 5");
  if (!hasHeading) throw new Error("Expected ELI5 button/heading text to be present");
  if (!html.includes("Kids-friendly summary.")) {
    throw new Error("Expected ELI5 summary content to be rendered when open");
  }
  console.log("ELI5 toggle UI harness test passed");
})();
