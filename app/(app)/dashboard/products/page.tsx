"use client";

import { useState, useEffect } from "react";
import NewProductModal from "@/components/new-product-modal";
import { 
  Plus,
  Package
} from "lucide-react";
import ProductsView, { Product } from "@/components/products-view";
import AddStockModal from "@/components/update-product-modal";

export default function DashboardProductsPage() {
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [newProductModalOpen, setNewProductModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const getProductsData = async () => {
    try {
      const response = await fetch("/api/admin/products", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch products data");
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  };

  const lostStock = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_id: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to update product stock");
      }
      getProductsData();
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        {/* Título & Ações Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Produtos e Stock
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Visão geral dos produtos e respetivo stock
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setNewProductModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Produto 
            </button>
            <button 
              onClick={() => setAddStockModalOpen(true)}
              className="bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              Adicionar Stock
            </button>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Produtos</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Ver Todos</button>
          </div>

          <div className="divide-y divide-slate-100">
            <ProductsView products={products} lostStock={lostStock} />
          </div>
        </div>
      </main>

      {/* Modais da Dashboard */}
      <NewProductModal 
        isOpen={newProductModalOpen} 
        onClose={() => {
          setNewProductModalOpen(false)
          getProductsData()
        }} 
      />

      <AddStockModal 
        isOpen={addStockModalOpen} 
        onClose={() => {
          setAddStockModalOpen(false)
          getProductsData()
        }}
        productIDs={products.map(product => ({ id: product.id, name: product.name }))}
      />

    </div>
  );
}