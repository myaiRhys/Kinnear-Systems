import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

/* ─── SEO Metadata ─── */

const siteUrl = "https://kinnear.systems";

export const metadata: Metadata = {
  title: {
    default: "Kinnear Systems — Software That Actually Works",
    template: "%s | Kinnear Systems",
  },
  description:
    "Cape Town software studio building automation systems, PWAs, and production-grade web applications. Custom systems and rapid websites that save businesses 500+ hours/year.",
  keywords: [
    "software development",
    "Cape Town",
    "web development",
    "automation systems",
    "PWA",
    "React",
    "Next.js",
    "Firebase",
  ],
  authors: [{ name: "Kinnear Systems" }],
  creator: "Kinnear Systems",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Kinnear Systems",
    title: "Kinnear Systems — Software That Actually Works",
    description:
      "Cape Town software studio building automation systems and production-grade web applications.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kinnear Systems — Systems & Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinnear Systems — Software That Actually Works",
    description:
      "Cape Town software studio building automation systems and production-grade web applications.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

/* ─── JSON-LD Structured Data ─── */

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kinnear Systems",
  url: siteUrl,
  description:
    "Cape Town software studio specializing in custom automation systems and rapid web development.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cape Town",
    addressCountry: "ZA",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@kinnear.systems",
    contactType: "sales",
  },
};

/* ─── Layout ─── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-mono bg-black text-white antialiased">
        {/* Skip to main content — a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-cyan focus:text-black focus:px-4 focus:py-2 focus:text-xs focus:font-mono focus:uppercase focus:tracking-widest"
        >
          Skip to main content
        </a>

        <SmoothScroll>
          <Header />
          <PageTransition>
            <main id="main-content">{children}</main>
          </PageTransition>
          <Footer />
        </SmoothScroll>

        {/* Scanline CRT effect */}
        <div className="scanline" aria-hidden="true" />
      </body>
    </html>
  );
}
