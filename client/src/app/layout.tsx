import Providers from "@/shared/config/providers"
import { cn } from "@/shared/lib"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.scss"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - AmTube",
    default: "AmTube",
  },
  description:
    "Watch favorite videos, listen to favorite songs, upload videos and share them with friends, family and the whole world.",
  keywords: "video, share, phone with camera, phone with video, free, download",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
