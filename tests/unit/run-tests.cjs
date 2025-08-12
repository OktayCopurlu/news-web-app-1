// Simple sequential test runner using ts-node/register
const { spawn } = require("node:child_process");
const path = require("node:path");

const tests = ["normalizeArticle.test.ts", "apiFetch.test.ts"];

function runTest(name) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${name}`);
    const p = spawn(
      process.execPath,
      ["--loader", "ts-node/esm", path.join(__dirname, name)],
      { stdio: "inherit" }
    );
    p.on("exit", (code) =>
      code === 0
        ? resolve(null)
        : reject(new Error(name + " failed with code " + code))
    );
  });
}

(async () => {
  for (const t of tests) {
    await runTest(t);
  }
  console.log("All unit tests passed");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
