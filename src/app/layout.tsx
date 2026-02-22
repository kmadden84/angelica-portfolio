import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { getSiteSettings } from "@/lib/contentful/queries";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    const fields = settings?.fields as unknown as {
      siteTitle?: string;
      siteDescription?: string;
      ogImage?: { fields: { file: { url: string } } };
      favicon?: { fields: { file: { url: string } } };
    } | null;

    const title = fields?.siteTitle || "Portfolio";
    const description =
      fields?.siteDescription || "Marketing & Business Strategy Portfolio";
    const ogImageUrl = fields?.ogImage?.fields?.file?.url
      ? `https:${fields.ogImage.fields.file.url}`
      : undefined;
    const faviconUrl = fields?.favicon?.fields?.file?.url
      ? `https:${fields.favicon.fields.file.url}`
      : undefined;

    return {
      metadataBase: new URL("https://angelicarockford.com"),
      title,
      description,
      icons: faviconUrl ? { icon: faviconUrl } : undefined,
      alternates: {
        canonical: "/",
      },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title,
        description,
        type: "website",
        siteName: "Angelica Guze | Portfolio",
        locale: "en_US",
        images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImageUrl ? [ogImageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "Portfolio",
      description: "Marketing & Business Strategy Portfolio",
    };
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Angelica Guze",
  jobTitle: "Marketing & Business Strategy Professional",
  description:
    "Marketing and business strategy portfolio showcasing leadership, creative projects, and professional experience.",
  url: "https://angelicarockford.com",
  sameAs: [
    "https://www.linkedin.com/in/angelicarockford/",
    "https://www.youtube.com/@angelicarockford",
    "https://www.instagram.com/angelicarockford/",
    "https://www.facebook.com/angelicarockfordchildrenbooks/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakarta.variable} ${playfair.variable} antialiased`}>
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-accent)] focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
