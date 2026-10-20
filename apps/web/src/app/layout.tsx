import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo-loaded",
  subsets: ["arabic", "latin"],
});

const inter = Inter({
  variable: "--font-inter-loaded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "أصل للأعمال | تسجيل الدخول",
  description: "واجهة تسجيل الدخول إلى أصل للأعمال.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-800">{children}</body>
    </html>
  );
}
