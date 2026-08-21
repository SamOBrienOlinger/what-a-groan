import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://what-a-groan.samobo.chatgpt.site"),
  title: "WHAT A GROAN! — The Misery Index",
  description:
    "Turn life's minor catastrophes into a scientifically questionable groan score.",
  openGraph: {
    title: "WHAT A GROAN!",
    description: "Life's rough. Your score can prove it.",
    type: "website",
    url: "https://what-a-groan.samobo.chatgpt.site",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "WHAT A GROAN!" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WHAT A GROAN!",
    description: "Life's rough. Your score can prove it.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
