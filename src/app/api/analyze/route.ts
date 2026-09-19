import { NextResponse } from "next/server";

const REQUIRED_TERMS = [
  "product marketing",
  "go-to-market",
  "positioning",
  "sales enablement",
  "product-led growth",
  "market research",
  "executive communication",
];

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

    const words = cvText ? cvText.split(/\s+/).filter(Boolean).length : 0;
    const termsToCheck = jobDescription
      ? REQUIRED_TERMS.filter((term) => includesTerm(jobDescription, term))
      : REQUIRED_TERMS;
    const matchedTerms = termsToCheck.filter((term) => includesTerm(cvText, term));
    const keywordScore = termsToCheck.length ? Math.round((matchedTerms.length / termsToCheck.length) * 100) : 0;
    const hasContact = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(cvText) && /(?:\+?\d[\d ()-]{7,})/.test(cvText);
    const hasExperience = /experience|employment|work history/i.test(cvText);
    const hasEducation = /education|university|college|degree/i.test(cvText);
    const atsScore = Math.min(100, 45 + (hasContact ? 20 : 0) + (hasExperience ? 20 : 0) + (hasEducation ? 15 : 0));
    const score = Math.round(atsScore * 0.35 + keywordScore * 0.25 + (words > 250 ? 68 : 54) * 0.2 + 72 * 0.2);

    return NextResponse.json({
      score,
      potentialScore: Math.min(100, score + 15),
      confidence: cvText.length > 500 ? "high" : "medium",
      sections: { ats: atsScore, keywords: keywordScore },
      matchedTerms,
      missingTerms: termsToCheck.filter((term) => !matchedTerms.includes(term)),
      wordCount: words,
      hardFails: [],
      disclaimer: "This is a heuristic simulation, not a real ATS score or hiring decision.",
      ruleVersion: "2.4",
    });
  } catch {
    return NextResponse.json({ error: "Unable to analyze this payload" }, { status: 400 });
  }
}
