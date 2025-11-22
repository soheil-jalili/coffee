import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/modules/Navbar/Navbar";
import AOSInitial from "@/utils/aos";
import Footer from "@/components/modules/Footer/Footer";
import ScrollToTop from "@/utils/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SET Coffee | فروشگاه اینترنتی قهوه ست",
  description: "شرکت فنجان داغ خوارزمی",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AOSInitial />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
