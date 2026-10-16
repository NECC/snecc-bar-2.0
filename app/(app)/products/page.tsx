"use client";

import { useEffect, useState } from "react";

import CatalogView, { Product } from "@/components/catalog-view";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
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
  const handleConfirmarCompra = async (id: string) => {
    try {
      const response = await fetch("/api/user/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({p_id: id}),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to purchase product");
      }

      toast.success(data.message);
      router.refresh();
      fetchProducts();
    } catch (error) {
      console.error("Error buying product:", error);
      toast.error("Compra do produto falhou");
    } finally {
      setProdutoSelecionado(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8">
          <CatalogView
            products={products}
            onConfirmarCompra={handleConfirmarCompra}
            produtoSelecionado={produtoSelecionado}
            setProdutoSelecionado={setProdutoSelecionado}
          />
      </div>

    </div>
  );
}