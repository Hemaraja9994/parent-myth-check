/* Myth or Fact: common beliefs about children's speech and hearing, each checked against
   published research, with a verdict, the evidence, sources and a share button. Plus milestones
   and red flags. Four languages (claims translated; details in English). On-device. */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Baby, Search, Share2, TriangleAlert } from "lucide-react";
import { AppShell } from "@/shell/AppShell";
import { Button, Pill, Segmented } from "@/shell/ui";
import { usePersistent } from "@/shell/storage";
import { toast } from "@/shell/toast";
import { shareText } from "@/shell/lib";
import { AGES, CLAIMS, FLAGS, TOPICS, type Claim, type Lang } from "./data";

const VERDICT_TONE = { myth: "high", partly: "mid", fact: "ok" } as const;

function ClaimCard({ c, lang, t, open, onToggle }: { c: Claim; lang: Lang; t: (k: string) => string; open: boolean; onToggle: () => void }) {
  const vLabel = c.v === "myth" ? t("vMyth") : c.v === "partly" ? t("vPartly") : t("vFact");
  const eLabel = c.ev === "strong" ? t("eStrong") : c.ev === "mod" ? t("eMod") : t("eLow");
  const share = async () => {
    const txt = `${c.claim[lang]}\n\n${vLabel}: ${c.answer[lang]}\n\n(${t("appName")})`;
    const r = await shareText(txt);
    toast(r === "shared" ? t("share") : r === "copied" ? t("copied") : t("shareFail"));
  };
  return (
    <article className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="m-0 text-[1.02rem] font-semibold">{c.claim[lang]}</p>
        <Pill tone={VERDICT_TONE[c.v]}>{vLabel}</Pill>
      </div>
      <p className="m-0 mt-2 text-[0.96rem]">{c.answer[lang]}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="ghost" onClick={onToggle} aria-expanded={open}>{open ? "− " : "+ "}{t("research")}</Button>
        <Button size="sm" variant="quiet" onClick={share}><Share2 className="h-4 w-4" aria-hidden />{t("share")}</Button>
        <span className="text-[0.78rem] text-muted">{t("evidence")}: {eLabel}</span>
      </div>
      {open && (
        <div className="mt-3 border-t border-line pt-3" lang="en">
          <p className="m-0 text-[0.78rem] text-muted">{t("detailEn")}</p>
          {c.detail.map((d, i) => <p key={i} className="m-0 mt-2 text-[0.92rem]">{d}</p>)}
          <h4 className="mb-1 mt-3 text-[0.85rem] font-bold">{t("sources")}</h4>
          <ul className="m-0 grid list-disc gap-1 pl-5 text-[0.82rem] text-muted">{c.src.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
    </article>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const [topic, setTopic] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = usePersistent<Record<string, boolean>>("pmc-open", {});

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CLAIMS.filter(c => (topic === "all" || c.topic === topic) &&
      (!s || `${c.claim[lang]} ${c.answer[lang]} ${c.detail.join(" ")} ${c.claim.en} ${c.answer.en}`.toLowerCase().includes(s)));
  }, [topic, q, lang]);

  const topicOpts = [{ value: "all", label: t("all") }, ...TOPICS.map(k => ({ value: k, label: t(k) }))];

  return (
    <AppShell title={t("appName")} subtitle={t("appSub")}
      footer={<><p className="m-0">{t("disclaimer")}</p><p className="m-0">{t("reviewNote")}</p>
        <p className="m-0">{t("builtBy")}: Hemaraja Nayaka S, Department of Audiology & Speech-Language Pathology, Yenepoya Medical College Hospital, Mangaluru.</p></>}>
      <div className="mx-auto grid max-w-3xl gap-5">
        <header><h2 className="m-0 text-xl font-bold">{t("introTitle")}</h2><p className="m-0 mt-1 text-muted">{t("introText")}</p></header>

        <div className="grid gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <label className="sr-only" htmlFor="q">Search</label>
            <input id="q" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={`${t("research")}…`}
              className="min-h-11 w-full rounded-md border border-line bg-paper pl-9 pr-3 text-[16px]" />
          </div>
          <div className="overflow-x-auto"><Segmented label="Topic" value={topic} onChange={setTopic} options={topicOpts} /></div>
        </div>

        {list.length ? <div className="grid gap-3">{list.map(c => <ClaimCard key={c.id} c={c} lang={lang} t={t} open={!!open[c.id]} onToggle={() => setOpen(o => ({ ...o, [c.id]: !o[c.id] }))} />)}</div>
          : <p className="m-0 rounded-lg border border-line bg-surface p-4 text-muted">No belief in this collection matches “{q}”. These are common myths families hear; for your own child, ask an RCI-registered audiologist or speech-language pathologist.</p>}

        <section className="rounded-xl border border-line bg-surface p-4">
          <h2 className="m-0 flex items-center gap-2 text-lg font-bold"><Baby className="h-5 w-5" aria-hidden />{t("msTitle")}</h2>
          <p className="m-0 mt-1 text-[0.95rem] text-muted">{t("msIntro")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {AGES.map((a, i) => (
              <div key={i} className="rounded-lg border border-line bg-paper p-3">
                <h3 className="m-0 text-base font-bold">{a.age[lang]}</h3>
                <ul className="m-0 mt-1 grid list-disc gap-1 pl-5 text-[0.92rem]">{a.items[lang].map((it, j) => <li key={j}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border-l-4 border-high bg-high/8 p-4">
          <h2 className="m-0 flex items-center gap-2 text-lg font-bold"><TriangleAlert className="h-5 w-5 text-high" aria-hidden />{t("flagsTitle")}</h2>
          <ul className="m-0 mt-2 grid list-disc gap-1 pl-5 text-[0.95rem]">{(FLAGS[lang] ?? FLAGS.en).map((f, i) => <li key={i}>{f}</li>)}</ul>
        </section>
      </div>
    </AppShell>
  );
}
