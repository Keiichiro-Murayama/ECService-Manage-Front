import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FrontMenuLayout from "./layout/frontmenu";
import { AuthSessionProvider } from "@/components/auth/AuthSessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fullness Stationery",
  description: "Fullness Stationery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <AuthSessionProvider>
        <FrontMenuLayout>{children}</FrontMenuLayout>
      </AuthSessionProvider>
    </html>
  );
}
