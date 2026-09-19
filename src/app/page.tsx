"use client";

import { ChangeEvent, ReactNode, useMemo, useState } from "react";
import type { AnalyzeResult, BulletAnalysis, Fix, Risk } from "@/lib/analyze";

type PageKey =
  | "overview"
  | "ats"
  | "keywords"
  | "content"
  | "recruiter"
  | "risks"
  | "fixes"
  | "rewrite"
  | "tracker"
  | "reports"
  | "methodology";

type IconName =
  | "overview"
  | "ats"
  | "keywords"
  | "content"
  | "recruiter"
  | "risks"
  | "fixes"
  | "rewrite"
  | "tracker"
  | "reports"
  | "methodology"
  | "settings"
  | "search"
  | "bell"
  | "chevron"
  | "arrow"
  | "check"
  | "alert"
  | "info"
  | "upload"
  | "plus"
  | "download"
  | "external"
  | "close"
  | "spark"
  | "lock"
  | "edit"
  | "filter"
  | "question"
  | "clock"
  | "file"
  | "dots";

const iconPaths: Record<IconName, string> = {
  overview: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  ats: "M7 3h7l4 4v14H7z M14 3v5h5 M10 13h5M10 17h5",
  keywords: "M4 6h16M4 12h16M4 18h10 M17 16l2 2 4-5",
  content: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M8 8h8M8 12h8M8 16h5",
  recruiter: "M4 18c0-3 2-5 5-5s5 2 5 5 M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M17 7h4M19 5v4",
  risks: "M12 3 21 20H3z M12 9v5 M12 17v1",
  fixes: "M5 6h14M5 12h14M5 18h14 M8 6v12",
  rewrite: "M4 20h4L19 9l-4-4L4 16v4z M13 6l4 4",
  tracker: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M8 9h8M8 13h5M8 17h3",
  reports: "M5 20V10M12 20V4M19 20v-7 M3 20h18",
  methodology: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 10v6 M12 7v.01",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.21a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.04H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.87l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.87.34 1.7 1.7 0 0 0 1.04-1.56V5h2.4v.21a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.04h.21v2.4h-.21A1.7 1.7 0 0 0 19.4 15z",
  search: "M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4z M16 16l5 5",
  bell: "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  chevron: "m7 10 5 5 5-5",
  arrow: "M5 12h14 M14 7l5 5-5 5",
  check: "M5 12l4 4L19 6",
  alert: "M12 3 21 20H3z M12 9v5 M12 17v1",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 10v6 M12 7v.01",
  upload: "M12 16V4 M7 9l5-5 5 5 M5 20h14",
  plus: "M12 5v14M5 12h14",
  download: "M12 4v11 M7 11l5 5 5-5 M5 20h14",
  external: "M14 5h5v5 M19 5l-8 8 M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  close: "M6 6l12 12M18 6 6 18",
  spark: "m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4z",
  lock: "M6 10h12v10H6z M8 10V7a4 4 0 0 1 8 0v3",
  edit: "M4 20h4L19 9l-4-4L4 16v4z M13 6l4 4",
  filter: "M4 6h16M7 12h10M10 18h4",
  question: "M9.5 9a2.5 2.5 0 1 1 4.3 1.8c-1.1 1-1.8 1.3-1.8 2.7 M12 17v.01 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  file: "M6 3h8l4 4v14H6z M14 3v5h5 M9 13h6M9 17h6",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
};

function Icon({ name, size = 18, strokeWidth = 1.8, className = "" }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}

const navGroups: { label: string; items: { key: PageKey; label: string; icon: IconName }[] }[] = [
  {
    label: "Workspace",
    items: [
      { key: "overview", label: "Overview", icon: "overview" },
      { key: "ats", label: "ATS check", icon: "ats" },
      { key: "keywords", label: "Keyword match", icon: "keywords" },
      { key: "content", label: "Content quality", icon: "content" },
      { key: "recruiter", label: "Recruiter view", icon: "recruiter" },
      { key: "risks", label: "Red flags", icon: "risks" },
    ],
  },
  {
    label: "Improve",
    items: [
      { key: "fixes", label: "Fix plan", icon: "fixes" },
      { key: "rewrite", label: "Rewrite studio", icon: "rewrite" },
      { key: "tracker", label: "Job tracker", icon: "tracker" },
    ],
  },
  {
    label: "Library",
    items: [
      { key: "reports", label: "Reports & exports", icon: "reports" },
      { key: "methodology", label: "Methodology", icon: "methodology" },
    ],
  },
];

const pageMeta: Record<PageKey, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "Analysis", title: "CV overview", description: "A transparent, evidence-based assessment of the CV and job description you provide." },
  ats: { eyebrow: "Structural checks", title: "ATS check", description: "Sections, contact details, headings, and date consistency — the things a parser and a skim both rely on." },
  keywords: { eyebrow: "Tailored analysis", title: "Keyword match", description: "Terms pulled from your target job description, checked against your CV — for any role." },
  content: { eyebrow: "Writing analysis", title: "Content quality", description: "Line-by-line checks for weak openers, passive voice, clichés, and quantified outcomes in your own CV text." },
  recruiter: { eyebrow: "Human scan simulation", title: "Recruiter view", description: "A directional read of what a hiring person would notice first." },
  risks: { eyebrow: "Due diligence", title: "Red flags", description: "Date gaps/overlaps, non-standard headings, and personal data — issues worth verifying or clarifying." },
  fixes: { eyebrow: "Next best actions", title: "Fix plan", description: "A prioritized, checkable plan generated from every signal this check found." },
  rewrite: { eyebrow: "Controlled editing", title: "Rewrite studio", description: "Improve one line at a time. Suggestions never invent facts, numbers, or credentials." },
  tracker: { eyebrow: "Preview", title: "Job tracker", description: "Keep a master CV, tailored variants, and score history together." },
  reports: { eyebrow: "Evidence pack", title: "Reports & exports", description: "Download the current audit as plain text." },
  methodology: { eyebrow: "Transparent by design", title: "Methodology & sources", description: "Every check this engine actually runs, and how the score is computed." },
};

const toneMap: Record<Fix["severity"], "red" | "amber" | "neutral"> = { critical: "red", high: "red", medium: "amber", low: "neutral" };

// The realistic score if every listed fix were applied.
function achievablePotential(result: AnalyzeResult, fixes: Fix[]): number {
  const totalGain = fixes.reduce((sum, item) => sum + Number(item.gain.replace("+", "")), 0);
  return Math.min(100, result.score + totalGain);
}

