// Barrel exports preserving previous import style (../services/api)
// Prefer using the consolidated api.ts newsApi for /feed and /cluster
export { articlesApi as newsApi } from "./articles";
export { aiApi } from "./ai";
export { quizApi } from "./quiz";
export { coverageApi } from "./coverage";
export { userApi } from "./user";
