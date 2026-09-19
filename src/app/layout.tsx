import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Signal · Evidence-based CV checker",
  description: "A transparent CV audit for parsing risk, keyword evidence, impact, and recruiter readability.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