function ScoreRing({ score, size = "large", color = "#e2f3ef" }: { score: number; size?: "large" | "small"; color?: string }) {
  const dimension = size === "large" ? 168 : 84;
  const stroke = size === "large" ? 10 : 7;
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (score / 100);
  return (
    <div className="relative shrink-0" style={{ width: dimension, height: dimension }}>
      <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`} className="-rotate-90">
        <circle cx={dimension / 2} cy={dimension / 2} r={radius} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={stroke} />
        <circle cx={dimension / 2} cy={dimension / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${circumference - dash}`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={`${size === "large" ? "text-[46px]" : "text-[25px]"} font-semibold leading-none tracking-[-0.07em] text-white`}>{score}</div>
          <div className={`${size === "large" ? "mt-2 text-[11px]" : "mt-1 text-[9px]"} font-medium uppercase tracking-[0.14em] text-slate-300`}>out of 100</div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "blue" }) {
  const tones = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

function PageHeader({ page, onNewCheck, onExport }: { page: PageKey; onNewCheck: () => void; onExport: () => void }) {
  const meta = pageMeta[page];
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#77828f]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#15aa91]" /> {meta.eyebrow}
        </div>
        <h1 className="text-[30px] font-semibold tracking-[-0.045em] text-[#142332]">{meta.title}</h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-[#72808d]">{meta.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onNewCheck} className="button-secondary"><Icon name="plus" size={15} /> New check</button>
        <button onClick={onExport} className="button-dark"><Icon name="download" size={15} /> Export report</button>
      </div>
    </header>
  );
}

function MiniBar({ label, score, tone = "teal", note }: { label: string; score: number; tone?: "teal" | "blue" | "amber" | "purple"; note?: string }) {
  const colors = { teal: "bg-[#16a991]", blue: "bg-[#4c75dd]", amber: "bg-[#e1a44b]", purple: "bg-[#8b77d9]" };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-[12px]">
        <span className="font-medium text-[#43515e]">{label}</span>
        <span className="font-semibold text-[#1b2b39]">{score}<span className="font-normal text-[#9aa4ad]">/100</span></span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#edf0f2]"><div className={`h-full rounded-full ${colors[tone]}`} style={{ width: `${score}%` }} /></div>
      {note && <div className="mt-1.5 text-[10px] text-[#94a0aa]">{note}</div>}
    </div>
  );
}

