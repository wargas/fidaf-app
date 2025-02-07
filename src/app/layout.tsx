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
        <div className="h-screen bg-gray-50 w-full overflow-y-auto">

          <div className="shadow bg-white h-16 flex items-center">
            <h1 className="px-4 text-xl font-bold">F I D A F</h1>
            <div className="ml-auto px-4 flex gap-2">
              <Link href={'/'}>Receitas</Link>
              <Link href={'/calculo'}>Cálculo</Link>
            </div>
          </div>
          <div className="w-full max-w-screen-2xl mx-auto">
            {children}
          </div>
        </div>
      </body>
    </html >
  );
}
