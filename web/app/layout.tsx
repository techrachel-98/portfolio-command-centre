import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23221c33'/%3E%3Cstop offset='1' stop-color='%237c3aed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='24' fill='url(%23g)'/%3E%3Ctext x='50' y='70' font-size='58' font-family='Georgia,serif' font-weight='bold' fill='white' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: "Rachel Sigamani — AI Builder & Full-Stack Developer",
  description:
    "Rachel Sigamani — AI Builder & Full-Stack Developer. AI automation, agents, and applied engineering. Building agentic systems end-to-end, from architecture to deployment.",
  icons: { icon: favicon },
  openGraph: {
    type: "website",
    title: "Rachel Sigamani — AI Builder & Full-Stack Developer",
    description:
      "AI Automation, Agents & Applied Engineering. Building agentic systems end-to-end, from architecture to deployment.",
  },
};

export const viewport = {
  themeColor: "#0b0a0f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
