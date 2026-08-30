import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import DesktopSiteViewport from "@/components/DesktopSiteViewport";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shreyashtech.me"),
  title: {
    default: "Shreyash Bagade - Full Stack Web & App Developer",
    template: "%s | Shreyash Bagade",
  },
  description:
    "Shreyash Bagade is a full stack developer building websites, MVPs, and mobile apps for startups and founders.",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
  keywords: [
    "full stack developer",
    "web developer India",
    "hire freelance developer",
    "MVP development",
    "Next.js developer",
  ],
  authors: [{ name: "Shreyash Bagade" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shreyash Bagade - Full Stack Web & App Developer",
    description:
      "Full stack developer building websites, MVPs, and mobile apps for startups and founders.",
    url: "https://shreyashtech.me",
    siteName: "Shreyash Bagade",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyash Bagade - Full Stack Web & App Developer",
    description:
      "Full stack developer building websites, MVPs, and mobile apps for startups and founders.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="font-inter antialiased">
        <DesktopSiteViewport />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}