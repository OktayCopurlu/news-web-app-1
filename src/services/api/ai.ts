import { apiFetch } from "../../utils/fetcher";
import { getPreferredLang } from "../../utils/lang";

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
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/chat?lang=${encodeURIComponent(getPreferredLang())}`,
      method: "POST",
      body: { message, chatHistory },
      headers: { "Accept-Language": getPreferredLang() },
    }),
  getChatHistory: (articleId: string) =>
    apiFetch<{ messages: ChatMessage[] }>({
      path: `/cluster/${encodeURIComponent(
        articleId
      )}/chat?lang=${encodeURIComponent(getPreferredLang())}`,
      headers: { "Accept-Language": getPreferredLang() },
    }),
};
