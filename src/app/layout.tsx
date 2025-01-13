import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIDAF",
  description: "Simulador FIDAF 2025",
  icons: "https://sistemas.sepog.fortaleza.ce.gov.br/guardiao/design/atom/images/favicon_new.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body data-theme="light"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-screen w-full overflow-y-auto">

          <div className="tabs tabs-boxed">
            <Link href="/" className="tab">Resumo</Link>
            <Link href="/receitas" className="tab">Receitas</Link>
            <Link href="/ipca" className="tab">ipca</Link>
          </div>
          <div className="w-full max-w-screen-2xl mx-auto">
            {children}
          </div>
        </div>
      </body>
    </html >
  );
}
