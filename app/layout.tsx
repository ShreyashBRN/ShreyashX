import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"), // update once you have a domain
  title: {
    default: "Shreyash Bagade - Full Stack Web & App Developer",
    template: "%s | Shreyash Bagade",
  },
  description:
    "Shreyash Bagade is a full stack developer building websites, MVPs, and mobile apps for startups and founders.",
  keywords: [
    "full stack developer",
    "web developer India",
    "hire freelance developer",
    "MVP development",
    "Next.js developer",
  ],
  authors: [{ name: "Shreyash Bagade" }],
  openGraph: {
    title: "Shreyash Bagade - Full Stack Web & App Developer",
    description:
      "Full stack developer building websites, MVPs, and mobile apps for startups and founders.",
    url: "https://yourdomain.com",
    siteName: "Shreyash Bagade",
    images: [
      {
        url: "/og-image.png", // we'll create this later
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}