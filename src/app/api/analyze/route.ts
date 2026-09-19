import { NextResponse } from "next/server";
import { analyzeCv } from "@/lib/analyze";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { cvText?: string; jobDescription?: string };
    const cvText = typeof body.cvText === "string" ? body.cvText.trim() : "";
    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";

    if (!cvText) {
      return NextResponse.json({ error: "cvText is required" }, { status: 400 });
    }

    return NextResponse.json(analyzeCv(cvText, jobDescription));
  } catch {
    return NextResponse.json({ error: "Unable to analyze this payload" }, { status: 400 });
  }
}
