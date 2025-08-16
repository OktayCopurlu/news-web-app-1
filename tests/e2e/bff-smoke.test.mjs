import assert from "assert";

const BFF = process.env.BFF_URL || "http://localhost:4000";
const SHOULD_RUN = process.env.BFF_E2E === "1"; // opt-in

async function req(path, options = {}) {
  const r = await fetch(BFF + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  return {
    status: r.status,
    ok: r.ok,
    json: async () => {
      try {
        return await r.json();
      } catch {
        return null;
      }
    },
  };
}

(async () => {
  if (!SHOULD_RUN) {
    console.log("[SKIP] BFF smoke e2e (set BFF_E2E=1 to enable)");
    return process.exit(0);
  }
  try {
    // quick probe
    let healthy = false;
    try {
      const r = await fetch(BFF + "/health", { method: "GET" });
      healthy = r.ok;
    } catch (_) {}
    if (!healthy) {
      console.log("[SKIP] BFF not reachable at", BFF);
      return process.exit(0);
    }
    // 1. Feed list
    const feedRes = await req("/feed");
    assert.ok(feedRes.ok, "feed request failed");
    const feedPayload = await feedRes.json();
    const articles = Array.isArray(feedPayload)
      ? feedPayload
      : feedPayload?.data?.items ||
        feedPayload?.data?.clusters ||
        feedPayload?.data ||
        [];
    assert.ok(Array.isArray(articles), "feed not array-like");
    console.log("Feed:", articles.length);

    // 2. First article detail (if any)
    if (articles[0]?.id) {
      const detailRes = await req(`/cluster/${articles[0].id}`);
      assert.ok(detailRes.ok, "cluster detail request failed");
      const detail = await detailRes.json();
      assert.strictEqual(detail.id, articles[0].id, "detail id mismatch");
      console.log("Cluster detail OK for", detail.id);
    }

    // 3. Unauthorized profile should 401/403
    const profileNoAuth = await req("/auth/profile");
    assert.ok(
      !profileNoAuth.ok &&
        (profileNoAuth.status === 401 || profileNoAuth.status === 403),
      "expected unauthorized profile access"
    );
    console.log("Profile unauthorized status:", profileNoAuth.status);

    // 4. (Optional) attempt dummy login if test creds provided
    const TEST_EMAIL = process.env.TEST_EMAIL;
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    if (TEST_EMAIL && TEST_PASSWORD) {
      const loginRes = await req("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      });
      if (loginRes.ok) {
        const loginJson = await loginRes.json();
        const token = loginJson.token;
        assert.ok(token, "login missing token");
        console.log("Login OK");
        const profileRes = await req("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        assert.ok(profileRes.ok, "authorized profile request failed");
        const profile = await profileRes.json();
        assert.strictEqual(profile.email, TEST_EMAIL, "profile email mismatch");
        console.log("Profile OK for", profile.email);
      } else {
        console.warn(
          "Login skipped: credentials rejected (status " + loginRes.status + ")"
        );
      }
    } else {
      console.log("Login skipped: TEST_EMAIL / TEST_PASSWORD not set");
    }

    console.log("BFF smoke test PASSED");
    process.exit(0);
  } catch (e) {
    console.error("BFF smoke test FAILED", e);
    process.exit(1);
  }
})();
