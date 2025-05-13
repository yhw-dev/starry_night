import React from 'react';
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/lib/firebase/auth";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "별밤",
  description: "감성을 담은 시 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialias min-h-screen w-full flex flex-col
        bg-[url('/main_bg.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white`}
      >
        <AuthProvider>
          <Header />
          <main className="relative z-10 px-4 py-10">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
