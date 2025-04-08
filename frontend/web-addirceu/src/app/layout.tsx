import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Web Addirceu",
  description: "Plataforma web do congresso Addirceu",
  icons: [
    { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', url: '/addirceu.png' },
    { rel: 'apple-touch-icon', url: '/addirceu.png' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
