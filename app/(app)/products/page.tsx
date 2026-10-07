"use client";

import { useEffect, useState } from "react";

import CatalogView, { Product } from "@/components/catalog-view";
import { toast } from "sonner";

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