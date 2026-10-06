"use client";

import { useState } from "react";
import { UtensilsCrossed, Receipt, CheckCircle2, LogOut } from "lucide-react";

import CatalogView, { Product } from "@/components/catalog-view";
import OrdersView from "@/components/orders-view";
import { LuUtensilsCrossed } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";

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
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white font-extrabold text-bg p-2 rounded-xl shadow-md shadow-blue-200">
              sNECC-Bar
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setAbaAtiva("snacks")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                abaAtiva === "snacks"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LuUtensilsCrossed className="w-4 h-4"/>
              Snacks
            </button>
            <button
              onClick={() => setAbaAtiva("pedidos")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                abaAtiva === "pedidos"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <IoReceiptOutline className="w-4 h-4 "/>
              Pedidos
            </button>
          </nav>
        </div>

        {/* Canto Superior Direito */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
            <span className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-1.5">
              {user.nome}
              {user.isSocio && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 flex-shrink-0" />
              )}
            </span>

            <div className="h-4 w-px bg-slate-200" />

            <span className="text-xs font-semibold text-slate-500">
              Saldo: <strong className="text-blue-600 font-extrabold">{user.saldo.toFixed(2)}€</strong>
            </span>
          </div>

          <button
            onClick={() => alert("Sessão encerrada!")}
            title="Encerrar Sessão"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8">
        {abaAtiva === "snacks" && (
          <CatalogView
            products={MOCK_PRODUCTS}
            isSocio={user.isSocio}
            onConfirmarCompra={handleConfirmarCompra}
          />
        )}

        {abaAtiva === "pedidos" && (
          <OrdersView 
            compras={MOCK_COMPRAS} 
          />
        )}
      </div>

      {/* BARRA INFERIOR TELEMÓVEL */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 py-2.5 px-6 flex justify-around items-center z-50 md:hidden">
        <button
          onClick={() => setAbaAtiva("snacks")}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            abaAtiva === "snacks" ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Snacks</span>
        </button>

        <button
          onClick={() => setAbaAtiva("pedidos")}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
            abaAtiva === "pedidos" ? "text-blue-600" : "text-slate-400"
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span>Pedidos</span>
        </button>
      </nav>

    </div>
  );
}