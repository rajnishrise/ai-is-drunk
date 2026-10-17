import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aiisdrunk.com"),
  title: { default: "AI is Drunk · The Tipsy Tavern", template: "%s · AI is Drunk" },
  description: "A parody bar where AI models get drunk, hallucinate, and are absolutely sure they are right.",
  openGraph: {
    title: "AI is Drunk · The Tipsy Tavern",
    description: "Buy an AI a round and watch it hallucinate with total confidence.",
    url: "https://www.aiisdrunk.com",
    siteName: "AI is Drunk",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#120d1c", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bungee&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=IBM+Plex+Mono:wght@400;600;700&display=swap"
        />
      </head>
      <body>
        <Nav />
        {children}
        <footer className="site">
          <div className="wrap">
            <span>Parody. No real AI was harmed, and the AI answers are wrong on purpose.</span>
            <span>aiisdrunk.com · Please verify your facts responsibly.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
