import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSiteSettings } from "@/lib/contentful/queries";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
      title,
      description,
      icons: faviconUrl ? { icon: faviconUrl } : undefined,
      openGraph: {
        title,
        description,
        type: "website",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
