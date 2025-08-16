import { apiFetch } from "../../utils/fetcher";
import type { CoverageComparison } from "../../types/models";

export const coverageApi = {
  analyzeCoverage: (articleId: string) =>
    apiFetch<CoverageComparison>({
      path: `/cluster/${encodeURIComponent(articleId)}/coverage`,
      method: "POST",
    }),
  getCoverage: (articleId: string) =>
    apiFetch<CoverageComparison>({
      path: `/cluster/${encodeURIComponent(articleId)}/coverage`,
    }),
};
