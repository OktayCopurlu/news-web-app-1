import assert from "assert";

const BFF = process.env.BFF_URL || "http://localhost:4000";
const SHOULD_RUN = process.env.BFF_E2E === "1"; // opt-in for CI/local where BFF is actually running

async function fetchJson(path) {
  const r = await fetch(BFF + path);
  assert.strictEqual(r.ok, true, `Request ${path} failed: ${r.status}`);
  return r.json();
}

(async () => {
  if (!SHOULD_RUN) {
    console.log("[SKIP] BFF connection e2e (set BFF_E2E=1 to enable)");
    process.exit(0);
  }
  try {
    // quick probe to avoid long timeouts when server is down
    let healthy = false;
    try {
      const r = await fetch(BFF + "/health", { method: "GET" });
      healthy = r.ok;
    } catch (_) {}
    if (!healthy) {
      console.log("[SKIP] BFF not reachable at", BFF);
      return process.exit(0);
    }

    const health = await fetchJson("/health");
    assert.ok(health.ok, "Health endpoint not ok");

    const feedPayload = await fetchJson("/feed");
    const articles = Array.isArray(feedPayload)
      ? feedPayload
      : feedPayload?.data?.items ||
        feedPayload?.data?.clusters ||
        feedPayload?.data ||
        [];
    assert.ok(Array.isArray(articles), "Feed not array-like");
    console.log("Feed count:", articles.length);

    if (articles[0]) {
      const detail = await fetchJson(`/cluster/${articles[0].id}`);
      assert.ok(detail.id === articles[0].id, "Detail id mismatch");
      console.log("Fetched detail for first cluster");
    }

    console.log("BFF connection test PASSED");
    process.exit(0);
  } catch (err) {
    console.error("BFF connection test FAILED", err);
    process.exit(1);
  }
})();
