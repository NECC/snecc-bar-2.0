"use client";

import { useState } from "react";
import { UtensilsCrossed, Receipt, CheckCircle2, LogOut } from "lucide-react";

import CatalogView, { Product } from "@/components/catalog-view";
import OrdersView from "@/components/orders-view";
import { LuUtensilsCrossed } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";


const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    nome: "Água das Pedras",
    bay: "BAY-01",
    precoSocio: 0.80,
    precoNaoSocio: 1.00,
    stock: 12,
    imagem: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    nome: "Gomas Fini",
    bay: "BAY-02",
    precoSocio: 0.75,
    precoNaoSocio: 0.90,
    stock: 2,
    imagem: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    nome: "Coca-Cola Zero",
    bay: "BAY-03",
    precoSocio: 0.90,
    precoNaoSocio: 1.10,
    stock: 8,
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "4",
    nome: "Batatas Lays Recheadas",
    bay: "BAY-04",
    precoSocio: 0.85,
    precoNaoSocio: 1.00,
    stock: 5,
    imagem: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "5",
    nome: "Ice Tea Limão",
    bay: "BAY-05",
    precoSocio: 0.90,
    precoNaoSocio: 1.10,
    stock: 15,
    imagem: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "6",
    nome: "Snickers Original",
    bay: "BAY-06",
    precoSocio: 0.95,
    precoNaoSocio: 1.20,
    stock: 1,
    imagem: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400",
  },
];

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
      alert("Saldo insuficiente para efetuar esta compra!");
      return;
    }

    // Deduz o valor do saldo do utilizador
    setUser((prev) => ({
      ...prev,
      saldo: prev.saldo - preco,
    }));

    alert(`Compra de "${produto.nome}" efetuada com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">

      {/* HEADER */}
      <Header user={user}/>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8">
          <CatalogView
            products={MOCK_PRODUCTS}
            isSocio={user.isSocio}
            onConfirmarCompra={handleConfirmarCompra}
          />
      </div>

      {/* BARRA INFERIOR TELEMÓVEL */}
      <MobileFooter />

    </div>
  );
}