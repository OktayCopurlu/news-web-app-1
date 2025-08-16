Insight-frontend

Development

- npm run dev – start Vite dev server
- npm run build – production build
- npm run preview – preview build
- npm run check – typecheck + lint

Tests

- Unit tests use a minimal Node runner compiled to CommonJS under dist-tests. JSX in tests is enabled via tsconfig.tests.json.
- npm run test:unit – compiles tests and runs the custom runner
- npm run test:e2e – light E2E smoke (BFF connectivity)

Current unit coverage

- normalizeArticle shape mapping
- apiFetch retry + HTTP error handling
- translateBatch request shape
- feed pending mapping
- NewsCard “Translated” badge (SSR-safe)
- Language helpers (normalizeLang, RTL/dir, preferred lang set/get)
- Frontend language switch (propagates Accept-Language and lang query on /feed)
