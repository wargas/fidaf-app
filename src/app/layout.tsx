import { Button } from "@/components/ui/button";
import { CalculatorIcon, ListIcon } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
        <div className="absolute top-0 right-0 left-0 shadow bg-white h-16 flex items-center z-50">
          <h1 className="px-4 text-xl font-bold">
            <Link href='/'>F I D A F</Link>
          </h1>
          <div className="ml-auto px-4 flex gap-2">
            <Button variant={'ghost'} asChild>
              <Link href={'/receitas'}><ListIcon />Receitas</Link>
            </Button>
            <Button variant={'ghost'} asChild>
              <Link href={'/calculo'}><CalculatorIcon /> Cálculo</Link>
            </Button>
            
          </div>
        </div>
        <div className="h-screen bg-gray-50 w-full overflow-y-auto pt-16">

          <div className="w-full max-w-screen-2xl mx-auto">
            {children}
          </div>
        </div>
      </body>
    </html >
  );
}
