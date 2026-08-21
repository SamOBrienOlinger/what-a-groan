import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://what-a-groan.samobo.chatgpt.site"),
  title: "WHAT A GROAN! — An Objective Finding",
  description:
    "Submit the week's inconveniences. Receive a finding from a computer with no qualifications.",
  openGraph: {
    title: "WHAT A GROAN!",
    description: "Your week has been reviewed. Findings are available.",
    type: "website",
    url: "https://what-a-groan.samobo.chatgpt.site",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "WHAT A GROAN!" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WHAT A GROAN!",
    description: "Your week has been reviewed. Findings are available.",
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
