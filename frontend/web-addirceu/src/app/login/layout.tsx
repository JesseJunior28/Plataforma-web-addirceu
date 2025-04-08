import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Web Addirceu",
  description: "Faça login na plataforma Web Addirceu",
  icons: [
    { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', url: '/addirceu.png' },
    { rel: 'apple-touch-icon', url: '/addirceu.png' },
  ],
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
