import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TabNav from "@/app/components/TabNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 语音记账",
  description: "智能语音记账助手，一句话即可记账",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: 'var(--background)' }}>
        <header
          className="sticky top-0 z-10 border-b backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-lg font-bold py-3 text-center text-white tracking-wider">
              AI 语音记账
            </h1>
            <TabNav />
          </div>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">
          <div className="animate-fade-in">{children}</div>
        </main>
      </body>
    </html>
  );
}
