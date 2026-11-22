/* Content for Myth or Fact, extracted verbatim from the original app (clinical content and
   translations preserved). claim/answer are in four languages; detail and sources are English. */
import raw from "./data.json";

export type Lang = "en" | "kn" | "te" | "hi";
export type Verdict = "myth" | "partly" | "fact";
export type Evidence = "strong" | "mod" | "low";
export interface Claim {
  id: string; topic: string; v: Verdict; ev: Evidence;
  claim: Record<Lang, string>; answer: Record<Lang, string>;
  detail: string[]; src: string[];
}
export interface Milestone { age: Record<Lang, string>; items: Record<Lang, string[]> }

interface Data { I18N: Record<Lang, Record<string, string>>; CLAIMS: Claim[]; AGES: Milestone[]; FLAGS: Record<Lang, string[]>; TOPICS: string[] }
const data = raw as unknown as Data;

export const I18N = data.I18N;
export const CLAIMS = data.CLAIMS;
export const AGES = data.AGES;
export const FLAGS = data.FLAGS;
export const TOPICS = data.TOPICS;

// strings for i18next: the shell + the app share one table, keyed by the original app keys.
export const strings = Object.fromEntries((Object.keys(I18N) as Lang[]).map(l => [l, I18N[l]])) as Record<Lang, Record<string, string>>;
