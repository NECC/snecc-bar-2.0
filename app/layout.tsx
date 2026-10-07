import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // 1. Importar o Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "sNECC-Bar",
  description: "Sistema de Gestão de Bar e Saldos do NECC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {children}
        {/* 2. Adicionar o Toaster no final do body */}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          toastOptions={{
            style: { borderRadius: '1rem' }
          }} 
        />
      </body>
    </html>
  );
}