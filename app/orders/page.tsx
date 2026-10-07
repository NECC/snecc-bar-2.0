"use client";

import { useState } from "react";
import { UtensilsCrossed, Receipt, CheckCircle2, LogOut } from "lucide-react";

import CatalogView, { Product } from "@/components/catalog-view";
import OrdersView from "@/components/orders-view";
import { LuUtensilsCrossed } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";
import { toast } from "sonner";

const MOCK_COMPRAS = [
  {
    id: "tc-101",
    produtoNome: "Gomas Fini",
    produtoImagem: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=400",
    bay: "BAY-02",
    precoPago: 0.75,
    data: "2026-10-06T10:30:00Z",
    estatutoNaAltura: "Sócio",
  },
];

const MOCK_MOVIMENTOS_SALDO = [
  {
    id: "tb-201",
    type: "CARREGAR" as const,
    montante: 10.00,
    responsavel: "Admin João",
    data: "2026-10-04T14:20:00Z",
  },
];

export default function HomePage() {
  const [user, setUser] = useState({
    nome: "João Silva",
    isSocio: true,
    saldo: 5.50,
  });

  const [abaAtiva, setAbaAtiva] = useState<"snacks" | "pedidos">("snacks");

  // Handler para processar a compra individual
  const handleConfirmarCompra = (produto: Product) => {
    const preco = user.isSocio ? produto.precoSocio : produto.precoNaoSocio;

    if (user.saldo < preco) {
      toast.error("Saldo insuficiente para efetuar esta compra!");
      return;
    }

    // Deduz o valor do saldo do utilizador
    setUser((prev) => ({
      ...prev,
      saldo: prev.saldo - preco,
    }));

    toast.success(`Compra de "${produto.nome}" efetuada com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">

        {/* HEADER */}
        <Header user={user}/>
        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8">
            <OrdersView 
                compras={MOCK_COMPRAS} 
            />
        </div>

        {/* BARRA INFERIOR TELEMÓVEL */}
        <MobileFooter />

    </div>
  );
}