function EmptyState({ onNewCheck, title = "Run your first CV check", description = "Paste your CV text, or upload a .txt file, so this page can show real results instead of a placeholder." }: { onNewCheck: () => void; title?: string; description?: string }) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-4 p-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf5f2] text-[#168f79]"><Icon name="spark" size={22} /></div>
      <div>
        <h2 className="text-[18px] font-semibold text-[#233440]">{title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-[12px] leading-6 text-[#7d8991]">{description}</p>
      </div>
      <button onClick={onNewCheck} className="button-dark"><Icon name="plus" size={14} /> New check</button>
    </div>
  );
}

function Overview({ result, fileName, targetRole, region, setPage, onNewCheck }: { result: AnalyzeResult | null; fileName: string; targetRole: string; region: string; setPage: (page: PageKey) => void; onNewCheck: () => void }) {
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const potential = achievablePotential(result, result.fixes);
  const tone = result.score >= 80 ? "green" : result.score >= 60 ? "amber" : "red";
  const totalKeywords = result.matchedTerms.length + result.missingTerms.length;
  const tiles: { label: string; score: number; icon: IconName; note: string; page: PageKey }[] = [
    { label: "ATS compatibility", score: result.sections.ats, icon: "ats", note: `${Object.values(result.checks).filter(Boolean).length}/8 structural checks passed`, page: "ats" },
    { label: "Keyword match", score: result.sections.keywords, icon: "keywords", note: totalKeywords ? `${result.matchedTerms.length} of ${totalKeywords} terms matched` : "Add a job description to check keywords", page: "keywords" },
    { label: "Content impact", score: result.sections.content, icon: "content", note: `${result.bullets.filter((b) => b.hasNumber).length}/${result.bullets.length || 0} lines quantified`, page: "content" },
    { label: "Recruiter scan", score: result.sections.scan, icon: "recruiter", note: "Estimated from length and structure", page: "recruiter" },
  ];
  return (
    <>
      <section className="mb-5 grid grid-cols-[1.7fr_1fr] gap-5 max-[1050px]:grid-cols-1">
        <div className="score-hero relative overflow-hidden rounded-[18px] p-7 shadow-[0_14px_32px_rgba(16,35,47,.12)]">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -right-3 -bottom-36 h-80 w-80 rounded-full border border-white/[.07]" />
          <div className="relative flex items-center gap-7 max-[600px]:flex-col max-[600px]:items-start">
            <ScoreRing score={result.score} />
            <div className="min-w-0 flex-1">
              <Badge tone={tone}><span className={`h-1.5 w-1.5 rounded-full ${tone === "green" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-red-500"}`} /> {tone === "green" ? "Good foundation" : tone === "amber" ? "Needs work" : "Needs significant work"}</Badge>
              <h2 className="mt-4 max-w-[390px] text-[23px] font-semibold leading-[1.15] tracking-[-0.04em] text-white">{result.fixes.length} action{result.fixes.length === 1 ? "" : "s"} found in this check.</h2>
              <p className="mt-3 max-w-[470px] text-[12px] leading-5 text-slate-300">{totalKeywords > 0 ? "This score covers structure, wording, dates, and keyword tailoring — all computed from what you provided." : "Add a job description on your next check to unlock keyword tailoring too."}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => setPage("fixes")} className="button-light">View priority fixes <Icon name="arrow" size={14} /></button>
                <button onClick={() => setPage("methodology")} className="button-ghost-light">How this score works <Icon name="info" size={14} /></button>
              </div>
            </div>
          </div>
          <div className="relative mt-7 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 max-[560px]:grid-cols-1">
            <div><div className="text-[10px] uppercase tracking-[.12em] text-slate-400">Potential</div><div className="mt-1 text-[17px] font-semibold text-[#b9efe4]">{potential} <span className="text-[11px] font-normal text-slate-400">+{potential - result.score} pts</span></div></div>
            <div><div className="text-[10px] uppercase tracking-[.12em] text-slate-400">Confidence</div><div className="mt-1 text-[17px] font-semibold text-white capitalize">{result.confidence}</div></div>
            <div><div className="text-[10px] uppercase tracking-[.12em] text-slate-400">Rule set</div><div className="mt-1 text-[17px] font-semibold text-white">v{result.ruleVersion}</div></div>
          </div>
        </div>
        <div className="panel flex flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between"><div><p className="section-kicker">Current check</p><h3 className="mt-2 text-[16px] font-semibold text-[#1c2d3b]">{fileName || "Pasted CV text"}</h3></div></div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#e9edef] bg-[#fafbfb] p-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#fceee8] text-[#d86b45]"><Icon name="file" size={17} /></div><div className="min-w-0"><div className="truncate text-[12px] font-semibold text-[#334451]">{targetRole || "No target role set"}</div><div className="mt-1 text-[10px] text-[#8b969f]">{result.wordCount} words analyzed</div></div><Badge tone="green">Parsed</Badge></div>
            <div className="mt-5 space-y-3"><div className="flex justify-between text-[11px]"><span className="text-[#788691]">Target role</span><span className="font-semibold text-[#3a4b59]">{targetRole || "—"}</span></div><div className="flex justify-between text-[11px]"><span className="text-[#788691]">Region</span><span className="font-semibold text-[#3a4b59]">{region || "—"}</span></div></div>
          </div>
          <button onClick={onNewCheck} className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-[#dfe5e8] py-2.5 text-[11px] font-semibold text-[#52616e] transition hover:bg-[#f5f8f8]"><Icon name="clock" size={14} /> Run another check</button>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-4 gap-4 max-[1050px]:grid-cols-2 max-[580px]:grid-cols-1">
        {tiles.map((item) => <button key={item.label} onClick={() => setPage(item.page)} className="panel group p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(25,45,58,.07)]"><div className="flex items-center justify-between"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1f5f4] text-[#52736f]"><Icon name={item.icon} size={16} /></div><span className="text-[23px] font-semibold tracking-[-.05em] text-[#20303d]">{item.score}</span></div><div className="mt-4 text-[12px] font-semibold text-[#465663]">{item.label}</div><div className="mt-2 h-1 overflow-hidden rounded-full bg-[#edf0f1]"><div className="h-full rounded-full bg-[#18a991]" style={{ width: `${item.score}%` }} /></div><div className="mt-2 text-[10px] text-[#94a0a9]">{item.note}</div></button>)}
      </section>

      <section className="grid grid-cols-[1.35fr_1fr] gap-5 max-[1050px]:grid-cols-1">
        <div className="panel p-6">
          <div className="mb-5 flex items-start justify-between"><div><p className="section-kicker">Highest return</p><h2 className="panel-title">Your top priority fixes</h2></div><button onClick={() => setPage("fixes")} className="text-[11px] font-semibold text-[#168e7b] hover:underline">See all fixes <Icon name="arrow" size={12} /></button></div>
          <div className="divide-y divide-[#edf0f1]">
            {result.fixes.slice(0, 3).map((fix, i) => <button key={fix.id} onClick={() => setPage("fixes")} className="flex w-full items-start gap-3 py-4 text-left first:pt-0 last:pb-0"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${i === 0 ? "bg-[#fcece4] text-[#c65e3c]" : "bg-[#fdf4df] text-[#a97424]"}`}>0{i + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#324350]">{fix.title}<span className="text-[11px] font-semibold text-[#15977f]">{fix.gain}</span></div><p className="mt-1 text-[11px] leading-5 text-[#7d8992]">{fix.detail}</p></div><Icon name="arrow" size={14} /></button>)}
          </div>
        </div>
        <div className="panel p-6">
          <div className="mb-5"><p className="section-kicker">Signal check</p><h2 className="panel-title">What&apos;s working / falling short</h2></div>
          <div className="space-y-4">
            {result.matchedTerms.length > 0 && <div className="rounded-xl border border-[#dcefe9] bg-[#f3fbf8] p-3.5"><div className="flex items-center gap-2 text-[12px] font-semibold text-[#287d6e]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#d7f2e9]"><Icon name="check" size={12} /></span> Strong evidence</div><p className="mt-2 text-[11px] leading-5 text-[#5f7e78]">Matched terms: {result.matchedTerms.slice(0, 6).join(", ")}.</p></div>}
            {result.risks.filter((r) => r.severity !== "low").length > 0 && <div className="rounded-xl border border-[#f5e6c8] bg-[#fffbf2] p-3.5"><div className="flex items-center gap-2 text-[12px] font-semibold text-[#9a722c]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#fff0ca]"><Icon name="alert" size={12} /></span> Needs more signal</div><p className="mt-2 text-[11px] leading-5 text-[#816d4b]">{result.risks.filter((r) => r.severity !== "low")[0]?.why}</p></div>}
            <div className="flex items-start gap-2.5 border-t border-[#edf0f1] pt-4 text-[10px] leading-5 text-[#8d989f]"><Icon name="info" size={14} className="text-[#9da8af]" /> {result.disclaimer}</div>
          </div>
        </div>
      </section>
    </>
  );
}

function AtsPage({ result, fileName, cvText, onUpload, onNewCheck }: { result: AnalyzeResult | null; fileName: string; cvText: string; onUpload: () => void; onNewCheck: () => void }) {
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const checks = [
    { title: "Contact details (email + phone)", pass: result.checks.hasContact, detail: result.checks.hasContact ? "Found together in the main text." : "An email and phone number together weren't found." },
    { title: "LinkedIn URL", pass: result.checks.hasLinkedIn, detail: result.checks.hasLinkedIn ? "Found." : "No linkedin.com/in/... URL found." },
    { title: "Professional summary", pass: result.checks.hasSummary, detail: result.checks.hasSummary ? "A summary/profile heading was found." : "No summary or objective heading was found." },
    { title: "Experience section", pass: result.checks.hasExperience, detail: result.checks.hasExperience ? "Found." : "No standard experience heading was found." },
    { title: "Education section", pass: result.checks.hasEducation, detail: result.checks.hasEducation ? "Found." : "No education heading or degree reference was found." },
    { title: "Skills section", pass: result.checks.hasSkills, detail: result.checks.hasSkills ? "Found." : "No skills section was found." },
    { title: "Standard section headings", pass: result.headings.nonStandard.length === 0, detail: result.headings.nonStandard.length ? `Non-standard: ${result.headings.nonStandard.join(", ")}` : "All detected headings use conventional names." },
    { title: "Date consistency", pass: result.dateIssues.length === 0, detail: result.dateIssues.length ? `${result.dateIssues.length} possible gap/overlap found — see Red flags.` : "No gaps or overlaps detected between date ranges." },
  ];
  const estimatedPages = Math.max(1, Math.ceil(result.wordCount / 500));
  return (
    <>
      <section className="mb-5 grid grid-cols-[1.25fr_1fr] gap-5 max-[1000px]:grid-cols-1">
        <div className="ats-hero rounded-[18px] p-6 text-white"><div className="flex items-start justify-between gap-4"><div><Badge tone={result.sections.ats >= 80 ? "green" : "amber"}><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {result.sections.ats >= 80 ? "Low structural risk" : "Some structural risk"}</Badge><h2 className="mt-4 text-[24px] font-semibold tracking-[-.045em]">{checks.filter((c) => c.pass).length} of {checks.length} structural checks passed.</h2><p className="mt-2 max-w-[490px] text-[12px] leading-5 text-slate-300">These checks look for the sections, headings, and dates a parser and a skimming reader both rely on.</p></div><ScoreRing score={result.sections.ats} size="small" color="#9de4d7" /></div><div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[11px] text-slate-300"><span><b className="text-white">{result.sections.ats}/100</b> compatibility</span><span><b className="text-white">{result.wordCount}</b> words</span></div></div>
        <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="section-kicker">File check</p><h3 className="panel-title">{fileName || "Pasted text"}</h3></div></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="soft-stat"><span>Est. pages</span><b>{estimatedPages}</b></div><div className="soft-stat"><span>Words</span><b>{result.wordCount}</b></div><div className="soft-stat"><span>Characters</span><b>{cvText.length}</b></div><div className="soft-stat"><span>Format</span><b>{fileName ? fileName.split(".").pop()?.toUpperCase() : "Text"}</b></div></div><button onClick={onUpload} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#ccd7d9] py-2.5 text-[11px] font-semibold text-[#4c606b] hover:bg-[#f6f9f8]"><Icon name="upload" size={14} /> Test another file</button></div>
      </section>
      <section className="panel p-6"><div className="mb-5 flex items-start justify-between"><div><p className="section-kicker">Parser diagnostics</p><h2 className="panel-title">What the checks found</h2></div></div><div className="grid grid-cols-2 gap-3 max-[700px]:grid-cols-1">{checks.map((check) => <div key={check.title} className="flex items-start gap-3 rounded-xl border border-[#edf0f1] p-3"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${check.pass ? "bg-[#dff4ec] text-[#168d77]" : "bg-[#fff0d6] text-[#bd7f24]"}`}><Icon name={check.pass ? "check" : "alert"} size={12} strokeWidth={2.4} /></span><div className="min-w-0 flex-1"><div className="text-[11px] font-semibold text-[#40515d]">{check.title}</div><div className="mt-1 text-[10px] leading-4 text-[#89949c]">{check.detail}</div></div></div>)}</div></section>
    </>
  );
}

function KeywordsPage({ result, jobDescription, onNewCheck }: { result: AnalyzeResult | null; jobDescription: string; onNewCheck: () => void }) {
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const total = result.matchedTerms.length + result.missingTerms.length;
  return (
    <>
      <section className="mb-5 grid grid-cols-[1fr_1.5fr] gap-5 max-[1000px]:grid-cols-1">
        <div className="keyword-hero rounded-[18px] p-6 text-white"><div className="flex items-start justify-between"><div><Badge tone={result.sections.keywords >= 70 ? "green" : "amber"}><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {total ? "Relevant, with gaps" : "No job description yet"}</Badge><div className="mt-4 text-[50px] font-semibold leading-none tracking-[-.08em]">{result.sections.keywords}<span className="ml-2 text-[18px] font-normal tracking-normal text-slate-300">/ 100</span></div><p className="mt-3 max-w-[265px] text-[12px] leading-5 text-slate-300">{total ? `${result.matchedTerms.length} of ${total} terms and phrases found in the job description are matched in your CV.` : "Add a job description to the check to unlock tailored keyword matching for any role."}</p></div></div><div className="mt-6 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-[10px] text-slate-400"><div><b className="block text-[18px] text-white">{result.matchedTerms.length}</b>matched</div><div><b className="block text-[18px] text-[#ffb39b]">{result.missingTerms.length}</b>missing</div></div></div>
        <div className="panel p-6"><div className="flex items-start justify-between"><div><p className="section-kicker">Target posting</p><h2 className="panel-title">Job description you provided</h2></div></div><div className="mt-5 rounded-xl bg-[#f5f8f8] p-3.5 text-[11px] leading-5 text-[#687780]">{jobDescription ? jobDescription.slice(0, 400) : "No job description was provided for this check."}</div></div>
      </section>
      <section className="mb-5 panel p-6"><div className="mb-5 flex items-center justify-between"><div><p className="section-kicker">Score components</p><h2 className="panel-title">How this score breaks down</h2></div></div><div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1"><MiniBar label="ATS compatibility (35%)" score={result.sections.ats} tone="teal" /><MiniBar label="Keyword match (25%)" score={result.sections.keywords} tone="blue" /><MiniBar label="Content impact (20%)" score={result.sections.content} tone="amber" /><MiniBar label="Recruiter scan (10%)" score={result.sections.scan} tone="purple" /></div></section>
      <section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Term-by-term evidence</p><h2 className="panel-title">Matched and missing terms/phrases</h2></div><div className="flex gap-2"><Badge tone="green">Matched {result.matchedTerms.length}</Badge><Badge tone="red">Missing {result.missingTerms.length}</Badge></div></div>{total === 0 ? <div className="p-6 text-[12px] text-[#7d8991]">Add a job description to your next check to see term-by-term evidence.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left"><thead><tr className="border-b border-[#edf0f1] text-[10px] uppercase tracking-[.1em] text-[#9aa4aa]"><th className="px-6 py-3 font-semibold">Term / phrase</th><th className="px-4 py-3 font-semibold">Status</th></tr></thead><tbody>{[...result.matchedTerms.map((term) => ({ term, status: "matched" as const })), ...result.missingTerms.map((term) => ({ term, status: "missing" as const }))].map((row) => <tr key={row.term} className="border-b border-[#f0f2f2] last:border-0"><td className="px-6 py-3.5 text-[12px] font-semibold text-[#334552]">{row.term}</td><td className="px-4 py-3.5"><Badge tone={row.status === "matched" ? "green" : "red"}>{row.status === "matched" ? "Matched" : "Missing"}</Badge></td></tr>)}</tbody></table></div>}</section>
    </>
  );
}

function ContentPage({ result, onNewCheck }: { result: AnalyzeResult | null; onNewCheck: () => void }) {
  const [filter, setFilter] = useState("All lines");
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const bullets = result.bullets;
  if (!bullets.length) return <EmptyState onNewCheck={onNewCheck} title="No substantive lines found" description="Paste your CV text (lines longer than 15 characters) to get a line-by-line review." />;
  const filtered = filter === "All lines" ? bullets : filter === "Needs proof" ? bullets.filter((b) => !b.hasNumber) : filter === "Weak opener" ? bullets.filter((b) => b.weakOpener) : bullets.filter((b) => b.passiveVoice || b.cliches.length || b.firstPerson);
  const quantifiedPct = Math.round((bullets.filter((b) => b.hasNumber).length / bullets.length) * 100);
  const weakCount = bullets.filter((b) => b.weakOpener).length;
  const passiveCount = bullets.filter((b) => b.passiveVoice).length;
  return (
    <>
      <section className="mb-5 grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <div className="panel p-5"><div className="text-[27px] font-semibold tracking-[-.06em] text-[#15937e]">{quantifiedPct}%</div><div className="mt-2 text-[11px] font-semibold text-[#4a5b66]">quantified lines</div><div className="mt-1 text-[10px] text-[#929da4]">lines that include a number</div></div>
        <div className="panel p-5"><div className="text-[27px] font-semibold tracking-[-.06em] text-[#b27a29]">{weakCount}</div><div className="mt-2 text-[11px] font-semibold text-[#4a5b66]">weak openers</div><div className="mt-1 text-[10px] text-[#929da4]">e.g. &quot;responsible for&quot;, &quot;helped&quot;</div></div>
        <div className="panel p-5"><div className="text-[27px] font-semibold tracking-[-.06em] text-[#8b5fbf]">{passiveCount}</div><div className="mt-2 text-[11px] font-semibold text-[#4a5b66]">passive-voice lines</div><div className="mt-1 text-[10px] text-[#929da4]">e.g. &quot;was responsible for&quot;</div></div>
        <div className="panel p-5"><div className="text-[27px] font-semibold tracking-[-.06em] text-[#5272cc]">{result.cliches.length}</div><div className="mt-2 text-[11px] font-semibold text-[#4a5b66]">generic phrases</div><div className="mt-1 text-[10px] text-[#929da4]">{result.cliches.length ? result.cliches.slice(0, 3).join(", ") : "none found"}</div></div>
      </section>
      {result.repeatedWords.length > 0 && <section className="mb-5 panel p-5"><p className="section-kicker">Word repetition</p><p className="mt-2 text-[12px] leading-5 text-[#6e7f87]">These words appear often across your CV — consider varying vocabulary: {result.repeatedWords.map((r) => `${r.word} (${r.count}×)`).join(", ")}.</p></section>}
      <section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Line-level review</p><h2 className="panel-title">Every substantive line gets an evidence check</h2></div><div className="flex flex-wrap gap-2">{["All lines", "Needs proof", "Weak opener", "Writing style"].map((option) => <button key={option} onClick={() => setFilter(option)} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${filter === option ? "bg-[#eaf5f2] text-[#168c78]" : "text-[#88949c] hover:bg-[#f5f7f7]"}`}>{option}</button>)}</div></div><div className="divide-y divide-[#edf0f1]">{filtered.map((bullet) => <div key={bullet.id} className="grid grid-cols-[40px_1fr_150px] gap-4 px-6 py-4 max-[760px]:grid-cols-[32px_1fr] max-[760px]:gap-3"><div className="grid h-7 w-7 place-items-center rounded-lg bg-[#f1f4f4] text-[10px] font-bold text-[#7a8890]">{bullet.id}</div><div><div className="text-[12px] leading-5 text-[#40515d]">{bullet.text}</div><div className="mt-2 flex flex-wrap gap-1.5"><Badge tone={bullet.hasNumber ? "green" : "red"}>{bullet.hasNumber ? "Has a number" : "No number found"}</Badge>{bullet.weakOpener && <Badge tone="amber">Weak opener</Badge>}{bullet.strongOpener && <Badge tone="blue">Strong verb</Badge>}{bullet.passiveVoice && <Badge tone="amber">Passive voice</Badge>}{bullet.firstPerson && <Badge tone="amber">First person</Badge>}{bullet.cliches.length > 0 && <Badge tone="red">Generic phrase</Badge>}</div></div><div className="max-[760px]:col-span-2 max-[760px]:ml-11"><div className="flex items-center justify-between text-[10px] text-[#8d999f]"><span>Line score</span><b className={bullet.score >= 70 ? "text-[#168d78]" : "text-[#b27a2a]"}>{bullet.score}</b></div><div className="mt-2 h-1.5 rounded-full bg-[#edf0f1]"><div className={`h-full rounded-full ${bullet.score >= 70 ? "bg-[#1ca88f]" : "bg-[#e0a24b]"}`} style={{ width: `${bullet.score}%` }} /></div></div></div>)}</div></section>
    </>
  );
}

function RecruiterPage({ result, onNewCheck }: { result: AnalyzeResult | null; onNewCheck: () => void }) {
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const qa = [
    { q: "Can they be reached?", a: result.checks.hasContact ? "Yes — contact details were found in the main text." : "Unclear — no email + phone pair was found in the main text." },
    { q: "Is there a quick summary up top?", a: result.checks.hasSummary ? "Yes — a summary/profile section is present." : "No — there's no summary or objective section to orient a reader quickly." },
    { q: "Is their experience clear?", a: result.checks.hasExperience ? "Yes — a standard experience heading is present." : "No standard experience heading was detected." },
    { q: "Is the length reasonable to skim?", a: result.wordCount <= 700 ? `Yes — about ${result.wordCount} words is easy to scan.` : `Possibly long — about ${result.wordCount} words may take longer to skim.` },
    { q: "Does the wording sound generic?", a: result.cliches.length ? `${result.cliches.length} common filler phrase(s) found (e.g. "${result.cliches[0]}") — these read as generic.` : "No common filler phrases detected." },
  ];
  return (
    <>
      <section className="mb-5 recruiter-hero rounded-[18px] p-6 text-white"><div className="flex items-start justify-between"><div><Badge tone={result.sections.scan >= 70 ? "green" : "amber"}><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {result.sections.scan >= 70 ? "Likely easy to scan" : "May take extra effort to scan"}</Badge><h2 className="mt-4 text-[25px] font-semibold tracking-[-.05em]">A directional read of what a hiring person notices first.</h2></div><div className="text-right"><div className="text-[47px] font-semibold leading-none tracking-[-.08em]">{result.sections.scan}</div><div className="mt-1 text-[10px] uppercase tracking-[.15em] text-slate-400">scan score</div></div></div></section>
      <section className="panel p-6"><div className="mb-5"><p className="section-kicker">Quick read</p><h2 className="panel-title">A hiring person&apos;s first questions</h2></div><div className="space-y-4">{qa.map((item) => <div key={item.q} className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.a.startsWith("Yes") ? "bg-[#1aa68e]" : "bg-[#e1a64a]"}`} /><div><div className="text-[11px] font-semibold text-[#43545f]">{item.q}</div><div className="mt-1 text-[11px] leading-5 text-[#7e8b93]">{item.a}</div></div></div>)}</div></section>
    </>
  );
}

function RisksPage({ result, setPage, onNewCheck }: { result: AnalyzeResult | null; setPage: (page: PageKey) => void; onNewCheck: () => void }) {
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const riskTone: Record<Risk["severity"], "red" | "amber" | "green"> = { critical: "red", high: "red", medium: "amber", low: "green" };
  return (
    <>
      <section className="mb-5 grid grid-cols-[1.2fr_1fr] gap-5 max-[1000px]:grid-cols-1">
        <div className="risk-hero rounded-[18px] p-6 text-white"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-[#ffc29e]"><Icon name="alert" size={17} /></span><span className="text-[11px] font-semibold uppercase tracking-[.12em] text-slate-300">Risk review</span></div><h2 className="mt-4 text-[25px] font-semibold tracking-[-.05em]">{result.risks.length} finding{result.risks.length === 1 ? "" : "s"} from this check.</h2><p className="mt-2 max-w-[470px] text-[12px] leading-5 text-slate-300">A finding is a prompt to verify or clarify — not a verdict about your ability. We never score identity traits.</p></div>
        <div className="panel p-6"><p className="section-kicker">What we do not score</p><h2 className="panel-title">Identity is not a signal</h2><div className="mt-4 space-y-3 text-[11px] leading-5 text-[#71808a]"><div className="flex gap-2"><Icon name="lock" size={14} className="mt-0.5 shrink-0 text-[#15957e]" /> No penalty for name, age, gender, nationality, photo, or inferred background.</div><div className="flex gap-2"><Icon name="lock" size={14} className="mt-0.5 shrink-0 text-[#15957e]" /> Claims are flagged for verification, not labelled dishonest.</div></div></div>
      </section>
      <section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Findings</p><h2 className="panel-title">What could create doubt</h2></div><button onClick={() => setPage("fixes")} className="button-secondary">See fix plan <Icon name="arrow" size={13} /></button></div><div className="divide-y divide-[#edf0f1]">{result.risks.map((risk, i) => <div key={`${risk.title}-${i}`} className="grid grid-cols-[110px_1fr] gap-5 px-6 py-4 max-[600px]:grid-cols-1 max-[600px]:gap-2"><div><Badge tone={riskTone[risk.severity]}>{risk.severity}</Badge></div><div><div className="text-[12px] font-semibold text-[#344652]">{risk.title}</div><p className="mt-1 text-[11px] leading-5 text-[#849097]">{risk.why}</p></div></div>)}</div></section>
    </>
  );
}

function FixesPage({ result, notify, onNewCheck }: { result: AnalyzeResult | null; notify: (text: string) => void; onNewCheck: () => void }) {
  const [done, setDone] = useState<number[]>([]);
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const fixes = result.fixes;
  const toggle = (id: number) => { setDone((old) => (old.includes(id) ? old.filter((item) => item !== id) : [...old, id])); if (!done.includes(id)) notify("Fix marked complete"); };
  const totalGain = fixes.filter((item) => !done.includes(item.id)).reduce((sum, item) => sum + Number(item.gain.replace("+", "")), 0);
  const potential = achievablePotential(result, fixes);
  return (
    <>
      <section className="mb-5 grid grid-cols-[1.4fr_1fr] gap-5 max-[1000px]:grid-cols-1">
        <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="section-kicker">Completion</p><h2 className="panel-title">Turn {result.score} into {potential}</h2></div><div className="text-right"><div className="text-[25px] font-semibold tracking-[-.06em] text-[#168f79]">{done.length}/{fixes.length}</div><div className="text-[10px] text-[#95a0a6]">actions complete</div></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf0f1]"><div className="h-full rounded-full bg-[#18a991] transition-all" style={{ width: `${fixes.length ? (done.length / fixes.length) * 100 : 0}%` }} /></div></div>
        <div className="fix-quote rounded-[18px] p-6 text-white"><Icon name="spark" size={20} /><h3 className="mt-4 text-[17px] font-semibold">Fix signal, not decoration.</h3><p className="mt-2 text-[11px] leading-5 text-slate-300">The highest gains come from parse reliability, exact terms, and verifiable outcomes — not from changing colors.</p></div>
      </section>
      <section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Prioritized by score gain</p><h2 className="panel-title">Your action list</h2></div></div><div className="divide-y divide-[#edf0f1]">{fixes.map((fix) => <div key={fix.id} className={`flex items-start gap-4 px-6 py-5 transition ${done.includes(fix.id) ? "bg-[#fbfcfc] opacity-60" : ""}`}><button onClick={() => toggle(fix.id)} className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${done.includes(fix.id) ? "border-[#21a78f] bg-[#21a78f] text-white" : "border-[#cbd6d7] text-transparent hover:border-[#21a78f]"}`}><Icon name="check" size={14} strokeWidth={2.5} /></button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`text-[12px] font-semibold ${done.includes(fix.id) ? "text-[#7c8a90] line-through" : "text-[#344652]"}`}>{fix.title}</span><Badge tone={toneMap[fix.severity]}>{fix.severity}</Badge></div><p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-[#7d8991]">{fix.detail}</p></div><div className="shrink-0 text-right"><div className="text-[16px] font-semibold text-[#168f79]">{fix.gain}</div><div className="mt-1 text-[9px] uppercase tracking-[.08em] text-[#a1aaaf]">est. gain</div></div></div>)}</div><div className="flex items-center justify-between bg-[#f7faf9] px-6 py-4 text-[11px] text-[#72818a]"><span><b className="text-[#2c4a53]">{totalGain} points</b> remain in the current plan</span></div></section>
    </>
  );
}

function RewritePage({ result, notify, onNewCheck }: { result: AnalyzeResult | null; notify: (text: string) => void; onNewCheck: () => void }) {
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [textInitialized, setTextInitialized] = useState(false);
  if (!result || !result.bullets.length) return <EmptyState onNewCheck={onNewCheck} title="No lines to rewrite yet" description="Paste your CV text in a new check to start rewriting real lines." />;
  const bullets = result.bullets;
  const current: BulletAnalysis = bullets[selected] ?? bullets[0];
  if (!textInitialized) {
    setText(current.text);
    setTextInitialized(true);
  }
  const suggestions: string[] = [];
  if (current.weakOpener) suggestions.push("Start with a strong verb (Led, Built, Reduced, Increased...) instead of the current opener.");
  if (current.passiveVoice) suggestions.push("Rewrite in active voice — say what you did, not what \"was done\".");
  if (current.cliches.length) suggestions.push(`Replace generic phrasing: "${current.cliches.join("\", \"")}" with something specific.`);
  if (current.firstPerson) suggestions.push("Remove first-person pronouns (\"I\", \"my\", \"me\").");
  if (!current.hasNumber) suggestions.push("Add a measurable result: %, $, time period, or count.");
  const liveScore = Math.min(96, 45 + Math.round((text.length / 140) * 20) + (/\d/.test(text) ? 20 : 0) + (suggestions.length === 0 ? 15 : 0));
  const selectLine = (index: number) => { setSelected(index); setText(bullets[index].text); setSaved(false); };
  return (
    <>
      <section className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-[#dbe9e5] bg-[#f2faf7] p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#16947d] shadow-sm"><Icon name="spark" size={18} /></div><div><div className="text-[12px] font-semibold text-[#304d50]">Evidence-safe suggestions</div><div className="mt-1 text-[11px] text-[#718a86]">Concrete, specific issues drawn from this line — never a fabricated rewrite. We never invent numbers.</div></div></div><Badge tone="green">Live score · {liveScore}/100</Badge></section>
      <section className="grid grid-cols-[1fr_1fr] gap-5 max-[1000px]:grid-cols-1">
        <div className="panel overflow-hidden"><div className="border-b border-[#edf0f1] px-6 py-5"><p className="section-kicker">Choose a line</p><h2 className="panel-title">Lines from your CV</h2></div><div className="divide-y divide-[#edf0f1]">{bullets.slice(0, 8).map((bullet, index) => <button key={bullet.id} onClick={() => selectLine(index)} className={`w-full p-4 text-left transition ${selected === index ? "bg-[#f1faf7]" : "hover:bg-[#fafcfc]"}`}><div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.07em] text-[#9aa4aa]">Line {bullet.id}</span>{selected === index && <span className="text-[10px] font-semibold text-[#16947d]">Editing</span>}</div><p className="mt-1.5 text-[11px] leading-5 text-[#596b75]">{bullet.text}</p></button>)}</div></div>
        <div className="panel p-6"><div className="flex items-start justify-between"><div><p className="section-kicker">Tracked-change style</p><h2 className="panel-title">Make the outcome unavoidable</h2></div><Badge tone={liveScore > 75 ? "green" : "amber"}>{liveScore} / 100</Badge></div><textarea value={text} onChange={(event) => { setText(event.target.value); setSaved(false); }} className="mt-5 min-h-[135px] w-full resize-y rounded-xl border border-[#d9e4e2] bg-[#fbfdfc] p-4 text-[12px] leading-6 text-[#40535c] outline-none transition focus:border-[#51bba8] focus:ring-2 focus:ring-[#d9f1eb]" /><div className="mt-4 rounded-xl border border-[#e9edf0] bg-[#fcfcfb] p-4"><div className="flex items-center gap-2 text-[11px] font-semibold text-[#40545f]"><Icon name="spark" size={14} className="text-[#db9a37]" /> Issues found on this line</div>{suggestions.length ? <ul className="mt-3 space-y-2 text-[11px] leading-5 text-[#6e7d85]">{suggestions.map((s) => <li key={s} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e0a344]" />{s}</li>)}</ul> : <p className="mt-3 text-[11px] leading-5 text-[#168f79]">No issues detected on this line.</p>}</div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => { setSaved(true); notify("Draft saved"); }} className="button-dark"><Icon name={saved ? "check" : "lock"} size={14} /> {saved ? "Saved" : "Save variant"}</button><button onClick={() => { setText(current.text); setSaved(false); }} className="button-secondary">Reset line</button></div><div className="mt-4 flex gap-2 text-[10px] leading-4 text-[#99a4aa]"><Icon name="info" size={13} className="mt-0.5 shrink-0" /> Ask yourself: How many people? What changed? Compared with when? Which segment or market?</div></div>
      </section>
    </>
  );
}

function TrackerPage() {
  return (
    <>
      <section className="mb-5 rounded-[18px] border border-[#f5e6c8] bg-[#fffbf2] p-5 text-[12px] leading-6 text-[#816d4b]"><b>Preview only.</b> Saving CV versions, target jobs, and score history requires a connected database, which isn&apos;t set up yet. The rows below are illustrative examples of what this page will show.</section>
      <section className="panel overflow-hidden"><div className="border-b border-[#edf0f1] px-6 py-5"><p className="section-kicker">Example</p><h2 className="panel-title">CV versions</h2></div><div className="divide-y divide-[#edf0f1]">{[{ name: "Master CV", meta: "Sample row" }, { name: "Tailored variant", meta: "Sample row" }].map((item) => <div key={item.name} className="flex items-center gap-4 px-6 py-4"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f2f6f5] text-[#5a7470]"><Icon name="file" size={16} /></div><div className="min-w-0 flex-1"><div className="text-[12px] font-semibold text-[#3b4d59]">{item.name}</div><div className="mt-1 text-[10px] text-[#929da3]">{item.meta}</div></div></div>)}</div></section>
    </>
  );
}

function ReportsPage({ result, notify, onNewCheck }: { result: AnalyzeResult | null; notify: (text: string) => void; onNewCheck: () => void }) {
  if (!result) return <EmptyState onNewCheck={onNewCheck} />;
  const downloadText = () => {
    const potential = achievablePotential(result, result.fixes);
    const content = [
      "CV SIGNAL · AUDIT",
      "",
      `Score: ${result.score}/100 · Potential if all fixes applied: ${potential}/100`,
      `Confidence: ${result.confidence} · Rule set: v${result.ruleVersion}`,
      `Word count: ${result.wordCount}`,
      "",
      `Matched keywords: ${result.matchedTerms.join(", ") || "none"}`,
      `Missing keywords: ${result.missingTerms.join(", ") || "none"}`,
      "",
      "Top fixes:",
      ...result.fixes.slice(0, 8).map((fix, i) => `${i + 1}. ${fix.title} (${fix.gain})`),
      "",
      "Red flags:",
      ...result.risks.map((risk, i) => `${i + 1}. [${risk.severity}] ${risk.title} — ${risk.why}`),
      "",
      result.disclaimer,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "cv-signal-audit.txt";
    link.click();
    URL.revokeObjectURL(url);
    notify("Plain-text audit downloaded");
  };
  return (
    <>
      <section className="mb-5 report-hero rounded-[18px] p-6 text-white"><Badge tone="green">Ready to share</Badge><h2 className="mt-4 text-[25px] font-semibold tracking-[-.05em]">Your evidence pack is ready.</h2><p className="mt-2 max-w-[450px] text-[12px] leading-5 text-slate-300">Export the current audit as plain text. PDF and DOCX export are on the roadmap.</p><div className="mt-6 flex flex-wrap gap-2"><button onClick={downloadText} className="button-light"><Icon name="download" size={14} /> Download audit</button></div></section>
      <section className="panel p-6"><p className="section-kicker">Privacy status</p><h2 className="panel-title">Private workspace</h2><div className="mt-4 flex items-center gap-2 text-[11px] text-[#667781]"><Icon name="lock" size={15} className="text-[#168f79]" /> Your CV is not used for training or shared without consent.</div></section>
      <button onClick={onNewCheck} className="hidden" aria-hidden />
    </>
  );
}

function MethodologyPage() {
  const [open, setOpen] = useState<string | null>("ats");
  const sections = [
    { id: "ats", title: "ATS / structural checks", label: "Rule-based", text: "We look for a contact-info pattern, LinkedIn URL, and standard headings for summary, experience, education, and skills. We also flag any heading-like line that doesn't match a conventional name, and check whether the date ranges we can detect are internally consistent (no obvious gaps or overlaps).", source: "Weighted at 35% of the total score." },
    { id: "keywords", title: "Keyword match", label: "Dynamic", text: "Single words and two-word phrases are extracted directly from whatever job description you paste in — a frequency-based scan with common words filtered out — then checked against your CV. There is no fixed list of roles or industries; this works for any job description.", source: "Weighted at 25% of the total score." },
    { id: "content", title: "Content & writing quality", label: "Rule-based heuristic", text: "Each substantive line is checked for: a strong action-verb opener vs. a weak one (\"responsible for\", \"helped\"...), a quantified result (a number, %, or amount), passive voice (\"was responsible for\"), first-person pronouns, and common résumé clichés (\"team player\", \"results-driven\"...). We also flag words repeated unusually often.", source: "Weighted at 20% of the total score." },
    { id: "scan", title: "Recruiter scan", label: "Directional heuristic", text: "A rough estimate of scannability based on contact info and a summary being present, plus the CV's overall length.", source: "Weighted at 10% of the total score." },
    { id: "consistency", title: "Consistency & formatting", label: "Rule-based heuristic", text: "Derived from whether all detected headings are conventional, and whether the detected employment date ranges are free of gaps and overlaps.", source: "Weighted at 10% of the total score." },
    { id: "risk", title: "Red flags", label: "Rule-based", text: "Employment date gaps/overlaps (from year ranges we can detect), non-standard headings, and personal data (date of birth, marital status, nationality, age) are surfaced as findings to verify — never scored against you.", source: "Informational — not part of the weighted score." },
    { id: "ethics", title: "Bias & privacy", label: "Safeguard", text: "We do not score a name, age, gender, nationality, photo, or inferred background. Personal data is a privacy concern, not a quality signal.", source: "Fair hiring principles; GDPR-oriented product safeguards." },
  ];
  return (
    <>
      <section className="mb-5 rounded-[18px] border border-[#dfe9e6] bg-[#f5fbf9] p-6"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#168f79] shadow-sm"><Icon name="methodology" size={19} /></div><div><h2 className="text-[18px] font-semibold tracking-[-.03em] text-[#27444b]">No black box. No fake ATS pass.</h2><p className="mt-2 max-w-3xl text-[12px] leading-6 text-[#6e8581]">CV Signal is a deterministic, rule-based engine — every finding below is a real pattern match against the text you provide, with no external AI call and no fabricated detail. It cannot know a company&apos;s private filters, recruiter workload, or what a hiring manager values, and it cannot catch everything a human editor would.</p></div></div></section>
      <section className="panel overflow-hidden"><div className="border-b border-[#edf0f1] px-6 py-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Rulebook v3.0</p><h2 className="panel-title">Every check this engine runs</h2></div></div></div><div className="divide-y divide-[#edf0f1]">{sections.map((section) => <div key={section.id} className="px-6"><button onClick={() => setOpen(open === section.id ? null : section.id)} className="flex w-full items-center gap-3 py-4 text-left"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#f1f5f4] text-[#6c807f]"><Icon name={open === section.id ? "chevron" : "arrow"} size={13} /></span><span className="flex-1 text-[12px] font-semibold text-[#40525d]">{section.title}</span><Badge tone={section.label === "Safeguard" ? "green" : section.label === "Dynamic" ? "blue" : "neutral"}>{section.label}</Badge></button>{open === section.id && <div className="ml-9 max-w-3xl pb-5"><p className="text-[12px] leading-6 text-[#697b84]">{section.text}</p><div className="mt-3 border-l-2 border-[#bde5db] pl-3 text-[10px] leading-5 text-[#95a0a5]">{section.source}</div></div>}</div>)}</div></section>
      <section className="mt-5 grid grid-cols-5 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">{[{ number: "35%", label: "ATS compatibility" }, { number: "25%", label: "Keyword match" }, { number: "20%", label: "Content impact" }, { number: "10%", label: "Recruiter scan" }, { number: "10%", label: "Consistency & formatting" }].map((item) => <div key={item.label} className="panel p-4"><div className="text-[20px] font-semibold tracking-[-.05em] text-[#168f79]">{item.number}</div><div className="mt-2 text-[11px] font-semibold text-[#445660]">{item.label}</div></div>)}</section>
    </>
  );
}

const ROLE_SUGGESTIONS = ["Software Engineer", "Product Manager", "Registered Nurse", "Data Analyst", "Sales Executive", "Marketing Manager", "Teacher", "Accountant", "Project Manager", "Customer Success Manager", "Mechanical Engineer", "Graphic Designer"];
const SENIORITY_SUGGESTIONS = ["Entry level", "Associate", "Mid-level", "Senior", "Manager", "Director", "VP", "Executive"];
const INDUSTRY_SUGGESTIONS = ["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Nonprofit", "Government", "Consulting", "Hospitality"];
const REGION_SUGGESTIONS = ["United States", "United Kingdom", "Canada", "Australia", "European Union", "India", "Remote"];

function NewCheckModal({
  onClose, onFile, uploadStatus, onStart, cvText, setCvText, jobDescription, setJobDescription, targetRole, setTargetRole, seniority, setSeniority, industry, setIndustry, region, setRegion, analyzing, analyzeError,
}: {
  onClose: () => void;
  onFile: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadStatus: string;
  onStart: () => void;
  cvText: string;
  setCvText: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  targetRole: string;
  setTargetRole: (value: string) => void;
  seniority: string;
  setSeniority: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  analyzing: boolean;
  analyzeError: string;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#168f79]"><Icon name="spark" size={13} /> New CV check</div>
            <h2 className="text-[24px] font-semibold tracking-[-.05em] text-[#1c2c39]">Bring a CV. Get evidence.</h2>
            <p className="mt-2 max-w-md text-[12px] leading-5 text-[#788790]">Upload a .txt file or paste the content below. Add a job description for tailored, role-agnostic scoring — any role, any industry.</p>
          </div>
          <button onClick={onClose} className="icon-button"><Icon name="close" size={18} /></button>
        </div>
        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#b9d5d0] bg-[#f5fbf9] px-5 py-8 text-center transition hover:bg-[#edf8f4]">
          <input type="file" accept=".pdf,.docx,.txt" onChange={onFile} className="hidden" />
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#168f79] shadow-sm"><Icon name="upload" size={19} /></span>
          <span className="mt-3 text-[12px] font-semibold text-[#40555d]">Drop PDF, DOCX, or TXT here</span>
          <span className="mt-1 text-[10px] text-[#8c999e]">.txt files are read automatically. For PDF/DOCX, paste the text below.</span>
        </label>
        {uploadStatus && <div className={`mt-3 rounded-lg p-3 text-[11px] ${uploadStatus.startsWith("Unsupported") || uploadStatus.startsWith("This file") ? "bg-[#fff2ed] text-[#bd6548]" : "bg-[#eef9f5] text-[#34806f]"}`}>{uploadStatus}</div>}
        <label className="mt-4 block">
          <span className="field-label">Paste CV text</span>
          <textarea value={cvText} onChange={(event) => setCvText(event.target.value)} className="field min-h-[90px] resize-none" placeholder="Paste the selectable text from your CV here..." />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label>
            <span className="field-label">Target role</span>
            <input list="role-suggestions" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} className="field" placeholder="e.g. Registered Nurse" />
            <datalist id="role-suggestions">{ROLE_SUGGESTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </label>
          <label>
            <span className="field-label">Seniority</span>
            <input list="seniority-suggestions" value={seniority} onChange={(event) => setSeniority(event.target.value)} className="field" placeholder="e.g. Senior" />
            <datalist id="seniority-suggestions">{SENIORITY_SUGGESTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </label>
          <label>
            <span className="field-label">Industry</span>
            <input list="industry-suggestions" value={industry} onChange={(event) => setIndustry(event.target.value)} className="field" placeholder="e.g. Healthcare" />
            <datalist id="industry-suggestions">{INDUSTRY_SUGGESTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </label>
          <label>
            <span className="field-label">Country / region</span>
            <input list="region-suggestions" value={region} onChange={(event) => setRegion(event.target.value)} className="field" placeholder="e.g. Canada" />
            <datalist id="region-suggestions">{REGION_SUGGESTIONS.map((option) => <option key={option} value={option} />)}</datalist>
          </label>
        </div>
        <label className="mt-4 block">
          <span className="field-label">Paste target job description <span className="font-normal text-[#a3adb2]">(optional, but unlocks keyword matching)</span></span>
          <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} className="field min-h-[75px] resize-none" placeholder="Paste the posting here to check your CV against its actual language..." />
        </label>
        {analyzeError && <div className="mt-3 rounded-lg bg-[#fff2ed] p-3 text-[11px] text-[#bd6548]">{analyzeError}</div>}
        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-[#929da3]"><Icon name="lock" size={13} /> Private by default</span>
          <button onClick={onStart} disabled={analyzing} className="button-dark disabled:opacity-60">{analyzing ? "Analyzing…" : "Run analysis"} <Icon name="arrow" size={14} /></button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activePage, setActivePage] = useState<PageKey>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [seniority, setSeniority] = useState("");
  const [industry, setIndustry] = useState("");
  const [region, setRegion] = useState("");
  const [fileName, setFileName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 2600); };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".pdf") && !lower.endsWith(".docx") && !lower.endsWith(".txt")) {
      setUploadStatus("Unsupported format. Please use PDF, DOCX, or TXT. Scanned PDFs, .pages, and .odt cannot be reliably parsed.");
      return;
    }
    if (file.size === 0) {
      setUploadStatus("This file is empty or unreadable. Try exporting the original document again.");
      return;
    }
    setFileName(file.name);
    if (lower.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => { setCvText(String(reader.result ?? "")); setUploadStatus(`${file.name} loaded — ${String(reader.result ?? "").split(/\s+/).filter(Boolean).length} words.`); };
      reader.readAsText(file);
    } else {
      setUploadStatus(`${file.name} selected. PDF/DOCX text isn't extracted automatically yet — paste the CV text below to be analyzed.`);
    }
  };

  const runAnalysis = async () => {
    if (!cvText.trim()) {
      setAnalyzeError("Paste your CV text, or upload a .txt file, before running a check.");
      return;
    }
    setAnalyzing(true);
    setAnalyzeError("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to analyze this CV");
      setResult(data as AnalyzeResult);
      setModalOpen(false);
      setActivePage("overview");
      notify("Analysis complete · score updated");
    } catch (error) {
      setAnalyzeError(error instanceof Error ? error.message : "Unable to analyze this CV");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (activePage !== "reports") setActivePage("reports");
    if (!result) notify("Run a check first to export a report");
  };

  const renderPage = useMemo(() => {
    const openModal = () => setModalOpen(true);
    if (activePage === "overview") return <Overview result={result} fileName={fileName} targetRole={targetRole} region={region} setPage={setActivePage} onNewCheck={openModal} />;
    if (activePage === "ats") return <AtsPage result={result} fileName={fileName} cvText={cvText} onUpload={openModal} onNewCheck={openModal} />;
    if (activePage === "keywords") return <KeywordsPage result={result} jobDescription={jobDescription} onNewCheck={openModal} />;
    if (activePage === "content") return <ContentPage result={result} onNewCheck={openModal} />;
    if (activePage === "recruiter") return <RecruiterPage result={result} onNewCheck={openModal} />;
    if (activePage === "risks") return <RisksPage result={result} setPage={setActivePage} onNewCheck={openModal} />;
    if (activePage === "fixes") return <FixesPage result={result} notify={notify} onNewCheck={openModal} />;
    if (activePage === "rewrite") return <RewritePage result={result} notify={notify} onNewCheck={openModal} />;
    if (activePage === "tracker") return <TrackerPage />;
    if (activePage === "reports") return <ReportsPage result={result} notify={notify} onNewCheck={openModal} />;
    return <MethodologyPage />;
  }, [activePage, result, fileName, targetRole, region, cvText, jobDescription]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><span /> <span /> <span /></div><span className="brand-name">cv<span>/</span>signal</span><span className="brand-beta">BETA</span></div>
        <nav className="sidebar-nav">{navGroups.map((group) => <div key={group.label} className="nav-group"><div className="nav-label">{group.label}</div>{group.items.map((item) => <button key={item.key} onClick={() => setActivePage(item.key)} className={`nav-item ${activePage === item.key ? "active" : ""}`}><Icon name={item.icon} size={16} /><span>{item.label}</span></button>)}</div>)}</nav>
        <div className="sidebar-bottom"><div className="privacy-note"><Icon name="lock" size={14} /><div><div className="text-[10px] font-semibold text-[#53636e]">Private workspace</div><div className="mt-1 text-[9px] leading-4 text-[#9aa5aa]">Your data is not used for training.</div></div></div></div>
      </aside>
      <main className="main-content">
        <div className="topbar">
          <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={13} /><b>{pageMeta[activePage].title}</b></div>
          <div className="topbar-actions"><label className="search-box"><Icon name="search" size={15} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search" />{globalSearch && <button onClick={() => setGlobalSearch("")}><Icon name="close" size={12} /></button>}</label></div>
        </div>
        <div className="content-wrap">
          <PageHeader page={activePage} onNewCheck={() => setModalOpen(true)} onExport={handleExport} />
          {renderPage}
        </div>
      </main>
      {toast && <div className="toast"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#d8f5eb] text-[#168d77]"><Icon name="check" size={12} /></span>{toast}</div>}
      {modalOpen && (
        <NewCheckModal
          onClose={() => setModalOpen(false)}
          onFile={handleUpload}
          uploadStatus={uploadStatus}
          onStart={runAnalysis}
          cvText={cvText}
          setCvText={setCvText}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          seniority={seniority}
          setSeniority={setSeniority}
          industry={industry}
          setIndustry={setIndustry}
          region={region}
          setRegion={setRegion}
          analyzing={analyzing}
          analyzeError={analyzeError}
        />
      )}
    </div>
  );
}
