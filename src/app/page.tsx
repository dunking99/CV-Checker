"use client";

import { ChangeEvent, ReactNode, useMemo, useState } from "react";

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

const navGroups: { label: string; items: { key: PageKey; label: string; icon: IconName; badge?: string }[] }[] = [
  {
    label: "Workspace",
    items: [
      { key: "overview", label: "Overview", icon: "overview" },
      { key: "ats", label: "ATS check", icon: "ats", badge: "2" },
      { key: "keywords", label: "Keyword match", icon: "keywords" },
      { key: "content", label: "Content quality", icon: "content" },
      { key: "recruiter", label: "Recruiter view", icon: "recruiter" },
      { key: "risks", label: "Red flags", icon: "risks", badge: "6" },
    ],
  },
  {
    label: "Improve",
    items: [
      { key: "fixes", label: "Fix plan", icon: "fixes", badge: "3" },
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
  overview: { eyebrow: "Analysis complete", title: "CV overview", description: "A transparent assessment of your CV against the Senior Product Marketing Manager brief." },
  ats: { eyebrow: "Parsing simulation", title: "ATS check", description: "See what a text parser can extract, what it may miss, and where formatting creates ranking risk." },
  keywords: { eyebrow: "Tailored analysis", title: "Keyword match", description: "Evidence-based matching for the role terms that appear in your target posting." },
  content: { eyebrow: "Writing analysis", title: "Content quality", description: "Bullet-by-bullet checks for ownership, context, outcomes, and proof." },
  recruiter: { eyebrow: "Human scan simulation", title: "Recruiter view", description: "A directional 10-second scan based on hierarchy, relevance, and visual density." },
  risks: { eyebrow: "Due diligence", title: "Red flags", description: "Issues that could create doubt, ambiguity, bias exposure, or a follow-up question." },
  fixes: { eyebrow: "Next best actions", title: "Fix plan", description: "A prioritized, checkable plan ranked by likely score gain—not cosmetic nitpicks." },
  rewrite: { eyebrow: "Controlled editing", title: "Rewrite studio", description: "Improve one line at a time. Suggestions never invent facts, numbers, or credentials." },
  tracker: { eyebrow: "Versions & roles", title: "Job tracker", description: "Keep a master CV, tailored variants, target postings, and score history together." },
  reports: { eyebrow: "Evidence pack", title: "Reports & exports", description: "Download a full audit, plain-text CV, or a before-and-after comparison." },
  methodology: { eyebrow: "Transparent by design", title: "Methodology & sources", description: "What the rules mean, where they come from, and where evidence is still thin." },
};

const keywordRows = [
  { term: "Product marketing", status: "matched", type: "Title + summary", count: "4×", weight: "Required" },
  { term: "Go-to-market (GTM)", status: "matched", type: "Experience", count: "3×", weight: "Required" },
  { term: "Positioning & messaging", status: "matched", type: "Summary + bullets", count: "2×", weight: "Required" },
  { term: "Sales enablement", status: "partial", type: "Skills only", count: "1×", weight: "Required" },
  { term: "Product-led growth", status: "missing", type: "Not found", count: "0×", weight: "Required" },
  { term: "Market research", status: "partial", type: "Adjacent: customer insights", count: "1×", weight: "Preferred" },
  { term: "Amplitude / Mixpanel", status: "missing", type: "Not found", count: "0×", weight: "Preferred" },
  { term: "Executive communication", status: "matched", type: "Experience", count: "2×", weight: "Preferred" },
];

const bullets = [
  { id: 1, role: "Senior Product Marketing Manager · Northstar Cloud", text: "Owned launch strategy for the company’s analytics platform across North America and EMEA.", result: "missing", verb: "strong", score: 58, tag: "So what?" },
  { id: 2, role: "Senior Product Marketing Manager · Northstar Cloud", text: "Led a cross-functional team to launch 4 major features, increasing product adoption by 28% in two quarters.", result: "present", verb: "strong", score: 96, tag: "Strong proof" },
  { id: 3, role: "Senior Product Marketing Manager · Northstar Cloud", text: "Created messaging frameworks and sales enablement materials used by 60+ account executives.", result: "partial", verb: "strong", score: 78, tag: "Add outcome" },
  { id: 4, role: "Product Marketing Manager · Pollen Health", text: "Responsible for developing campaigns, content, and competitive intelligence for a new B2B product.", result: "missing", verb: "weak", score: 42, tag: "Weak opener" },
  { id: 5, role: "Product Marketing Manager · Pollen Health", text: "Partnered with sales and product to improve win rates by 11% and shorten sales cycles by 18 days.", result: "present", verb: "strong", score: 93, tag: "Strong proof" },
  { id: 6, role: "Marketing Manager · Civic Labs", text: "Managed social media and email campaigns for a fast-growing technology company.", result: "missing", verb: "generic", score: 46, tag: "Generic" },
];

const fixItems = [
  { id: 1, severity: "critical", title: "Move contact details out of the header", detail: "Email and phone are inside the PDF header layer. Some parsers skip headers, which creates a missing-contact risk even though the visual file looks complete.", rule: "ATS-04 · Main-body contact info", gain: "+5", evidence: "ATS parse preview" },
  { id: 2, severity: "high", title: "Add proof to the Northstar launch bullet", detail: "“Owned launch strategy…” names a responsibility but not an outcome. Add adoption, pipeline, revenue, reach, or time period if you can verify it.", rule: "IMP-02 · Outcome / evidence", gain: "+4", evidence: "Line 18 · Experience" },
  { id: 3, severity: "high", title: "Use the exact product-led growth term", detail: "The brief lists product-led growth as a required concept. Your CV shows adjacent work but never uses the searchable phrase.", rule: "KEY-01 · Exact required term", gain: "+3", evidence: "Job description · paragraph 2" },
  { id: 4, severity: "medium", title: "Rename “Career story” to “Professional experience”", detail: "A creative heading is understandable to a person but less reliable for section classification. Keep personality in the writing, not the label.", rule: "ATS-07 · Standard headings", gain: "+2", evidence: "Page 1 · heading" },
  { id: 5, severity: "medium", title: "Clarify the Pollen Health transition", detail: "The 4-month overlap between Pollen Health and Northstar Cloud is not necessarily wrong, but a recruiter will ask whether it was contract, consulting, or concurrent employment.", rule: "RISK-03 · Timeline clarity", gain: "+1", evidence: "Dates · 2021–2022" },
];

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

function PageHeader({ page, onNewCheck }: { page: PageKey; onNewCheck: () => void }) {
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
        <button className="button-dark"><Icon name="download" size={15} /> Export report</button>
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

function Overview({ setPage, notify }: { setPage: (page: PageKey) => void; notify: (text: string) => void }) {
  return (
    <>
      <section className="mb-5 grid grid-cols-[1.7fr_1fr] gap-5 max-[1050px]:grid-cols-1">
        <div className="score-hero relative overflow-hidden rounded-[18px] p-7 shadow-[0_14px_32px_rgba(16,35,47,.12)]">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -right-3 -bottom-36 h-80 w-80 rounded-full border border-white/[.07]" />
          <div className="relative flex items-center gap-7 max-[600px]:flex-col max-[600px]:items-start">
            <ScoreRing score={74} />
            <div className="min-w-0 flex-1">
              <Badge tone="green"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Good foundation</Badge>
              <h2 className="mt-4 max-w-[390px] text-[23px] font-semibold leading-[1.15] tracking-[-0.04em] text-white">Credible experience. Make the evidence easier to find.</h2>
              <p className="mt-3 max-w-[470px] text-[12px] leading-5 text-slate-300">Your CV clears the basic parse simulation and shows relevant outcomes. The biggest opportunity is searchable specificity: three required terms and two impact stories need stronger proof.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => setPage("fixes")} className="button-light">View priority fixes <Icon name="arrow" size={14} /></button>
                <button onClick={() => setPage("methodology")} className="button-ghost-light">How this score works <Icon name="info" size={14} /></button>
              </div>
            </div>
          </div>
          <div className="relative mt-7 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 max-[560px]:grid-cols-1">
            <div><div className="text-[10px] uppercase tracking-[.12em] text-slate-400">Potential</div><div className="mt-1 text-[17px] font-semibold text-[#b9efe4]">89 <span className="text-[11px] font-normal text-slate-400">+15 pts</span></div></div>
            <div><div className="text-[10px] uppercase tracking-[.12em] text-slate-400">Confidence</div><div className="mt-1 text-[17px] font-semibold text-white">High <span className="text-[11px] font-normal text-slate-400">0.86</span></div></div>
            <div><div className="text-[10px] uppercase tracking-[.12em] text-slate-400">Rule set</div><div className="mt-1 text-[17px] font-semibold text-white">v2.4 <span className="text-[11px] font-normal text-slate-400">14 Feb 2026</span></div></div>
          </div>
        </div>
        <div className="panel flex flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between"><div><p className="section-kicker">Current file</p><h3 className="mt-2 text-[16px] font-semibold text-[#1c2d3b]">Alex-Morgan-CV.pdf</h3></div><button aria-label="More file options" className="icon-button"><Icon name="dots" size={19} /></button></div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#e9edef] bg-[#fafbfb] p-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#fceee8] text-[#d86b45]"><Icon name="file" size={17} /></div><div className="min-w-0"><div className="truncate text-[12px] font-semibold text-[#334451]">Senior Product Marketing Manager</div><div className="mt-1 text-[10px] text-[#8b969f]">PDF · 2 pages · 412 words · 248 KB</div></div><Badge tone="green">Parsed</Badge></div>
            <div className="mt-5 space-y-3"><div className="flex justify-between text-[11px]"><span className="text-[#788691]">Target role</span><span className="font-semibold text-[#3a4b59]">Sr. Product Marketing Manager</span></div><div className="flex justify-between text-[11px]"><span className="text-[#788691]">Company</span><span className="font-semibold text-[#3a4b59]">Harbor Analytics</span></div><div className="flex justify-between text-[11px]"><span className="text-[#788691]">Region</span><span className="font-semibold text-[#3a4b59]">US · Remote</span></div></div>
          </div>
          <button onClick={() => notify("Version saved to your score history") } className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-[#dfe5e8] py-2.5 text-[11px] font-semibold text-[#52616e] transition hover:bg-[#f5f8f8]"><Icon name="clock" size={14} /> Checked 14 Feb 2026 · View history</button>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-4 gap-4 max-[1050px]:grid-cols-2 max-[580px]:grid-cols-1">
        {[
          { label: "ATS compatibility", score: 82, tone: "teal" as const, icon: "ats" as IconName, note: "Parse risk · Low" },
          { label: "Keyword match", score: 71, tone: "blue" as const, icon: "keywords" as IconName, note: "27 of 34 weighted terms" },
          { label: "Content impact", score: 68, tone: "amber" as const, icon: "content" as IconName, note: "62% bullets show proof" },
          { label: "Recruiter scan", score: 78, tone: "purple" as const, icon: "recruiter" as IconName, note: "Strong first-page hierarchy" },
        ].map((item) => <button key={item.label} onClick={() => setPage(item.label === "ATS compatibility" ? "ats" : item.label === "Keyword match" ? "keywords" : item.label === "Content impact" ? "content" : "recruiter")} className="panel group p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(25,45,58,.07)]"><div className="flex items-center justify-between"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[#f1f5f4] text-[#52736f]"><Icon name={item.icon} size={16} /></div><span className="text-[23px] font-semibold tracking-[-.05em] text-[#20303d]">{item.score}</span></div><div className="mt-4 text-[12px] font-semibold text-[#465663]">{item.label}</div><div className="mt-2 h-1 overflow-hidden rounded-full bg-[#edf0f1]"><div className={`h-full rounded-full ${item.tone === "teal" ? "bg-[#18a991]" : item.tone === "blue" ? "bg-[#5879d7]" : item.tone === "amber" ? "bg-[#e3aa4e]" : "bg-[#8974d1]"}`} style={{ width: `${item.score}%` }} /></div><div className="mt-2 text-[10px] text-[#94a0a9]">{item.note}</div></button>)}
      </section>

      <section className="grid grid-cols-[1.35fr_1fr] gap-5 max-[1050px]:grid-cols-1">
        <div className="panel p-6">
          <div className="mb-5 flex items-start justify-between"><div><p className="section-kicker">Highest return</p><h2 className="panel-title">Your top 3 priority fixes</h2></div><button onClick={() => setPage("fixes")} className="text-[11px] font-semibold text-[#168e7b] hover:underline">See all fixes <Icon name="arrow" size={12} /></button></div>
          <div className="divide-y divide-[#edf0f1]">
            {fixItems.slice(0, 3).map((fix, i) => <button key={fix.id} onClick={() => setPage("fixes")} className="flex w-full items-start gap-3 py-4 text-left first:pt-0 last:pb-0"><span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${i === 0 ? "bg-[#fcece4] text-[#c65e3c]" : "bg-[#fdf4df] text-[#a97424]"}`}>0{i + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#324350]">{fix.title}<span className="text-[11px] font-semibold text-[#15977f]">{fix.gain}</span></div><p className="mt-1 text-[11px] leading-5 text-[#7d8992]">{fix.detail}</p></div><Icon name="arrow" size={14} /></button>)}
          </div>
        </div>
        <div className="panel p-6">
          <div className="mb-5"><p className="section-kicker">Signal check</p><h2 className="panel-title">What’s working / falling short</h2></div>
          <div className="space-y-4">
            <div className="rounded-xl border border-[#dcefe9] bg-[#f3fbf8] p-3.5"><div className="flex items-center gap-2 text-[12px] font-semibold text-[#287d6e]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#d7f2e9]"><Icon name="check" size={12} /></span> Strong evidence</div><p className="mt-2 text-[11px] leading-5 text-[#5f7e78]">Your 28% adoption gain and 11% win-rate lift are specific, credible, and easy to verify.</p></div>
            <div className="rounded-xl border border-[#f5e6c8] bg-[#fffbf2] p-3.5"><div className="flex items-center gap-2 text-[12px] font-semibold text-[#9a722c]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#fff0ca]"><Icon name="alert" size={12} /></span> Needs more signal</div><p className="mt-2 text-[11px] leading-5 text-[#816d4b]">Three bullets name activities without the audience, scale, or result. This weakens the seniority story.</p></div>
            <div className="flex items-start gap-2.5 border-t border-[#edf0f1] pt-4 text-[10px] leading-5 text-[#8d989f]"><Icon name="info" size={14} className="text-[#9da8af]" /> Scores are heuristic estimates, not a real ATS score. They separate parse risk from recruiter ranking risk.</div>
          </div>
        </div>
      </section>
    </>
  );
}

function AtsPage({ setPage, onUpload }: { setPage: (page: PageKey) => void; onUpload: () => void }) {
  const checks = [
    { title: "Text layer is selectable", detail: "412 words extracted from 2 pages", status: "pass", confidence: "99%" },
    { title: "Single reading order", detail: "No interleaved columns detected", status: "pass", confidence: "96%" },
    { title: "Contact details in main body", detail: "Email + phone found in header layer", status: "warn", confidence: "88%" },
    { title: "Standard section headings", detail: "“Career story” may be misclassified", status: "warn", confidence: "91%" },
    { title: "Tables, shapes & graphics", detail: "No tables; 1 decorative line ignored", status: "pass", confidence: "94%" },
    { title: "Date consistency", detail: "2 formats found across 4 roles", status: "warn", confidence: "97%" },
  ];
  return (
    <>
      <section className="mb-5 grid grid-cols-[1.25fr_1fr] gap-5 max-[1000px]:grid-cols-1">
        <div className="ats-hero rounded-[18px] p-6 text-white"><div className="flex items-start justify-between gap-4"><div><Badge tone="green"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Low parse risk</Badge><h2 className="mt-4 text-[24px] font-semibold tracking-[-.045em]">Your file is readable, with 2 fixable traps.</h2><p className="mt-2 max-w-[490px] text-[12px] leading-5 text-slate-300">The text layer is healthy and the reading order is coherent. The header contact details and a creative heading could reduce field extraction confidence.</p></div><ScoreRing score={82} size="small" color="#9de4d7" /></div><div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[11px] text-slate-300"><span><b className="text-white">82/100</b> compatibility</span><span><b className="text-white">0</b> hard fails</span><span><b className="text-white">0.92</b> confidence</span><button onClick={() => setPage("methodology")} className="ml-auto underline decoration-slate-500 underline-offset-4">What this means</button></div></div>
        <div className="panel p-6"><div className="flex items-center justify-between"><div><p className="section-kicker">File check</p><h3 className="panel-title">Alex-Morgan-CV.pdf</h3></div><Badge tone="green">Text-based PDF</Badge></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="soft-stat"><span>Pages</span><b>2</b></div><div className="soft-stat"><span>Words</span><b>412</b></div><div className="soft-stat"><span>Font</span><b>Arial</b></div><div className="soft-stat"><span>Size</span><b>248 KB</b></div></div><button onClick={onUpload} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#ccd7d9] py-2.5 text-[11px] font-semibold text-[#4c606b] hover:bg-[#f6f9f8]"><Icon name="upload" size={14} /> Test another file</button></div>
      </section>
      <section className="mb-5 grid grid-cols-[1fr_1.4fr] gap-5 max-[1100px]:grid-cols-1">
        <div className="panel p-6"><div className="mb-5 flex items-start justify-between"><div><p className="section-kicker">Parser diagnostics</p><h2 className="panel-title">What the parser sees</h2></div><button className="icon-button"><Icon name="filter" size={16} /></button></div><div className="space-y-3">{checks.map((check) => <div key={check.title} className="flex items-start gap-3 rounded-xl border border-[#edf0f1] p-3"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${check.status === "pass" ? "bg-[#dff4ec] text-[#168d77]" : "bg-[#fff0d6] text-[#bd7f24]"}`}><Icon name={check.status === "pass" ? "check" : "alert"} size={12} strokeWidth={2.4} /></span><div className="min-w-0 flex-1"><div className="text-[11px] font-semibold text-[#40515d]">{check.title}</div><div className="mt-1 text-[10px] leading-4 text-[#89949c]">{check.detail}</div></div><span className="text-[10px] font-semibold text-[#a1abb1]">{check.confidence}</span></div>)}</div></div>
        <div className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-[#edf0f1] px-6 py-4"><div><p className="section-kicker">Field extraction preview</p><h2 className="panel-title">Visual file → parsed record</h2></div><div className="flex rounded-lg bg-[#f3f6f6] p-1"><button className="rounded-md bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#3c4c58] shadow-sm">Reading order</button><button className="px-2.5 py-1.5 text-[10px] font-semibold text-[#89949c]">Visual preview</button></div></div><div className="grid grid-cols-2 divide-x divide-[#edf0f1] max-[680px]:grid-cols-1 max-[680px]:divide-x-0"><div className="bg-[#fbfcfc] p-6"><div className="mx-auto max-w-[245px] rounded-sm border border-[#e4e8e9] bg-white p-4 shadow-[0_4px_12px_rgba(20,40,50,.06)]"><div className="border-b border-[#d9e6e4] pb-3"><div className="text-[13px] font-bold text-[#263945]">Alex Morgan</div><div className="mt-1 text-[8px] text-[#168e7b]">PRODUCT MARKETING MANAGER</div><div className="mt-2 text-[7px] text-[#7c8a92]">alex@amorgan.co · +1 415 555 0198 · San Francisco, CA</div></div><div className="mt-4 space-y-3 text-[7px] text-[#687882]"><div><div className="mb-1 font-bold uppercase tracking-[.12em] text-[#263945]">Career story</div><div className="h-1 w-full rounded bg-[#e5ebeb]" /><div className="mt-1 h-1 w-4/5 rounded bg-[#e5ebeb]" /></div><div><div className="mb-1 font-bold uppercase tracking-[.12em] text-[#263945]">Experience</div><div className="h-1 w-full rounded bg-[#e5ebeb]" /><div className="mt-1 h-1 w-full rounded bg-[#e5ebeb]" /><div className="mt-1 h-1 w-3/4 rounded bg-[#e5ebeb]" /></div><div><div className="mb-1 font-bold uppercase tracking-[.12em] text-[#263945]">Skills</div><div className="h-1 w-11/12 rounded bg-[#e5ebeb]" /></div></div></div><div className="mt-3 text-center text-[10px] text-[#9aa6ad]">Visual layout</div></div><div className="p-6"><div className="space-y-3 font-mono text-[10px] leading-5"><div><span className="text-[#9da8ae]">01</span> <span className="font-semibold text-[#1b8e7b]">Alex Morgan</span></div><div><span className="text-[#9da8ae]">02</span> <span className="text-[#40515d]">PRODUCT MARKETING MANAGER</span></div><div className="rounded-md border border-[#f3d5a1] bg-[#fffaf0] px-2 py-1"><span className="text-[#9da8ae]">03</span> <span className="text-[#a36e1d]">[header skipped] contact info</span></div><div><span className="text-[#9da8ae]">04</span> <span className="text-[#40515d]">CAREER STORY</span> <span className="text-[#a36e1d]">? section</span></div><div><span className="text-[#9da8ae]">05</span> <span className="text-[#40515d]">Senior Product Marketing Manager</span></div><div><span className="text-[#9da8ae]">06</span> <span className="text-[#40515d]">Northstar Cloud · 2022 — Present</span></div><div><span className="text-[#9da8ae]">07</span> <span className="text-[#40515d]">Owned launch strategy...</span></div><div><span className="text-[#9da8ae]">08</span> <span className="text-[#40515d]">Led a cross-functional team...</span></div><div><span className="text-[#9da8ae]">09</span> <span className="text-[#40515d]">SKILLS</span></div></div><div className="mt-5 flex items-center gap-2 rounded-lg bg-[#f4f8f7] p-2.5 text-[10px] leading-4 text-[#6e7e84]"><Icon name="info" size={14} className="shrink-0 text-[#1c9c87]" /> Exact reading order varies by parser and export settings.</div></div></div></div>
      </section>
      <section className="panel p-6"><div className="mb-4 flex items-end justify-between"><div><p className="section-kicker">System notes</p><h2 className="panel-title">Platform-specific risk, not a pass/fail promise</h2></div><Badge tone="blue">Simulation only</Badge></div><div className="grid grid-cols-5 gap-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">{[{name:"Workday",risk:"Low",note:"Strong text extraction"},{name:"Greenhouse",risk:"Low",note:"PDF structure supported"},{name:"Lever",risk:"Low",note:"Header is the watch-out"},{name:"Taleo",risk:"Medium",note:"Prefer simpler export"},{name:"iCIMS",risk:"Low",note:"Heading confidence"}].map((item)=><div key={item.name} className="rounded-xl border border-[#edf0f1] p-3"><div className="flex items-center justify-between text-[11px] font-semibold text-[#43535e]"><span>{item.name}</span><span className={item.risk === "Medium" ? "text-[#ae7627]" : "text-[#16977e]"}>{item.risk}</span></div><div className="mt-2 text-[10px] leading-4 text-[#8e9aa1]">{item.note}</div></div>)}</div></section>
    </>
  );
}

function KeywordsPage({ setPage }: { setPage: (page: PageKey) => void }) {
  return (
    <>
      <section className="mb-5 grid grid-cols-[1fr_1.5fr] gap-5 max-[1000px]:grid-cols-1"><div className="keyword-hero rounded-[18px] p-6 text-white"><div className="flex items-start justify-between"><div><Badge tone="green"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Relevant, with gaps</Badge><div className="mt-4 text-[50px] font-semibold leading-none tracking-[-.08em]">71<span className="ml-2 text-[18px] font-normal tracking-normal text-slate-300">/ 100</span></div><p className="mt-3 max-w-[265px] text-[12px] leading-5 text-slate-300">27 of 34 weighted terms are matched, partially matched, or evidenced through a close concept.</p></div><div className="text-right"><div className="text-[10px] uppercase tracking-[.14em] text-slate-400">Role match</div><div className="mt-1 text-[13px] font-semibold">Senior PMM</div></div></div><div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-[10px] text-slate-400"><div><b className="block text-[18px] text-white">18</b>exact matches</div><div><b className="block text-[18px] text-[#f5d18e]">9</b>partial</div><div><b className="block text-[18px] text-[#ffb39b]">7</b>missing</div></div></div><div className="panel p-6"><div className="flex items-start justify-between"><div><p className="section-kicker">Target posting</p><h2 className="panel-title">Senior Product Marketing Manager</h2><p className="mt-1 text-[11px] text-[#8a969e]">Harbor Analytics · Remote, US · posted 12 Feb 2026</p></div><button className="icon-button"><Icon name="external" size={16} /></button></div><div className="mt-5 rounded-xl bg-[#f5f8f8] p-3.5 text-[11px] leading-5 text-[#687780]"><span className="font-semibold text-[#354955]">Posting signal:</span> Own positioning, launches, GTM, sales enablement, product-led growth, market research, and executive communication for a B2B analytics portfolio.</div><div className="mt-4 flex flex-wrap gap-2"><Badge tone="blue">Required · 5</Badge><Badge>Preferred · 4</Badge><Badge tone="green">Title found</Badge></div></div></section>
      <section className="mb-5 grid grid-cols-[1fr_1.15fr] gap-5 max-[1000px]:grid-cols-1"><div className="panel p-6"><div className="mb-5 flex items-center justify-between"><div><p className="section-kicker">Coverage map</p><h2 className="panel-title">Where terms appear</h2></div><button onClick={() => setPage("rewrite")} className="button-secondary">Tailor CV <Icon name="arrow" size={13} /></button></div><div className="space-y-4"><MiniBar label="Professional summary" score={64} tone="teal" note="4 weighted terms · one exact title" /><MiniBar label="Experience bullets" score={78} tone="blue" note="Strongest evidence lives here" /><MiniBar label="Skills section" score={81} tone="purple" note="Helpful list, but not proof" /><MiniBar label="Job title alignment" score={100} tone="teal" note="Exact role family present" /></div><div className="mt-5 flex items-start gap-2 border-t border-[#edf0f1] pt-4 text-[10px] leading-4 text-[#89959d]"><Icon name="info" size={14} className="shrink-0 text-[#8c9aa1]" /> A keyword only earns full credit when it appears with credible context. Repeating a term in Skills alone cannot replace evidence.</div></div><div className="panel p-6"><div className="mb-4 flex items-end justify-between"><div><p className="section-kicker">Keyword balance</p><h2 className="panel-title">Useful coverage, no stuffing detected</h2></div><span className="text-[11px] font-semibold text-[#168e7b]">Healthy</span></div><div className="relative h-[142px] overflow-hidden rounded-xl border border-[#edf0f1] bg-[#fbfcfc] p-4"><div className="absolute bottom-0 left-0 right-0 h-px bg-[#e7ecec]" /><div className="absolute bottom-0 left-0 top-0 w-px bg-[#e7ecec]" /><div className="absolute bottom-8 left-6 h-20 w-20 rounded-full border border-[#b7e3d8] bg-[#e8f8f3]" /><div className="absolute bottom-11 left-20 h-14 w-14 rounded-full border border-[#b6c9f2] bg-[#ecf1ff]" /><div className="absolute bottom-4 left-36 h-24 w-24 rounded-full border border-[#f2d9ab] bg-[#fff8e9]" /><div className="absolute bottom-14 left-[58%] h-10 w-10 rounded-full border border-[#c5bce9] bg-[#f2efff]" /><div className="absolute bottom-[35px] left-[73%] h-3 w-3 rounded-full bg-[#eeaa82]" /><span className="absolute bottom-1 left-2 text-[9px] text-[#9ba5aa]">low repetition</span><span className="absolute bottom-1 right-2 text-[9px] text-[#9ba5aa]">high repetition</span><span className="absolute left-2 top-2 text-[9px] text-[#9ba5aa]">context</span></div><div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-[#7c8991]"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#a7ddcf]" /> credible</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#b9c9ef]" /> repeated in skills</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#efaa82]" /> stuffing risk</span></div></div></section>
      <section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Term-by-term evidence</p><h2 className="panel-title">Matched, partial, missing, and why</h2></div><div className="flex gap-2"><Badge tone="green">Matched 4</Badge><Badge tone="amber">Partial 2</Badge><Badge tone="red">Missing 2</Badge></div></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead><tr className="border-b border-[#edf0f1] text-[10px] uppercase tracking-[.1em] text-[#9aa4aa]"><th className="px-6 py-3 font-semibold">Job term</th><th className="px-4 py-3 font-semibold">Evidence status</th><th className="px-4 py-3 font-semibold">Placement / context</th><th className="px-4 py-3 font-semibold">Count</th><th className="px-6 py-3 font-semibold">Priority</th></tr></thead><tbody>{keywordRows.map((row)=><tr key={row.term} className="border-b border-[#f0f2f2] last:border-0"><td className="px-6 py-3.5 text-[12px] font-semibold text-[#334552]">{row.term}</td><td className="px-4 py-3.5"><Badge tone={row.status === "matched" ? "green" : row.status === "partial" ? "amber" : "red"}>{row.status === "matched" ? "Matched" : row.status === "partial" ? "Partial" : "Missing"}</Badge></td><td className="px-4 py-3.5 text-[11px] text-[#7d8991]">{row.type}</td><td className="px-4 py-3.5 text-[11px] font-semibold text-[#4c5d68]">{row.count}</td><td className="px-6 py-3.5 text-[11px] text-[#7d8991]">{row.weight}</td></tr>)}</tbody></table></div></section>
    </>
  );
}

function ContentPage({ setPage }: { setPage: (page: PageKey) => void }) {
  const [filter, setFilter] = useState("All lines");
  const filtered = filter === "All lines" ? bullets : filter === "Needs proof" ? bullets.filter((b) => b.result !== "present") : bullets.filter((b) => b.verb === "weak" || b.verb === "generic");
  return (
    <>
      <section className="mb-5 grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">{[{value:"62%",label:"quantified bullets",note:"8 of 13",tone:"teal"},{value:"4",label:"weak openers",note:"responsible / managed",tone:"amber"},{value:"3",label:"so what? gaps",note:"activity without outcome",tone:"red"},{value:"B+",label:"summary quality",note:"specific, slightly long",tone:"blue"}].map((item)=><div key={item.label} className="panel p-5"><div className={`text-[27px] font-semibold tracking-[-.06em] ${item.tone === "teal" ? "text-[#15937e]" : item.tone === "amber" ? "text-[#b27a29]" : item.tone === "red" ? "text-[#c65d3e]" : "text-[#5272cc]"}`}>{item.value}</div><div className="mt-2 text-[11px] font-semibold text-[#4a5b66]">{item.label}</div><div className="mt-1 text-[10px] text-[#929da4]">{item.note}</div></div>)}</section>
      <section className="mb-5 grid grid-cols-[1fr_1.2fr] gap-5 max-[1000px]:grid-cols-1"><div className="panel p-6"><div className="mb-5"><p className="section-kicker">Professional summary</p><h2 className="panel-title">Specific, but missing one proof point</h2></div><div className="rounded-xl border border-[#e4ecea] bg-[#f6fbf9] p-4 text-[12px] leading-6 text-[#536c6b]">“Product marketing leader with 8+ years of experience bringing B2B SaaS products to market, shaping positioning, and enabling revenue teams across North America and EMEA.”</div><div className="mt-4 space-y-2 text-[11px] text-[#78858d]"><div className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#18a68f]" /> Role family and years are clear.</div><div className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#18a68f]" /> Geography and audience add useful scope.</div><div className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e4a84e]" /> Add one outcome and “product-led growth” only if it is true.</div></div><button onClick={() => setPage("rewrite")} className="button-secondary mt-5">Open in rewrite studio <Icon name="arrow" size={13} /></button></div><div className="panel p-6"><div className="mb-5 flex items-start justify-between"><div><p className="section-kicker">Skills section</p><h2 className="panel-title">Relevant and current, but too flat</h2></div><Badge tone="amber">Needs grouping</Badge></div><div className="flex flex-wrap gap-2">{["Go-to-market strategy","Positioning","Messaging","Sales enablement","Competitive intelligence","Product launches","Customer research","HubSpot","Marketo","Google Analytics","Figma"].map((skill)=><span key={skill} className="rounded-md border border-[#e5eaeb] bg-[#fafbfb] px-2.5 py-1.5 text-[10px] font-medium text-[#596a75]">{skill}</span>)}</div><div className="mt-5 rounded-xl bg-[#fff9ed] p-3.5 text-[11px] leading-5 text-[#7d6a4a]"><b>So what?</b> “Customer research” appears only in this list. Put it beside a decision, insight, or result in Experience to earn full credit.</div></div></section>
      <section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Bullet-level review</p><h2 className="panel-title">Every line gets an evidence check</h2></div><div className="flex flex-wrap gap-2">{["All lines","Needs proof","Weak opener"].map((option)=><button key={option} onClick={() => setFilter(option)} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${filter === option ? "bg-[#eaf5f2] text-[#168c78]" : "text-[#88949c] hover:bg-[#f5f7f7]"}`}>{option}</button>)}</div></div><div className="divide-y divide-[#edf0f1]">{filtered.map((bullet)=><div key={bullet.id} className="grid grid-cols-[40px_1fr_150px] gap-4 px-6 py-4 max-[760px]:grid-cols-[32px_1fr] max-[760px]:gap-3"><div className="grid h-7 w-7 place-items-center rounded-lg bg-[#f1f4f4] text-[10px] font-bold text-[#7a8890]">{bullet.id}</div><div><div className="mb-1 text-[10px] font-semibold uppercase tracking-[.04em] text-[#99a3a8]">{bullet.role}</div><div className="text-[12px] leading-5 text-[#40515d]">{bullet.text}</div><div className="mt-2 flex flex-wrap gap-1.5"><Badge tone={bullet.result === "present" ? "green" : bullet.result === "partial" ? "amber" : "red"}>{bullet.result === "present" ? "Outcome present" : bullet.result === "partial" ? "Outcome partial" : "Outcome missing"}</Badge><Badge tone={bullet.verb === "strong" ? "blue" : "amber"}>{bullet.verb === "strong" ? "Action-led" : bullet.verb === "weak" ? "Weak opener" : "Generic"}</Badge></div></div><div className="max-[760px]:col-span-2 max-[760px]:ml-11"><div className="flex items-center justify-between text-[10px] text-[#8d999f]"><span>Line score</span><b className={bullet.score >= 80 ? "text-[#168d78]" : "text-[#b27a2a]"}>{bullet.score}</b></div><div className="mt-2 h-1.5 rounded-full bg-[#edf0f1]"><div className={`h-full rounded-full ${bullet.score >= 80 ? "bg-[#1ca88f]" : "bg-[#e0a24b]"}`} style={{ width: `${bullet.score}%` }} /></div><div className="mt-2 text-right text-[10px] font-semibold text-[#8b969d]">{bullet.tag}</div></div></div>)}</div></section>
    </>
  );
}

function RecruiterPage() {
  return (
    <>
      <section className="mb-5 grid grid-cols-[1.2fr_1fr] gap-5 max-[1000px]:grid-cols-1"><div className="recruiter-hero rounded-[18px] p-6 text-white"><div className="flex items-start justify-between"><div><Badge tone="green"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Likely pass</Badge><h2 className="mt-4 text-[25px] font-semibold tracking-[-.05em]">A recruiter can find the story quickly.</h2><p className="mt-2 max-w-[470px] text-[12px] leading-5 text-slate-300">The top third shows your role, current employer, and two relevant outcomes. One missing signal: the strongest launch impact sits below the first scan zone.</p></div><div className="text-right"><div className="text-[47px] font-semibold leading-none tracking-[-.08em]">78</div><div className="mt-1 text-[10px] uppercase tracking-[.15em] text-slate-400">scan score</div></div></div><div className="mt-7 flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] text-slate-400"><Icon name="clock" size={14} /> Directional 10-second skim, not a timed promise <span className="ml-auto text-slate-300">Confidence · medium</span></div></div><div className="panel p-6"><div className="flex items-center justify-between"><div><p className="section-kicker">Length check</p><h2 className="panel-title">2 pages · reasonable</h2></div><Badge tone="green">Fits seniority</Badge></div><div className="mt-5 space-y-3"><div className="flex justify-between text-[11px] text-[#6f7d86]"><span>Experience band</span><b className="text-[#344652]">8 years · mid-senior</b></div><div className="flex justify-between text-[11px] text-[#6f7d86]"><span>Recommended range</span><b className="text-[#344652]">1–2 pages</b></div><div className="flex justify-between text-[11px] text-[#6f7d86]"><span>Density</span><b className="text-[#b27b2c]">Slightly high</b></div></div><div className="mt-5 rounded-xl bg-[#f5f8f8] p-3 text-[10px] leading-4 text-[#839098]">Length is a relevance decision, not a hard rule. Evidence on one vs. two pages is mixed and varies by role, seniority, and region.</div></div></section>
      <section className="mb-5 grid grid-cols-[1.1fr_1fr] gap-5 max-[1000px]:grid-cols-1"><div className="panel p-6"><div className="mb-5"><p className="section-kicker">Attention map</p><h2 className="panel-title">What gets seen first</h2></div><div className="scan-page relative mx-auto max-w-[430px] overflow-hidden rounded-lg border border-[#dfe7e6] bg-white p-5 shadow-[0_5px_15px_rgba(31,55,62,.08)]"><div className="absolute left-0 right-0 top-0 h-[50px] bg-[#dff5ef]/80" /><div className="absolute left-0 right-0 top-[50px] h-[44px] bg-[#eaf2ff]/75" /><div className="absolute left-0 right-0 top-[94px] h-[83px] bg-[#fff5dd]/75" /><div className="relative"><div className="text-[17px] font-bold text-[#243742]">Alex Morgan</div><div className="mt-1 text-[8px] font-semibold tracking-[.1em] text-[#148f79]">PRODUCT MARKETING MANAGER</div><div className="mt-2 text-[8px] text-[#74828b]">alex@amorgan.co · San Francisco, CA · linkedin.com/in/alexmorgan</div><div className="mt-5 text-[9px] font-bold uppercase tracking-[.12em] text-[#283d49]">Professional summary</div><div className="mt-2 space-y-1"><div className="h-1.5 w-full rounded bg-[#dfe6e5]" /><div className="h-1.5 w-11/12 rounded bg-[#dfe6e5]" /><div className="h-1.5 w-4/5 rounded bg-[#dfe6e5]" /></div><div className="mt-5 text-[9px] font-bold uppercase tracking-[.12em] text-[#283d49]">Experience</div><div className="mt-2 flex gap-2"><div className="h-14 w-1 rounded bg-[#e0a344]" /><div className="w-full space-y-1.5"><div className="h-1.5 w-4/5 rounded bg-[#dfe6e5]" /><div className="h-1.5 w-full rounded bg-[#dfe6e5]" /><div className="h-1.5 w-11/12 rounded bg-[#dfe6e5]" /><div className="h-1.5 w-3/4 rounded bg-[#dfe6e5]" /></div></div><div className="mt-4 text-[9px] font-bold uppercase tracking-[.12em] text-[#283d49]">Skills</div><div className="mt-2 h-1.5 w-5/6 rounded bg-[#dfe6e5]" /></div></div><div className="mt-4 flex flex-wrap justify-center gap-3 text-[9px] text-[#7f8c93]"><span><i className="mr-1 inline-block h-2 w-2 rounded bg-[#c1ecdf]" /> immediate</span><span><i className="mr-1 inline-block h-2 w-2 rounded bg-[#c8d8fa]" /> supporting</span><span><i className="mr-1 inline-block h-2 w-2 rounded bg-[#f0cd81]" /> proof zone</span></div></div><div className="panel p-6"><div className="mb-5"><p className="section-kicker">10-second skim</p><h2 className="panel-title">A hiring person’s first questions</h2></div><div className="space-y-4">{[{q:"What do they do now?",a:"Clear — current title and Northstar Cloud are visible above the fold.",tone:"green"},{q:"Have they done this before?",a:"Mostly — launches and GTM are immediately recognizable; PLG is not named.",tone:"amber"},{q:"Did it work?",a:"Yes, twice. Move one quantified result into the summary or first bullet.",tone:"green"},{q:"Would I keep reading?",a:"Likely yes — tidy hierarchy, but the header contact risk is unnecessary.",tone:"green"}].map((item)=><div key={item.q} className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.tone === "green" ? "bg-[#1aa68e]" : "bg-[#e1a64a]"}`} /><div><div className="text-[11px] font-semibold text-[#43545f]">{item.q}</div><div className="mt-1 text-[11px] leading-5 text-[#7e8b93]">{item.a}</div></div></div>)}</div><div className="mt-5 border-t border-[#edf0f1] pt-4 text-[10px] leading-4 text-[#939ea5]">The well-known 6–7 second eye-tracking claim comes from a small, disputed study. We treat it as a directional scan heuristic, not a fact about every recruiter.</div></div></section>
      <section className="panel p-6"><div className="mb-4"><p className="section-kicker">Visual hierarchy</p><h2 className="panel-title">Human readability checks</h2></div><div className="grid grid-cols-4 gap-3 max-[800px]:grid-cols-2 max-[520px]:grid-cols-1">{[{label:"Heading hierarchy",score:"Strong",note:"Clear section anchors"},{label:"Whitespace",score:"Good",note:"No crowded margins"},{label:"Body size",score:"Good",note:"10.5 pt estimated"},{label:"Scan density",score:"Watch",note:"Bullets 3–4 are long"}].map((item)=><div key={item.label} className="rounded-xl border border-[#edf0f1] p-3.5"><div className="text-[11px] font-semibold text-[#43535e]">{item.label}</div><div className={`mt-2 text-[14px] font-semibold ${item.score === "Watch" ? "text-[#b27828]" : "text-[#168f79]"}`}>{item.score}</div><div className="mt-1 text-[10px] text-[#929da4]">{item.note}</div></div>)}</div></section>
    </>
  );
}

function RisksPage({ setPage }: { setPage: (page: PageKey) => void }) {
  const risks = [
    { tone: "critical", title: "Contact info may be skipped", why: "Email and phone appear in the PDF header rather than the main reading flow.", fix: "Move the same text into the first body line below your name.", source: "ATS-04" },
    { tone: "high", title: "Two unquantified senior bullets", why: "“Owned launch strategy” and “created frameworks” describe scope without an outcome or scale.", fix: "Add verified adoption, pipeline, audience, time, or usage evidence.", source: "IMP-02" },
    { tone: "medium", title: "Unexplained four-month overlap", why: "Pollen Health ends Aug 2022 while Northstar Cloud begins Apr 2022.", fix: "Add “contract” or “part-time advisory” if accurate; otherwise verify the dates.", source: "RISK-03" },
    { tone: "medium", title: "Creative heading: Career story", why: "A person understands it, but automated section classification is less certain.", fix: "Use “Professional experience” and keep personality in the summary.", source: "ATS-07" },
    { tone: "low", title: "Email address is professional", why: "No risk detected in the visible email or LinkedIn URL.", fix: "No action needed.", source: "RISK-01" },
    { tone: "low", title: "No protected personal data detected", why: "No photo, age, marital status, nationality, or other bias-inviting data found.", fix: "Keep it that way unless a country-specific convention makes a photo expected.", source: "ETH-02" },
  ];
  const toneMap = { critical: "red", high: "red", medium: "amber", low: "green" } as const;
  return <><section className="mb-5 grid grid-cols-[1.2fr_1fr] gap-5 max-[1000px]:grid-cols-1"><div className="risk-hero rounded-[18px] p-6 text-white"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-[#ffc29e]"><Icon name="alert" size={17} /></span><span className="text-[11px] font-semibold uppercase tracking-[.12em] text-slate-300">Risk review</span></div><h2 className="mt-4 text-[25px] font-semibold tracking-[-.05em]">6 findings, 2 worth fixing today.</h2><p className="mt-2 max-w-[470px] text-[12px] leading-5 text-slate-300">A red flag is a prompt to verify or clarify—not a verdict about your ability or character. We never score identity traits.</p><div className="mt-6 flex gap-6 border-t border-white/10 pt-4"><div><b className="block text-[22px] text-[#ffb59a]">2</b><span className="text-[10px] text-slate-400">high impact</span></div><div><b className="block text-[22px] text-[#f5d38f]">2</b><span className="text-[10px] text-slate-400">clarity checks</span></div><div><b className="block text-[22px] text-[#b7efe3]">2</b><span className="text-[10px] text-slate-400">no action</span></div></div></div><div className="panel p-6"><p className="section-kicker">What we do not score</p><h2 className="panel-title">Identity is not a signal</h2><div className="mt-4 space-y-3 text-[11px] leading-5 text-[#71808a]"><div className="flex gap-2"><Icon name="lock" size={14} className="mt-0.5 shrink-0 text-[#15957e]" /> No penalty for name, age, gender, nationality, photo, or inferred background.</div><div className="flex gap-2"><Icon name="lock" size={14} className="mt-0.5 shrink-0 text-[#15957e]" /> Country setting only changes conventional guidance, never candidate worth.</div><div className="flex gap-2"><Icon name="lock" size={14} className="mt-0.5 shrink-0 text-[#15957e]" /> Claims are flagged for verification, not labelled dishonest.</div></div></div></section><section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Findings</p><h2 className="panel-title">What could create doubt</h2></div><button onClick={() => setPage("fixes")} className="button-secondary">Add to fix plan <Icon name="plus" size={13} /></button></div><div className="divide-y divide-[#edf0f1]">{risks.map((risk)=><div key={risk.title} className="grid grid-cols-[110px_1fr_1fr_70px] gap-5 px-6 py-4 max-[800px]:grid-cols-1 max-[800px]:gap-2"><div><Badge tone={toneMap[risk.tone as keyof typeof toneMap]}>{risk.tone}</Badge></div><div><div className="text-[12px] font-semibold text-[#344652]">{risk.title}</div><p className="mt-1 text-[11px] leading-5 text-[#849097]">{risk.why}</p></div><div><div className="text-[10px] font-semibold uppercase tracking-[.08em] text-[#a0a9ae]">Recommended fix</div><p className="mt-1 text-[11px] leading-5 text-[#667782]">{risk.fix}</p></div><div className="text-[10px] font-mono text-[#9aa5ab]">{risk.source}</div></div>)}</div></section></>;
}

function FixesPage({ notify }: { notify: (text: string) => void }) {
  const [done, setDone] = useState<number[]>([4]);
  const toggle = (id: number) => { setDone((old) => old.includes(id) ? old.filter((item) => item !== id) : [...old, id]); if (!done.includes(id)) notify("Fix marked complete · potential score updated"); };
  const totalGain = fixItems.filter((item) => !done.includes(item.id)).reduce((sum, item) => sum + Number(item.gain.replace("+", "")), 0);
  return <><section className="mb-5 grid grid-cols-[1.4fr_1fr] gap-5 max-[1000px]:grid-cols-1"><div className="panel p-6"><div className="flex items-center justify-between"><div><p className="section-kicker">Completion</p><h2 className="panel-title">Turn 74 into 89</h2></div><div className="text-right"><div className="text-[25px] font-semibold tracking-[-.06em] text-[#168f79]">{done.length}/5</div><div className="text-[10px] text-[#95a0a6]">actions complete</div></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf0f1]"><div className="h-full rounded-full bg-[#18a991] transition-all" style={{ width: `${(done.length / 5) * 100}%` }} /></div><div className="mt-3 flex justify-between text-[10px] text-[#8a969d]"><span>Current score · 74</span><span>Potential after top fixes · 89</span></div></div><div className="fix-quote rounded-[18px] p-6 text-white"><Icon name="spark" size={20} /><h3 className="mt-4 text-[17px] font-semibold">Fix signal, not decoration.</h3><p className="mt-2 text-[11px] leading-5 text-slate-300">The highest gains come from parse reliability, exact terms, and verifiable outcomes—not from changing colors or adding a progress bar.</p></div></section><section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f1] px-6 py-5"><div><p className="section-kicker">Prioritized by score gain</p><h2 className="panel-title">Your action list</h2></div><div className="flex gap-2"><Badge tone="red">{fixItems.filter((f) => f.severity === "critical").length} critical</Badge><Badge tone="amber">{fixItems.filter((f) => f.severity === "high").length} high</Badge></div></div><div className="divide-y divide-[#edf0f1]">{fixItems.map((fix)=><div key={fix.id} className={`flex items-start gap-4 px-6 py-5 transition ${done.includes(fix.id) ? "bg-[#fbfcfc] opacity-60" : ""}`}><button onClick={() => toggle(fix.id)} className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${done.includes(fix.id) ? "border-[#21a78f] bg-[#21a78f] text-white" : "border-[#cbd6d7] text-transparent hover:border-[#21a78f]"}`}><Icon name="check" size={14} strokeWidth={2.5} /></button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`text-[12px] font-semibold ${done.includes(fix.id) ? "text-[#7c8a90] line-through" : "text-[#344652]"}`}>{fix.title}</span><Badge tone={fix.severity === "critical" || fix.severity === "high" ? "red" : "amber"}>{fix.severity}</Badge></div><p className="mt-1.5 max-w-3xl text-[11px] leading-5 text-[#7d8991]">{fix.detail}</p><div className="mt-2 flex flex-wrap gap-3 text-[10px] text-[#9ba5aa]"><span>{fix.rule}</span><span>Evidence · {fix.evidence}</span></div></div><div className="shrink-0 text-right"><div className="text-[16px] font-semibold text-[#168f79]">{fix.gain}</div><div className="mt-1 text-[9px] uppercase tracking-[.08em] text-[#a1aaaf]">est. gain</div></div></div>)}</div><div className="flex items-center justify-between bg-[#f7faf9] px-6 py-4 text-[11px] text-[#72818a]"><span><b className="text-[#2c4a53]">{totalGain} points</b> remain in the current plan</span><button className="button-dark" onClick={() => notify("Plan copied to clipboard")}>Copy action plan <Icon name="arrow" size={13} /></button></div></section></>;
}

function RewritePage({ notify }: { notify: (text: string) => void }) {
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState(bullets[0].text);
  const [saved, setSaved] = useState(false);
  const suggestions = [
    "Led North America and EMEA launch strategy for an analytics platform, translating positioning into a cross-functional GTM plan that [add verified result].",
    "Owned launch strategy for the company’s analytics platform across North America and EMEA, driving [adoption / pipeline / revenue result] over [time period].",
  ];
  const liveScore = Math.min(96, 45 + Math.round((text.length / 140) * 35) + (text.includes("[") ? 0 : 12));
  const choose = (index: number) => { setSelected(index); setText(index === 0 ? bullets[0].text : suggestions[index - 1]); setSaved(false); };
  return <><section className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-[#dbe9e5] bg-[#f2faf7] p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#16947d] shadow-sm"><Icon name="spark" size={18} /></div><div><div className="text-[12px] font-semibold text-[#304d50]">Evidence-safe suggestions</div><div className="mt-1 text-[11px] text-[#718a86]">Placeholders show where your real numbers belong. We never make them up.</div></div></div><Badge tone="green">Live score · {liveScore}/100</Badge></section><section className="grid grid-cols-[1fr_1fr] gap-5 max-[1000px]:grid-cols-1"><div className="panel overflow-hidden"><div className="border-b border-[#edf0f1] px-6 py-5"><p className="section-kicker">Choose a line</p><h2 className="panel-title">Experience bullets</h2></div><div className="divide-y divide-[#edf0f1]">{bullets.slice(0, 4).map((bullet, index)=><button key={bullet.id} onClick={() => { setSelected(index); setText(bullet.text); setSaved(false); }} className={`w-full p-4 text-left transition ${selected === index ? "bg-[#f1faf7]" : "hover:bg-[#fafcfc]"}`}><div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.07em] text-[#9aa4aa]">Line {bullet.id}</span>{selected === index && <span className="text-[10px] font-semibold text-[#16947d]">Editing</span>}</div><p className="mt-1.5 text-[11px] leading-5 text-[#596b75]">{bullet.text}</p></button>)}</div></div><div className="panel p-6"><div className="flex items-start justify-between"><div><p className="section-kicker">Tracked-change style</p><h2 className="panel-title">Make the outcome unavoidable</h2></div><Badge tone={liveScore > 75 ? "green" : "amber"}>{liveScore} / 100</Badge></div><textarea value={text} onChange={(event) => { setText(event.target.value); setSaved(false); }} className="mt-5 min-h-[135px] w-full resize-y rounded-xl border border-[#d9e4e2] bg-[#fbfdfc] p-4 text-[12px] leading-6 text-[#40535c] outline-none transition focus:border-[#51bba8] focus:ring-2 focus:ring-[#d9f1eb]" /><div className="mt-4 rounded-xl border border-[#e9edf0] bg-[#fcfcfb] p-4"><div className="flex items-center gap-2 text-[11px] font-semibold text-[#40545f]"><Icon name="spark" size={14} className="text-[#db9a37]" /> Safe suggestions</div><div className="mt-3 space-y-2">{suggestions.map((suggestion, index)=><button key={suggestion} onClick={() => choose(index + 1)} className="block w-full rounded-lg border border-transparent bg-[#f6f7f6] p-3 text-left text-[11px] leading-5 text-[#6e7d85] transition hover:border-[#c6e6de] hover:bg-[#f2faf7]"><span className="mr-1 font-semibold text-[#17917b]">+ Use:</span>{suggestion}</button>)}</div></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => { setSaved(true); notify("Draft saved as a tailored variant"); }} className="button-dark"><Icon name={saved ? "check" : "lock"} size={14} /> {saved ? "Saved" : "Save variant"}</button><button onClick={() => { setText(bullets[selected]?.text || bullets[0].text); setSaved(false); }} className="button-secondary">Reset line</button></div><div className="mt-4 flex gap-2 text-[10px] leading-4 text-[#99a4aa]"><Icon name="info" size={13} className="mt-0.5 shrink-0" /> Ask yourself: How many people? What changed? Compared with when? Which segment or market?</div></div></section></>;
}

function TrackerPage({ setPage }: { setPage: (page: PageKey) => void }) {
  const [tab, setTab] = useState("CV versions");
  return <><section className="mb-5 grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">{[{value:"3",label:"CV versions",note:"1 master · 2 tailored"},{value:"4",label:"target jobs",note:"2 active · 2 archived"},{value:"74 → 82",label:"best score lift",note:"since Jan 08"}].map((item)=><div key={item.label} className="panel p-5"><div className="text-[26px] font-semibold tracking-[-.06em] text-[#1b8f79]">{item.value}</div><div className="mt-2 text-[11px] font-semibold text-[#465762]">{item.label}</div><div className="mt-1 text-[10px] text-[#909ba2]">{item.note}</div></div>)}</section><section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f1] px-6 py-5"><div className="flex gap-1 rounded-lg bg-[#f3f6f6] p-1">{["CV versions","Target jobs","Score history"].map((item)=><button key={item} onClick={() => setTab(item)} className={`rounded-md px-3 py-1.5 text-[10px] font-semibold ${tab === item ? "bg-white text-[#3d505b] shadow-sm" : "text-[#8c989f]"}`}>{item}</button>)}</div><button className="button-dark"><Icon name="plus" size={14} /> Add {tab === "Target jobs" ? "job" : "version"}</button></div>{tab === "CV versions" && <div className="divide-y divide-[#edf0f1]">{[{name:"Alex Morgan · Master CV",meta:"Updated 14 Feb 2026 · 2 pages",score:"74",tag:"Master"},{name:"Alex Morgan · Harbor Analytics",meta:"Tailored 14 Feb 2026 · 2 pages",score:"82",tag:"Active variant"},{name:"Alex Morgan · VP Marketing",meta:"Updated 08 Jan 2026 · 2 pages",score:"69",tag:"Archived"}].map((item)=><div key={item.name} className="flex items-center gap-4 px-6 py-4"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f2f6f5] text-[#5a7470]"><Icon name="file" size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#3b4d59]">{item.name}<Badge tone={item.tag === "Active variant" ? "green" : "neutral"}>{item.tag}</Badge></div><div className="mt-1 text-[10px] text-[#929da3]">{item.meta}</div></div><div className="text-right"><div className="text-[18px] font-semibold text-[#168f79]">{item.score}</div><div className="text-[9px] text-[#9ca6ac]">score</div></div><button className="icon-button"><Icon name="dots" size={18} /></button></div>)}</div>}{tab === "Target jobs" && <div className="divide-y divide-[#edf0f1]">{[{name:"Senior Product Marketing Manager",company:"Harbor Analytics",score:"82",status:"Active · due 18 Feb"},{name:"Director, Product Marketing",company:"Atlas Systems",score:"71",status:"Active · due 26 Feb"},{name:"Product Marketing Lead",company:"Owl Labs",score:"68",status:"Archived · 02 Feb"}].map((item)=><div key={item.name} className="flex items-center gap-4 px-6 py-4"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#edf2ff] text-[#5b73c6]"><Icon name="tracker" size={16} /></div><div className="min-w-0 flex-1"><div className="text-[12px] font-semibold text-[#3b4d59]">{item.name}</div><div className="mt-1 text-[10px] text-[#929da3]">{item.company} · {item.status}</div></div><div className="text-right"><div className="text-[18px] font-semibold text-[#168f79]">{item.score}</div><div className="text-[9px] text-[#9ca6ac]">match</div></div><button onClick={() => setPage("keywords")} className="button-secondary">Open</button></div>)}</div>}{tab === "Score history" && <div className="p-6"><div className="flex h-[210px] items-end gap-3 border-b border-l border-[#dfe7e7] px-6 pb-0 pt-4">{[{date:"Jan 08",score:61},{date:"Jan 21",score:67},{date:"Feb 02",score:71},{date:"Feb 09",score:72},{date:"Feb 14",score:74}].map((item)=><div key={item.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="text-[10px] font-semibold text-[#168f79]">{item.score}</div><div className="w-full max-w-[46px] rounded-t-md bg-[#92d9c9]" style={{ height: `${item.score * 1.9}px` }} /><span className="mb-[-22px] text-[9px] text-[#99a4aa]">{item.date}</span></div>)}</div><div className="mt-9 text-[11px] text-[#7c8991]">The score rose <b className="text-[#168f79]">+13 points</b> after standardizing headings and adding two quantified outcomes.</div></div>}</section></>;
}

function ReportsPage({ notify }: { notify: (text: string) => void }) {
  const downloadText = () => { const content = "CV SIGNAL · FULL AUDIT\n\nAlex Morgan · Senior Product Marketing Manager\nCurrent score: 74/100 · Potential: 89/100\n\nTop fixes:\n1. Move contact info out of PDF header (+5)\n2. Add proof to Northstar launch bullet (+4)\n3. Add product-led growth where true (+3)\n\nThis report is a heuristic simulation, not a real ATS score."; const url = URL.createObjectURL(new Blob([content], { type: "text/plain" })); const link = document.createElement("a"); link.href = url; link.download = "cv-signal-audit.txt"; link.click(); URL.revokeObjectURL(url); notify("Plain-text audit downloaded"); };
  return <><section className="mb-5 grid grid-cols-[1.3fr_1fr] gap-5 max-[950px]:grid-cols-1"><div className="report-hero rounded-[18px] p-6 text-white"><Badge tone="green">Ready to share</Badge><h2 className="mt-4 text-[25px] font-semibold tracking-[-.05em]">Your evidence pack is ready.</h2><p className="mt-2 max-w-[450px] text-[12px] leading-5 text-slate-300">Export a complete audit with score evidence, ATS observations, line annotations, recruiter view, and a before/after score history.</p><div className="mt-6 flex flex-wrap gap-2"><button onClick={downloadText} className="button-light"><Icon name="download" size={14} /> Download audit</button><button onClick={() => notify("Share link copied") } className="button-ghost-light"><Icon name="external" size={14} /> Copy share link</button></div></div><div className="panel p-6"><p className="section-kicker">Privacy status</p><h2 className="panel-title">Private workspace</h2><div className="mt-4 flex items-center gap-2 text-[11px] text-[#667781]"><Icon name="lock" size={15} className="text-[#168f79]" /> Your CV is not used for training or shared without consent.</div><button className="mt-5 text-[11px] font-semibold text-[#c26143] hover:underline">Delete all CV data</button></div></section><section className="mb-5 grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">{[{icon:"file" as IconName,title:"Full audit report",detail:"PDF-ready · 14 sections",action:"Download PDF"},{icon:"edit" as IconName,title:"ATS-safe CV export",detail:"Single column · clean text",action:"Export DOCX"},{icon:"keywords" as IconName,title:"Plain-text version",detail:"For application forms",action:"Copy text"}].map((item)=><div key={item.title} className="panel p-5"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f2f7f6] text-[#168f79]"><Icon name={item.icon} size={16} /></div><div><div className="text-[12px] font-semibold text-[#40515d]">{item.title}</div><div className="mt-1 text-[10px] text-[#929da3]">{item.detail}</div></div></div><button onClick={() => notify(`${item.action} is ready in the export queue`)} className="mt-5 w-full rounded-lg border border-[#dfe7e6] py-2 text-[10px] font-semibold text-[#5d6d77] hover:bg-[#f5f9f8]">{item.action} <Icon name="arrow" size={12} /></button></div>)}</section><section className="panel overflow-hidden"><div className="border-b border-[#edf0f1] px-6 py-5"><p className="section-kicker">Before & after</p><h2 className="panel-title">Score history with causes, not just numbers</h2></div><div className="grid grid-cols-2 divide-x divide-[#edf0f1] max-[700px]:grid-cols-1 max-[700px]:divide-x-0"><div className="p-6"><div className="text-[10px] uppercase tracking-[.12em] text-[#9aa4aa]">Jan 08 · v1.0</div><div className="mt-2 text-[32px] font-semibold tracking-[-.08em] text-[#aab4b8]">61</div><div className="mt-3 space-y-2 text-[11px] text-[#7d8991]"><div>Two-column layout</div><div>Generic opening summary</div><div>No quantified outcomes</div></div></div><div className="bg-[#f4faf8] p-6"><div className="flex items-center justify-between"><div className="text-[10px] uppercase tracking-[.12em] text-[#15947d]">Feb 14 · v2.4</div><Badge tone="green">+13 points</Badge></div><div className="mt-2 text-[32px] font-semibold tracking-[-.08em] text-[#168f79]">74</div><div className="mt-3 space-y-2 text-[11px] text-[#6e7f81]"><div>Single reading order</div><div>Exact role title added</div><div>Two evidence-backed results added</div></div></div></div></section></>;
}

function MethodologyPage() {
  const [open, setOpen] = useState<string | null>("ats");
  const sections = [
    { id: "ats", title: "ATS compatibility", label: "Evidence-backed + conventional", text: "We test whether a text layer exists, whether the reading order is coherent, whether contact details are in the main body, and whether standard section labels can be detected. We describe this as parse and ranking risk—not an automatic rejection prediction. The widely repeated 75% auto-rejection claim has no credible published methodology.", source: "Huntr analysis of 1.7M applications; Greenhouse supported file guidance; platform and career-center conventions." },
    { id: "keywords", title: "Keyword match", label: "Simulation", text: "Required and preferred terms are extracted from the posting and compared using exact terms, acronym/long-form pairs, safe synonyms, and context. Searchability can help a recruiter find a candidate, but there is no universal ATS score and keyword density is not a hiring decision.", source: "Recruiter sourcing practice; ATS product behavior; role-specific posting evidence." },
    { id: "scan", title: "Recruiter scan", label: "Directional heuristic", text: "We model whether the title, current employer, dates, and strongest evidence are visible in the top third. The famous 6–7 second figure comes from a small, disputed eye-tracking study, so we do not present it as a universal fact or set a timer.", source: "The Ladders eye-tracking study (2018) and later recruiter research; evidence is mixed." },
    { id: "length", title: "Length & density", label: "Context-dependent", text: "We compare length to experience band, target seniority, region, and evidence density. We do not enforce one page. Research and recruiter preferences conflict; a focused two-page document can be stronger than a cramped one-page document for experienced candidates.", source: "ResumeGo recruiter simulation; career-stage and country conventions; evidence remains mixed." },
    { id: "content", title: "Impact & credibility", label: "Rule-based heuristic", text: "Each bullet is checked for action, context, scope, and outcome. We ask “so what?”, distinguish personal ownership from team activity, flag vague openers and clichés, and ask for missing numbers. Suggestions are placeholders until the user verifies the facts.", source: "Structured resume-writing conventions; transparent rule definitions; not a predictive hiring model." },
    { id: "ethics", title: "Bias & privacy", label: "Safeguard", text: "We do not score a name, age, gender, nationality, photo, or inferred background. Personal data is a privacy concern, not a quality signal. Region changes advice about convention (for example, photos) but never creates a candidate penalty. Delete controls, consent, and rule versioning make the analysis auditable.", source: "Fair hiring principles; GDPR-oriented product safeguards." },
  ];
  return <><section className="mb-5 rounded-[18px] border border-[#dfe9e6] bg-[#f5fbf9] p-6"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#168f79] shadow-sm"><Icon name="methodology" size={19} /></div><div><h2 className="text-[18px] font-semibold tracking-[-.03em] text-[#27444b]">No black box. No fake ATS pass.</h2><p className="mt-2 max-w-3xl text-[12px] leading-6 text-[#6e8581]">CV Signal gives you a transparent heuristic estimate from observable evidence. It cannot know a company’s private filters, recruiter workload, or what a hiring manager values. Every deduction links to a rule, evidence, and confidence level.</p></div></div></section><section className="panel overflow-hidden"><div className="border-b border-[#edf0f1] px-6 py-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Rulebook v2.4</p><h2 className="panel-title">How the score is built</h2></div><Badge tone="blue">Updated 14 Feb 2026</Badge></div></div><div className="divide-y divide-[#edf0f1]">{sections.map((section)=><div key={section.id} className="px-6"><button onClick={() => setOpen(open === section.id ? null : section.id)} className="flex w-full items-center gap-3 py-4 text-left"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#f1f5f4] text-[#6c807f]"><Icon name={open === section.id ? "chevron" : "arrow"} size={13} /></span><span className="flex-1 text-[12px] font-semibold text-[#40525d]">{section.title}</span><Badge tone={section.label === "Safeguard" ? "green" : section.label === "Simulation" ? "blue" : "neutral"}>{section.label}</Badge></button>{open === section.id && <div className="ml-9 max-w-3xl pb-5"><p className="text-[12px] leading-6 text-[#697b84]">{section.text}</p><div className="mt-3 border-l-2 border-[#bde5db] pl-3 text-[10px] leading-5 text-[#95a0a5]">Source note · {section.source}</div></div>}</div>)}</div></section><section className="mt-5 grid grid-cols-3 gap-4 max-[800px]:grid-cols-1">{[{number:"35%",label:"ATS compatibility",detail:"Parsing, structure, field extraction"},{number:"25%",label:"Keyword match",detail:"Required terms with context"},{number:"20%",label:"Content impact",detail:"Outcomes, ownership, proof"},{number:"10%",label:"Recruiter scan",detail:"Hierarchy, density, relevance"},{number:"5%",label:"Credibility & risk",detail:"Consistency, gaps, claims"},{number:"5%",label:"Formatting",detail:"Readability, dates, typography"}].map((item)=><div key={item.label} className="panel p-4"><div className="text-[20px] font-semibold tracking-[-.05em] text-[#168f79]">{item.number}</div><div className="mt-2 text-[11px] font-semibold text-[#445660]">{item.label}</div><div className="mt-1 text-[10px] leading-4 text-[#929da4]">{item.detail}</div></div>)}</section><div className="mt-5 flex items-center gap-2 text-[10px] leading-5 text-[#99a4a9]"><Icon name="info" size={14} className="shrink-0" /> Benchmarks are directional and data is thinner for some industries, countries, and seniority levels. Rule changes are versioned so score history remains explainable.</div></>;
}

function NewCheckModal({ onClose, onFile, uploadStatus, onStart }: { onClose: () => void; onFile: (event: ChangeEvent<HTMLInputElement>) => void; uploadStatus: string; onStart: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal-card"><div className="flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#168f79]"><Icon name="spark" size={13} /> New CV check</div><h2 className="text-[24px] font-semibold tracking-[-.05em] text-[#1c2c39]">Bring a CV. Get evidence.</h2><p className="mt-2 max-w-md text-[12px] leading-5 text-[#788790]">Upload a text-based file or paste the content. Add a job description for tailored scoring.</p></div><button onClick={onClose} className="icon-button"><Icon name="close" size={18} /></button></div><label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#b9d5d0] bg-[#f5fbf9] px-5 py-8 text-center transition hover:bg-[#edf8f4]"><input type="file" accept=".pdf,.docx,.txt" onChange={onFile} className="hidden" /><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#168f79] shadow-sm"><Icon name="upload" size={19} /></span><span className="mt-3 text-[12px] font-semibold text-[#40555d]">Drop PDF, DOCX, or TXT here</span><span className="mt-1 text-[10px] text-[#8c999e]">We reject scans, .pages, and .odt with an explanation</span></label>{uploadStatus && <div className={`mt-3 rounded-lg p-3 text-[11px] ${uploadStatus.startsWith("Unsupported") ? "bg-[#fff2ed] text-[#bd6548]" : "bg-[#eef9f5] text-[#34806f]"}`}>{uploadStatus}</div>}<label className="mt-4 block"><span className="field-label">Paste CV text <span className="font-normal text-[#a3adb2]">(optional if uploading)</span></span><textarea className="field min-h-[76px] resize-none" placeholder="Paste the selectable text from your CV here..." /></label><div className="mt-4 grid grid-cols-2 gap-3"><label><span className="field-label">Target role</span><select className="field"><option>Senior Product Marketing Manager</option><option>Product Marketing Manager</option><option>Marketing Director</option></select></label><label><span className="field-label">Seniority</span><select className="field"><option>Mid-senior</option><option>Entry level</option><option>Manager</option><option>Executive</option></select></label><label><span className="field-label">Industry</span><select className="field"><option>SaaS / Technology</option><option>Healthcare</option><option>Financial services</option><option>Consumer</option><option>Other</option></select></label><label><span className="field-label">Country / region</span><select className="field"><option>United States</option><option>United Kingdom</option><option>European Union</option><option>Canada</option><option>Australia</option></select></label></div><label className="mt-4 block"><span className="field-label">Paste target job description <span className="font-normal text-[#a3adb2]">(optional)</span></span><textarea className="field min-h-[75px] resize-none" placeholder="Add the posting to unlock keyword and requirement matching..." defaultValue="Own positioning, launches, GTM, sales enablement, product-led growth, market research, and executive communication for a B2B analytics portfolio." /></label><div className="mt-6 flex items-center justify-between gap-3"><span className="flex items-center gap-1.5 text-[10px] text-[#929da3]"><Icon name="lock" size={13} /> Private by default</span><button onClick={onStart} className="button-dark">Run analysis <Icon name="arrow" size={14} /></button></div></div></div>;
}

export default function HomePage() {
  const [activePage, setActivePage] = useState<PageKey>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 2600); };
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".pdf") && !lower.endsWith(".docx") && !lower.endsWith(".txt")) { setUploadStatus("Unsupported format. Please use PDF, DOCX, or TXT. Scanned PDFs, .pages, and .odt cannot be reliably parsed."); return; }
    if (file.size === 0) { setUploadStatus("This file is empty or unreadable. Try exporting the original document again."); return; }
    setUploadStatus(`${file.name} is ready. The text layer will be tested before scoring.`);
  };
  const renderPage = useMemo(() => {
    if (activePage === "overview") return <Overview setPage={setActivePage} notify={notify} />;
    if (activePage === "ats") return <AtsPage setPage={setActivePage} onUpload={() => setModalOpen(true)} />;
    if (activePage === "keywords") return <KeywordsPage setPage={setActivePage} />;
    if (activePage === "content") return <ContentPage setPage={setActivePage} />;
    if (activePage === "recruiter") return <RecruiterPage />;
    if (activePage === "risks") return <RisksPage setPage={setActivePage} />;
    if (activePage === "fixes") return <FixesPage notify={notify} />;
    if (activePage === "rewrite") return <RewritePage notify={notify} />;
    if (activePage === "tracker") return <TrackerPage setPage={setActivePage} />;
    if (activePage === "reports") return <ReportsPage notify={notify} />;
    return <MethodologyPage />;
  }, [activePage]);
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark"><span /> <span /> <span /></div><span className="brand-name">cv<span>/</span>signal</span><span className="brand-beta">BETA</span></div><div className="workspace-switcher"><div className="workspace-avatar">AM</div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold text-[#334550]">Alex Morgan</div><div className="mt-0.5 text-[9px] text-[#97a2a8]">Personal workspace</div></div><Icon name="chevron" size={14} /></div><nav className="sidebar-nav">{navGroups.map((group)=><div key={group.label} className="nav-group"><div className="nav-label">{group.label}</div>{group.items.map((item)=><button key={item.key} onClick={() => setActivePage(item.key)} className={`nav-item ${activePage === item.key ? "active" : ""}`}><Icon name={item.icon} size={16} /><span>{item.label}</span>{item.badge && <span className={`nav-badge ${activePage === item.key ? "selected" : ""}`}>{item.badge}</span>}</button>)}</div>)}</nav><div className="sidebar-bottom"><div className="privacy-note"><Icon name="lock" size={14} /><div><div className="text-[10px] font-semibold text-[#53636e]">Private workspace</div><div className="mt-1 text-[9px] leading-4 text-[#9aa5aa]">Your data is not used for training.</div></div></div><button onClick={() => notify("Settings are coming with account sync") } className="nav-item"><Icon name="settings" size={16} /><span>Settings & privacy</span></button><div className="user-row"><div className="user-avatar">AM</div><div className="min-w-0 flex-1"><div className="truncate text-[10px] font-semibold text-[#465862]">Alex Morgan</div><div className="truncate text-[9px] text-[#9aa5aa]">alex@amorgan.co</div></div><Icon name="dots" size={15} /></div></div></aside><main className="main-content"><div className="topbar"><div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={13} /><b>{pageMeta[activePage].title}</b></div><div className="topbar-actions"><label className="search-box"><Icon name="search" size={15} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search your CV" />{globalSearch && <button onClick={() => setGlobalSearch("")}><Icon name="close" size={12} /></button>}<span className="shortcut">⌘ K</span></label><button className="top-icon"><Icon name="bell" size={17} /><i /></button><div className="top-avatar">AM</div></div></div><div className="content-wrap"><PageHeader page={activePage} onNewCheck={() => setModalOpen(true)} />{renderPage}</div></main>{toast && <div className="toast"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#d8f5eb] text-[#168d77]"><Icon name="check" size={12} /></span>{toast}</div>}{modalOpen && <NewCheckModal onClose={() => setModalOpen(false)} onFile={handleUpload} uploadStatus={uploadStatus} onStart={() => { setModalOpen(false); setActivePage("overview"); notify("Analysis complete · score updated"); }} />}</div>;
}
