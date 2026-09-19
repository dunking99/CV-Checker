import { NextResponse } from "next/server";

// Generic stopwords filtered out when pulling candidate keywords from a job
// description, so scoring works for any role/industry rather than a fixed list.
const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "have", "will", "are",
  "was", "were", "you", "your", "our", "their", "into", "about", "over",
  "under", "such", "who", "what", "when", "where", "how", "why", "not", "but",
  "than", "then", "also", "can", "may", "must", "should", "would", "could",
  "ability", "years", "year", "role", "team", "teams", "work", "working",
  "strong", "experience", "responsibilities", "requirements", "job",
  "description", "looking", "seeking", "ideal", "candidate", "plus",
  "preferred", "required", "skills", "skill", "including", "across", "within",
]);

function extractKeyTerms(text: string, max = 12): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOPWORDS.has(word));

  const frequency = new Map<string, number>();
  for (const word of words) frequency.set(word, (frequency.get(word) ?? 0) + 1);

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([term]) => term);
}

function includesTerm(text: string, term: string) {
  return text.toLocaleLowerCase().includes(term.toLocaleLowerCase());
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { cvText?: string; jobDescription?: string };
    const cvText = typeof body.cvText === "string" ? body.cvText.trim() : "";
    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";

    if (!cvText) {
      return NextResponse.json({ error: "cvText is required" }, { status: 400 });
    }

    const lines = cvText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const words = cvText.split(/\s+/).filter(Boolean).length;

    // Keywords are derived from whatever job description is supplied, not a
    // fixed word list, so the check works for any role or industry.
    const termsToCheck = jobDescription ? extractKeyTerms(jobDescription) : [];
    const matchedTerms = termsToCheck.filter((term) => includesTerm(cvText, term));
    const missingTerms = termsToCheck.filter((term) => !matchedTerms.includes(term));
    const keywordScore = termsToCheck.length ? Math.round((matchedTerms.length / termsToCheck.length) * 100) : 100;

    const hasContact = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(cvText) && /(?:\+?\d[\d ()-]{7,})/.test(cvText);
    const hasExperience = /experience|employment|work history/i.test(cvText);
    const hasEducation = /education|university|college|degree/i.test(cvText);
    const atsScore = Math.min(100, 45 + (hasContact ? 20 : 0) + (hasExperience ? 20 : 0) + (hasEducation ? 15 : 0));

    // Content-impact proxy: how many lines carry a number (a stand-in for a
    // quantified, verifiable result) out of all substantive lines.
    const substantiveLines = lines.filter((line) => line.length > 15);
    const quantifiedLines = substantiveLines.filter((line) => /\d/.test(line));
    const contentScore = substantiveLines.length
      ? Math.round((quantifiedLines.length / substantiveLines.length) * 100)
      : 0;

    // Recruiter-scan proxy: reachable contact info plus a length that a
    // human reader can plausibly skim.
    const scanScore = Math.min(
      100,
      50 + (hasContact ? 20 : 0) + (words > 0 && words <= 700 ? 20 : 5) + (hasExperience ? 10 : 0),
    );

    // Consistency/formatting proxy: reuses the two structural signals above
    // instead of an unrelated fixed constant.
    const consistencyScore = Math.round((atsScore + contentScore) / 2);

    const score = Math.round(
      atsScore * 0.35 + keywordScore * 0.25 + contentScore * 0.2 + scanScore * 0.1 + consistencyScore * 0.1,
    );

    return NextResponse.json({
      score,
      potentialScore: Math.min(100, score + 15),
      confidence: cvText.length > 500 ? "high" : "medium",
      sections: { ats: atsScore, keywords: keywordScore, content: contentScore, scan: scanScore, consistency: consistencyScore },
      checks: { hasContact, hasExperience, hasEducation },
      matchedTerms,
      missingTerms,
      wordCount: words,
      hardFails: [],
      disclaimer: "This is a heuristic simulation, not a real ATS score or hiring decision.",
      ruleVersion: "2.5",
    });
  } catch {
    return NextResponse.json({ error: "Unable to analyze this payload" }, { status: 400 });
  }
}
