import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moodfy",
  description: "Descubra músicas que combinam com o seu mood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
