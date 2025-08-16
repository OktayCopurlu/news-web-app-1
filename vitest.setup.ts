// JSDOM + test globals setup

// Minimal localStorage polyfill for tests that expect it
if (typeof globalThis.localStorage === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).localStorage = {
    store: {} as Record<string, string>,
    getItem(key: string) {
      return this.store[key];
    },
    setItem(key: string, val: string) {
      this.store[key] = val;
    },
    removeItem(key: string) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  };
}

// Suppress React Router warnings if Link is rendered outside a Router during simple SSR render tests
// In component tests that need routing, wrap with MemoryRouter in the spec.
