// A rule-based CV analysis engine. Every signal below is derived from the
// actual CV text (and, when supplied, job description) passed in — nothing
// here is per-role or fabricated. It is intentionally deterministic (no
// external API calls), which keeps it free and instant but caps it at
// pattern-matching rather than real judgment.

export interface AnalyzeSections {
  ats: number;
  keywords: number;
  content: number;
  scan: number;
  consistency: number;
}

export interface AnalyzeChecks {
  hasContact: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
}

export interface BulletAnalysis {
  id: number;
  text: string;
  hasNumber: boolean;
  weakOpener: boolean;
  strongOpener: boolean;
  passiveVoice: boolean;
  firstPerson: boolean;
  cliches: string[];
  score: number;
}

export interface DateIssue {
  kind: "gap" | "overlap";
  detail: string;
}

export interface Fix {
  id: number;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
  gain: string;
}

export interface Risk {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  why: string;
}

export interface AnalyzeResult {
  score: number;
  confidence: string;
  sections: AnalyzeSections;
  checks: AnalyzeChecks;
  headings: { detected: string[]; nonStandard: string[] };
  dateIssues: DateIssue[];
  bullets: BulletAnalysis[];
  cliches: string[];
  repeatedWords: { word: string; count: number }[];
  personalDataFlags: string[];
  matchedTerms: string[];
  missingTerms: string[];
  wordCount: number;
  fixes: Fix[];
  risks: Risk[];
  disclaimer: string;
  ruleVersion: string;
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "have", "will", "are",
  "was", "were", "you", "your", "our", "their", "into", "about", "over",
  "under", "such", "who", "what", "when", "where", "how", "why", "not", "but",
  "than", "then", "also", "can", "may", "must", "should", "would", "could",
  "ability", "years", "year", "role", "team", "teams", "work", "working",
  "strong", "experience", "responsibilities", "requirements", "job",
  "description", "looking", "seeking", "ideal", "candidate", "plus",
  "preferred", "required", "skills", "skill", "including", "across", "within",
  "this", "that", "these", "those", "have", "been", "were", "will", "each",
]);

const WEAK_OPENERS = ["responsible for", "worked on", "helped", "assisted", "involved in", "duties included", "tasked with", "in charge of", "participated in", "supported", "contributed to"];

const STRONG_VERBS = ["led", "managed", "built", "developed", "designed", "launched", "delivered", "drove", "increased", "reduced", "improved", "created", "implemented", "negotiated", "spearheaded", "directed", "established", "generated", "achieved", "optimized", "streamlined", "executed", "coordinated", "analyzed", "automated", "architected", "founded", "scaled", "transformed", "owned", "shipped", "grew", "cut", "saved", "won"];

const CLICHES = ["team player", "hard worker", "detail-oriented", "results-driven", "results driven", "go-getter", "think outside the box", "synergy", "self-starter", "excellent communication skills", "proven track record", "hardworking", "passionate about", "fast learner", "people person", "dynamic professional", "wear many hats"];

const HEADING_SYNONYMS: Record<string, string[]> = {
  summary: ["summary", "professional summary", "profile", "objective", "about me", "career summary", "career profile", "summary of qualifications"],
  experience: ["experience", "work experience", "employment", "employment history", "work history", "professional experience", "career history"],
  education: ["education", "academic background", "qualifications", "education & training"],
  skills: ["skills", "technical skills", "core competencies", "key skills", "areas of expertise", "core skills"],
};
const OTHER_KNOWN_HEADINGS = ["certifications", "certification", "projects", "awards", "achievements", "languages", "references", "publications", "volunteer", "volunteering", "interests", "hobbies", "contact", "contact information", "personal details"];

function includesTerm(text: string, term: string) {
  return text.toLocaleLowerCase().includes(term.toLocaleLowerCase());
}

