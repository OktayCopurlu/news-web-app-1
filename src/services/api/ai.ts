import { apiFetch } from "../../utils/fetcher";

export interface ChatMessage {
  id?: string;
  type?: string;
  content: string;
  timestamp?: string;
}

export const aiApi = {
  sendMessage: (
    articleId: string,
    message: string,
    chatHistory: ChatMessage[] = []
  ) =>
    apiFetch<{ messages: ChatMessage[] }>({
      path: `/chat/${articleId}`,
      method: "POST",
      body: { message, chatHistory },
    }),
  getChatHistory: (articleId: string) =>
    apiFetch<{ messages: ChatMessage[] }>({ path: `/chat/${articleId}` }),
};
