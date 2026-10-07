"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";
import RechargeModal from "@/components/recharge-modal";
import ProductModal from "@/components/product-modal";
import { 
  Plus,
  Package
} from "lucide-react";
import ProductsView, { Product } from "@/components/products-view";

const RECENT_TRANSACTIONS = [
  { id: "1", user: "João Silva", type: "CARREGAMENTO", amount: "+10.00€", date: "Hoje, 14:20", admin: "Admin Maria" },
  { id: "2", user: "Ana Costa", type: "COMPRA", amount: "-0.80€", date: "Hoje, 12:15", admin: "Sistema" },
  { id: "3", user: "Pedro Santos", type: "RETIRADA", amount: "-2.50€", date: "Ontem, 18:00", admin: "Admin João" },
];

export default function DashboardProductsPage() {
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const [userData, setUserData] = useState<{
    isSocio: boolean;
    isAdmin: boolean;
    saldo: number;
  }>({
    isSocio: false,
    isAdmin: false,
    saldo: NaN,
  });

  const [products, setProducts] = useState<Product[]>([]);

  const getUserData = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getProductsData = async () => {
    try {
      const response = await fetch("/api/products/admin");
      if (!response.ok) {
        throw new Error("Failed to fetch products data");
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  };

  useEffect(() => {
    getUserData();
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
              onClick={() => setRechargeModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Produto 
            </button>
            <button 
              onClick={() => setProductModalOpen(true)}
              className="bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              Adicionar Stock
            </button>
          </div>
        </div>

        {/* Tabela de Transações Recentes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Produtos</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Ver Todos</button>
          </div>

          <div className="divide-y divide-slate-100">
            <ProductsView products={products} />
          </div>
        </div>
      </main>

      {/* Modais da Dashboard */}
      <RechargeModal 
        isOpen={rechargeModalOpen} 
        onClose={() => setRechargeModalOpen(false)} 
      />
      
      <ProductModal 
        isOpen={productModalOpen} 
        onClose={() => setProductModalOpen(false)} 
      />

    </div>
  );
}