function extractKeyTerms(text: string, max = 12): string[] {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
  const words = cleaned.split(/\s+/).filter((word) => word.length >= 4 && !STOPWORDS.has(word));

  const unigramFreq = new Map<string, number>();
  for (const word of words) unigramFreq.set(word, (unigramFreq.get(word) ?? 0) + 1);

  const bigramFreq = new Map<string, number>();
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    bigramFreq.set(bigram, (bigramFreq.get(bigram) ?? 0) + 1);
  }

  const topUnigrams = [...unigramFreq.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, max - 4).map(([term]) => term);
  const topBigrams = [...bigramFreq.entries()].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4).map(([term]) => term);

  return [...topBigrams, ...topUnigrams].slice(0, max);
}

function isHeadingLike(line: string): boolean {
  const trimmed = line.trim().replace(/:$/, "");
  if (trimmed.length < 3 || trimmed.length > 40) return false;
  if (/[.,;]$/.test(trimmed)) return false;
  if (/\d/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/);
  if (words.length > 5) return false;
  const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
  const isTitleCase = words.every((word) => /^[A-Z]/.test(word));
  return isAllCaps || isTitleCase;
}

function analyzeHeadings(lines: string[]): { detected: string[]; nonStandard: string[]; hasSummary: boolean; hasSkills: boolean } {
  const allSynonyms = new Set([...Object.values(HEADING_SYNONYMS).flat(), ...OTHER_KNOWN_HEADINGS]);
  const detected: string[] = [];
  const nonStandard: string[] = [];
  let hasSummary = false;
  let hasSkills = false;

  for (const line of lines) {
    if (!isHeadingLike(line)) continue;
    const normalized = line.trim().replace(/:$/, "").toLowerCase();
    detected.push(line.trim());
    if (HEADING_SYNONYMS.summary.includes(normalized)) hasSummary = true;
    if (HEADING_SYNONYMS.skills.includes(normalized)) hasSkills = true;
    if (!allSynonyms.has(normalized)) nonStandard.push(line.trim());
  }
  return { detected, nonStandard, hasSummary, hasSkills };
}

function analyzeDates(cvText: string): DateIssue[] {
  const currentYear = new Date().getFullYear();
  const pattern = /\b(19|20)\d{2}\b\s*(?:[-–—]|to)\s*(present|current|(?:19|20)\d{2})\b/gi;
  const ranges: { start: number; end: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(cvText))) {
    const startYear = Number(match[0].match(/\b(19|20)\d{2}\b/)?.[0]);
    const endRaw = match[2].toLowerCase();
    const endYear = endRaw === "present" || endRaw === "current" ? currentYear : Number(endRaw);
    if (startYear && endYear && startYear <= endYear) ranges.push({ start: startYear, end: endYear });
  }
  ranges.sort((a, b) => a.start - b.start);

  const issues: DateIssue[] = [];
  for (let i = 1; i < ranges.length; i++) {
    const prev = ranges[i - 1];
    const curr = ranges[i];
    const gapYears = curr.start - prev.end;
    if (gapYears >= 2) {
      issues.push({ kind: "gap", detail: `About a ${gapYears}-year gap between roles ending ${prev.end} and starting ${curr.start}.` });
    } else if (curr.start < prev.end - 0) {
      // overlap: next role starts before the previous one's listed end year
      if (curr.start <= prev.end - 1) {
        issues.push({ kind: "overlap", detail: `Overlapping dates: a role ending ${prev.end} and one starting ${curr.start}.` });
      }
    }
  }
  return issues;
}

function analyzeBullets(cvText: string): BulletAnalysis[] {
  return cvText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 15)
    .map((text, index) => {
      const lower = text.toLowerCase();
      const hasNumber = /\d/.test(text);
      const weakOpener = WEAK_OPENERS.some((opener) => lower.startsWith(opener));
      const firstWord = lower.replace(/^[^a-z]+/, "").split(/\s+/)[0] ?? "";
      const strongOpener = STRONG_VERBS.includes(firstWord);
      const passiveVoice = /\b(was|were|is|are|been|being)\s+\w+ed\b/i.test(text);
      const firstPerson = /\b(i|my|me)\b/i.test(text);
      const cliches = CLICHES.filter((phrase) => lower.includes(phrase));
      let score = 50;
      score += hasNumber ? 25 : -10;
      score += strongOpener ? 15 : weakOpener ? -15 : 0;
      score -= passiveVoice ? 5 : 0;
      score -= cliches.length * 5;
      score -= firstPerson ? 5 : 0;
      return { id: index + 1, text, hasNumber, weakOpener, strongOpener, passiveVoice, firstPerson, cliches, score: Math.max(15, Math.min(98, Math.round(score))) };
    });
}

