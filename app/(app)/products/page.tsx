"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, Receipt, CheckCircle2, LogOut } from "lucide-react";

import CatalogView, { Product } from "@/components/catalog-view";
import OrdersView from "@/components/orders-view";
import { LuUtensilsCrossed } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";
import { toast } from "sonner";


const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    nome: "Água das Pedras",
    preco: 1.00,
    imagem: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "2",
    nome: "Gomas Fini",
    preco: 0.75,
    imagem: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "3",
    nome: "Coca-Cola Zero",
    preco: 0.90,
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "4",
    nome: "Batatas Lays Recheadas",
    preco: 0.85,
    imagem: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "5",
    nome: "Ice Tea Limão",
    preco: 0.90,
    imagem: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "6",
    nome: "Snickers Original",
    preco: 0.95,
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

export default function ProductsPage() {
  const [user, setUser] = useState({
    isSocio: true,
    isAdmin: false,
    saldo: 5.50
  });

  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log("Fetched Products:", data.products);
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler para processar a compra individual
  const handleConfirmarCompra = (produto: Product) => {
    const preco = user.isSocio ? produto.preco : produto.preco;
    
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

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8">
          <CatalogView
            products={products}
            onConfirmarCompra={handleConfirmarCompra}
          />
      </div>

    </div>
  );
}