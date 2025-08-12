import { apiFetch } from "../../utils/fetcher";
import type { Quiz } from "../../types/models";

export const quizApi = {
  generateQuiz: (articleId: string, difficulty: string = "intermediate") =>
    apiFetch<Quiz>({
      path: `/articles/${articleId}/quiz`,
      method: "POST",
      body: { difficulty },
    }),
  getQuiz: (articleId: string) =>
    apiFetch<Quiz>({ path: `/articles/${articleId}/quiz` }),
};