function analyzeRepeatedWords(cvText: string): { word: string; count: number }[] {
  const words = cvText.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length >= 5 && !STOPWORDS.has(word));
  const freq = new Map<string, number>();
  for (const word of words) freq.set(word, (freq.get(word) ?? 0) + 1);
  return [...freq.entries()].filter(([, count]) => count >= 5).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([word, count]) => ({ word, count }));
}

function analyzePersonalData(cvText: string): string[] {
  const flags: string[] = [];
  if (/date of birth|\bdob\b/i.test(cvText)) flags.push("date of birth");
  if (/marital status/i.test(cvText)) flags.push("marital status");
  if (/nationality\s*:/i.test(cvText)) flags.push("nationality");
  if (/\bage\s*:?\s*\d{2}\b/i.test(cvText)) flags.push("age");
  return flags;
}

function buildFixes(input: {
  checks: AnalyzeChecks;
  headings: { nonStandard: string[] };
  dateIssues: DateIssue[];
  bullets: BulletAnalysis[];
  cliches: string[];
  repeatedWords: { word: string; count: number }[];
  matchedTerms: string[];
  missingTerms: string[];
  wordCount: number;
}): Fix[] {
  const { checks, headings, dateIssues, bullets, cliches, repeatedWords, missingTerms, wordCount } = input;
  const fixes: Fix[] = [];
  let id = 1;
  const push = (severity: Fix["severity"], title: string, detail: string, gain: number) => fixes.push({ id: id++, severity, title, detail, gain: `+${gain}` });

  if (!checks.hasContact) push("critical", "Make your contact details easy to find", "We couldn't find an email and phone number together in the CV text. Put both in the main body, not just a header a parser might skip.", 5);
  if (!checks.hasExperience) push("high", "Add a clearly labeled experience section", "Use a standard heading like \"Experience\" or \"Employment history\".", 4);
  if (!checks.hasEducation) push("medium", "Add an education section", "Include a heading like \"Education\" with your degree, institution, and dates.", 2);
  if (!checks.hasSkills) push("medium", "Add a skills section", "A short, scannable list of relevant skills helps both parsers and readers.", 2);
  if (!checks.hasSummary) push("low", "Add a short professional summary", "Two or three lines at the top stating your role, experience, and focus help a reader orient quickly.", 2);
  if (headings.nonStandard.length) push("medium", `Rename non-standard heading${headings.nonStandard.length === 1 ? "" : "s"}: ${headings.nonStandard.slice(0, 3).join(", ")}`, "Creative section titles are understandable to a person but less reliable for automated classification. Use conventional names.", 2);
  const gaps = dateIssues.filter((d) => d.kind === "gap");
  if (gaps.length) push("medium", `Clarify ${gaps.length} possible employment gap${gaps.length === 1 ? "" : "s"}`, gaps.map((g) => g.detail).join(" "), 2);
  const overlaps = dateIssues.filter((d) => d.kind === "overlap");
  if (overlaps.length) push("medium", `Clarify ${overlaps.length} overlapping date range${overlaps.length === 1 ? "" : "s"}`, overlaps.map((o) => o.detail).join(" ") + " Note if this was concurrent, contract, or part-time work.", 1);
  if (missingTerms.length) push("high", `Work in these missing terms: ${missingTerms.slice(0, 5).join(", ")}`, "These terms are frequent in the job description you provided. Add them where they are true — never invent experience.", Math.min(10, missingTerms.length * 2));
  const weakOpenerCount = bullets.filter((b) => b.weakOpener).length;
  if (weakOpenerCount) push("high", `Strengthen ${weakOpenerCount} weak bullet opener${weakOpenerCount === 1 ? "" : "s"}`, "Replace phrases like \"responsible for\" or \"helped\" with a strong action verb (Led, Built, Reduced, Increased...).", Math.min(8, weakOpenerCount * 2));
  const unquantified = bullets.filter((b) => !b.hasNumber).length;
  if (unquantified) push("medium", `Add numbers to ${unquantified} line${unquantified === 1 ? "" : "s"}`, "Add scale, percentage, time, or amount so impact is verifiable.", Math.min(8, unquantified));
  if (cliches.length) push("medium", `Replace ${cliches.length} generic phrase${cliches.length === 1 ? "" : "s"}`, `Phrases like "${cliches.slice(0, 3).join("\", \"")}" are common filler that recruiters skim past. Replace with a specific, evidence-backed statement.`, 2);
  const passiveCount = bullets.filter((b) => b.passiveVoice).length;
  if (passiveCount) push("low", `Rewrite ${passiveCount} passive-voice line${passiveCount === 1 ? "" : "s"}`, "Constructions like \"was responsible for\" read as less direct than active voice (\"Led...\").", 1);
  const firstPersonCount = bullets.filter((b) => b.firstPerson).length;
  if (firstPersonCount) push("low", "Remove first-person pronouns", "Resumes conventionally omit \"I\" / \"my\" / \"me\" and start bullets with an action verb instead.", 1);
  if (repeatedWords.length) push("low", `Reduce repetition of: ${repeatedWords.map((r) => r.word).join(", ")}`, "These words appear frequently. Vary vocabulary or consolidate similar bullets.", 1);
  if (wordCount < 150) push("medium", "Add more detail", `Your CV text is quite short (${wordCount} words). Add more specifics about your responsibilities and results.`, 3);
  if (wordCount > 1200) push("low", "Consider trimming length", `At about ${wordCount} words this may run long. Keep only the most relevant, recent, and quantified experience.`, 1);

  if (!fixes.length) push("low", "No major issues detected", "Your CV passes the automated checks. Review the keyword and content pages for finer detail.", 0);
  return fixes.slice(0, 12);
}

