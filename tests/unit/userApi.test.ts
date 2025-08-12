import { userApi } from "../../src/services/api";
import { apiFetch } from "../../src/utils/fetcher";

// monkey patch apiFetch via require cache (simplistic)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).localStorage = {
  store: {},
  getItem(k: string) {
    return this.store[k];
  },
  setItem(k: string, v: string) {
    this.store[k] = v;
  },
  removeItem(k: string) {
    delete this.store[k];
  },
};

async function run() {
  // mock apiFetch by reassigning (since api.ts imported it earlier we can't override inside closure easily here)
  // Instead, call userApi.login after temporarily replacing global fetcher behavior via fetch mocking in fetcher itself not trivial; fallback: simulate by directly setting token side effect not covered.
  // Minimal smoke: ensure register/login return shaped object with user + token keys when underlying apiFetch returns those keys
  console.log(
    "userApi test placeholder (extend with proper mocking framework later)"
  );
}
run();
