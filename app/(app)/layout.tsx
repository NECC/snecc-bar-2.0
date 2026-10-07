import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner"; // 1. Importar o Toaster
import { getCurrentUser } from "@/lib/get_current_user";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "sNECC-Bar",
  description: "Sistema de Gestão de Bar e Saldos do NECC",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const data = {
    isSocio: user?.isSocio ?? false,
    isAdmin: user?.isAdmin ?? false,
    saldo: Number.parseFloat(user?.saldo ?? "0"),
  }
  

  return (
    <html lang="pt">
      <body className={inter.className}>
        <Header user={data} />
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
        <MobileFooter user={data} />
      </body>
    </html>
  );
}