function buildRisks(input: { checks: AnalyzeChecks; headings: { nonStandard: string[] }; dateIssues: DateIssue[]; personalDataFlags: string[] }): Risk[] {
  const { checks, headings, dateIssues, personalDataFlags } = input;
  const risks: Risk[] = [];
  if (!checks.hasContact) risks.push({ severity: "critical", title: "Contact info not clearly detected", why: "An email and phone number together weren't found in the main text." });
  for (const gap of dateIssues.filter((d) => d.kind === "gap")) risks.push({ severity: "high", title: "Possible employment gap", why: gap.detail });
  for (const overlap of dateIssues.filter((d) => d.kind === "overlap")) risks.push({ severity: "medium", title: "Possible overlapping roles", why: `${overlap.detail} A reader may ask whether this was concurrent, contract, or part-time work.` });
  if (headings.nonStandard.length) risks.push({ severity: "low", title: "Non-standard section heading(s)", why: `"${headings.nonStandard.slice(0, 3).join(", ")}" may be harder for an automated system to classify than a conventional heading.` });
  if (personalDataFlags.length) risks.push({ severity: "medium", title: "Personal data detected", why: `Found: ${personalDataFlags.join(", ")}. Consider whether this is expected or required for your target region — it is never scored, but some regions discourage including it.` });
  if (!risks.length) risks.push({ severity: "low", title: "No major risks detected", why: "The automated checks did not flag any structural issues." });
  return risks;
}

