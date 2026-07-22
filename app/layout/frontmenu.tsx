"use client";
import "@/app/globals.css";
import Header from "./header";
import Footer from "./footer";
// import { NextAuthProvider } from "@/components/provider/NextAuthProvider";

export default function FrontMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <NextAuthProvider>
    <body className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">{children}</main>
      <Footer />
    </body>

    // </NextAuthProvider>
  );
}
