import React from "react";
import { renderToString } from "react-dom/server";
import NewsCard from "../../src/components/NewsCard";
import { UserContext } from "../../src/contexts/UserContext";

function renderWithUser(ui: React.ReactElement, user: any = null) {
  return renderToString(
    <UserContext.Provider
      value={{
        user,
        loading: false,
        signUp: async () => ({ user: null, error: null }),
        signIn: async () => ({ user: null, error: null }),
        signOut: async () => {},
        updatePreferences: async () => ({ error: null }),
      }}
    >
      {ui}
    </UserContext.Provider>
  );
}

const baseArticle = {
  id: "c1",
  title: "Title",
  summary: "Summary",
  published_at: new Date().toISOString(),
  reading_time: 3,
  category: "general",
  language: "de",
  source: "Source",
  source_url: "https://example.com",
  image_url: "",
  tags: ["world"],
};

async function testShowsTranslatedBadge() {
  const html = renderWithUser(
    <NewsCard
      article={{ ...baseArticle, translation_status: "ready" } as any}
    />,
    { preferences: { audioPreferences: false, biasAnalysis: false } }
  );
  if (!html.includes("Translated")) {
    throw new Error(
      "Expected Translated badge to be present when status=ready"
    );
  }
  console.log("newsCard badge (ready) test passed");
}

async function testNoBadgeWhenPending() {
  const html = renderWithUser(
    <NewsCard
      article={{ ...baseArticle, translation_status: "pending" } as any}
    />,
    { preferences: { audioPreferences: false, biasAnalysis: false } }
  );
  if (html.includes("Translated")) {
    throw new Error("Did not expect Translated badge when status=pending");
  }
  console.log("newsCard badge (pending) test passed");
}

(async () => {
  await testShowsTranslatedBadge();
  await testNoBadgeWhenPending();
})();
