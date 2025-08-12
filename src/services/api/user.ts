import { apiFetch } from "../../utils/fetcher";
import type { UserProfileModel } from "../../types/models";

export const userApi = {
  register: (userData: {
    email: string;
    password: string;
    name: string;
    preferences: Record<string, unknown>;
  }) =>
    apiFetch<UserProfileModel & { token?: string }>({
      path: "/auth/register",
      method: "POST",
      body: userData,
    }).then((data) => {
      if (data.token) localStorage.setItem("auth_token", data.token);
      return data;
    }),
  login: (email: string, password: string) =>
    apiFetch<UserProfileModel & { token?: string }>({
      path: "/auth/login",
      method: "POST",
      body: { email, password },
    }).then((data) => {
      if (data.token) localStorage.setItem("auth_token", data.token);
      return data;
    }),
  updatePreferences: (preferences: Record<string, unknown>) =>
    apiFetch<UserProfileModel>({
      path: "/auth/preferences",
      method: "PUT",
      body: { preferences },
    }),
  getProfile: () => apiFetch<UserProfileModel>({ path: "/auth/profile" }),
  trackInteraction: async (
    articleId: string,
    interactionType: string,
    metadata: Record<string, unknown> = {}
  ) => {
    try {
      return await apiFetch<{ success: boolean }>({
        path: "/interaction",
        method: "POST",
        body: { articleId, interactionType, metadata },
      });
    } catch {
      return { success: false };
    }
  },
};
