import { en } from "./locales/en";
import { tr } from "./locales/tr";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { it } from "./locales/it";
import { pt } from "./locales/pt";
import { de } from "./locales/de";
import { ja } from "./locales/ja";
import { zh } from "./locales/zh";
import { hi } from "./locales/hi";
import { ar } from "./locales/ar";
import { ru } from "./locales/ru";
import { getPreferredLang, normalizeLang } from "../utils/lang";

type MessageKeys = keyof typeof en;
export type Messages = Record<MessageKeys, string>;

const bundles: Record<string, Messages> = {
  en,
  tr,
  es,
  fr,
  it,
  pt,
  de,
  ja,
  zh,
  hi,
  ar,
  ru,
};

export function pickBundle(lang?: string): Messages {
  const l = normalizeLang(lang || getPreferredLang());
  const base = l.split("-")[0];
  return bundles[l] || bundles[base] || en;
}

export function t(
  key: MessageKeys,
  params?: Record<string, string | number>
): string {
  const msg = pickBundle()[key] as unknown as string;
  if (!params) return msg;
  return Object.keys(params).reduce(
    (acc, k) => acc.replace(`{${k}}`, String(params[k]!)),
    msg
  );
}