export function analyzeCv(cvText: string, jobDescription: string): AnalyzeResult {
  const lines = cvText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const words = cvText.split(/\s+/).filter(Boolean).length;

  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(cvText);
  const hasPhone = /(?:\+?\d[\d ()-]{7,})/.test(cvText);
  const hasLinkedIn = /linkedin\.com\//i.test(cvText);
  const hasExperienceText = /experience|employment|work history/i.test(cvText);
  const hasEducationText = /education|university|college|degree/i.test(cvText);

  // Skip the first line: it's conventionally the candidate's name, which
  // otherwise reads as a heading-like line and gets false-flagged.
  const headingInfo = analyzeHeadings(lines.slice(1));
  const checks: AnalyzeChecks = {
    hasContact: hasEmail && hasPhone,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasSummary: headingInfo.hasSummary,
    hasExperience: hasExperienceText,
    hasEducation: hasEducationText,
    hasSkills: headingInfo.hasSkills || /\bskills\b/i.test(cvText),
  };

  const dateIssues = analyzeDates(cvText);
  const bullets = analyzeBullets(cvText);
  const clichesFound = [...new Set(bullets.flatMap((b) => b.cliches))];
  const repeatedWords = analyzeRepeatedWords(cvText);
  const personalDataFlags = analyzePersonalData(cvText);

  const termsToCheck = jobDescription ? extractKeyTerms(jobDescription) : [];
  const matchedTerms = termsToCheck.filter((term) => includesTerm(cvText, term));
  const missingTerms = termsToCheck.filter((term) => !matchedTerms.includes(term));
  const keywordScore = termsToCheck.length ? Math.round((matchedTerms.length / termsToCheck.length) * 100) : 100;

  const atsScore = Math.min(
    100,
    20 +
      (checks.hasContact ? 15 : 0) +
      (checks.hasExperience ? 15 : 0) +
      (checks.hasEducation ? 10 : 0) +
      (checks.hasSkills ? 10 : 0) +
      (checks.hasSummary ? 5 : 0) +
      (headingInfo.nonStandard.length === 0 ? 10 : 0) +
      (dateIssues.length === 0 ? 15 : 0),
  );

  const substantiveCount = bullets.length;
  const quantifiedRatio = substantiveCount ? bullets.filter((b) => b.hasNumber).length / substantiveCount : 0;
  const strongOpenerRatio = substantiveCount ? bullets.filter((b) => b.strongOpener).length / substantiveCount : 0;
  const clichePenalty = Math.min(30, clichesFound.length * 8);
  const contentScore = substantiveCount ? Math.max(0, Math.round((quantifiedRatio * 60 + strongOpenerRatio * 40) - clichePenalty)) : 0;

  const scanScore = Math.min(
    100,
    40 + (checks.hasContact ? 15 : 0) + (checks.hasSummary ? 15 : 0) + (words > 0 && words <= 700 ? 20 : 5) + (checks.hasExperience ? 10 : 0),
  );

  const consistencyScore = Math.round(((headingInfo.nonStandard.length === 0 ? 100 : 60) + (dateIssues.length === 0 ? 100 : 50)) / 2);

  const score = Math.round(atsScore * 0.35 + keywordScore * 0.25 + contentScore * 0.2 + scanScore * 0.1 + consistencyScore * 0.1);

  const fixes = buildFixes({ checks, headings: headingInfo, dateIssues, bullets, cliches: clichesFound, repeatedWords, matchedTerms, missingTerms, wordCount: words });
  const risks = buildRisks({ checks, headings: headingInfo, dateIssues, personalDataFlags });

  return {
    score,
    confidence: cvText.length > 500 ? "high" : "medium",
    sections: { ats: atsScore, keywords: keywordScore, content: contentScore, scan: scanScore, consistency: consistencyScore },
    checks,
    headings: { detected: headingInfo.detected, nonStandard: headingInfo.nonStandard },
    dateIssues,
    bullets,
    cliches: clichesFound,
    repeatedWords,
    personalDataFlags,
    matchedTerms,
    missingTerms,
    wordCount: words,
    fixes,
    risks,
    disclaimer: "This is a heuristic simulation from rule-based checks, not a real ATS score or hiring decision.",
    ruleVersion: "3.0",
  };
}
