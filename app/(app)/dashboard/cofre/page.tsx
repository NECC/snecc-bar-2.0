"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  HandCoins,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { BsSafe } from "react-icons/bs";
import SafeAdjustModal from "@/components/safe-adjust-modal";

type SafeInfo = {
  totalBalance: string;
  totalUserBalances : string, 
  lastUpdate: string;
};

const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

export default function SafePage() {
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [safeData, setSafeData] = useState<SafeInfo>({
    totalBalance: "0.00",
    totalUserBalances : "0.00",
    lastUpdate: "",
  });

  const getSafeData = async () => {
    try {
      const response = await fetch("/api/admin/safe", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch safe data");
      }
      const data = await response.json();
      setSafeData(data);
    } catch (error) {
      console.error("Error fetching safe data:", error);
    }
  };

  useEffect(() => {
    getSafeData();
  }, []);

  const balanceValue = Number(safeData.totalBalance);
  const balanceProfit = Number(safeData.totalBalance) - Number(safeData.totalUserBalances);
  const isProfit = balanceProfit > 0;
  const isLoss = balanceProfit < 0;

  // Configuração dinâmica do cartão de Lucro/Prejuízo
  const financialStatus = {
    label: isProfit ? "+ " + balanceProfit:isLoss ? balanceProfit : "0.0",
    val: euro.format(balanceProfit),
    color: isProfit ? "text-emerald-600" : isLoss ? "text-rose-600" : "text-slate-600",
    bgColor: isProfit ? "bg-emerald-50" : isLoss ? "bg-rose-50" : "bg-slate-100",
    borderColor: isProfit ? "border-emerald-200" : isLoss ? "border-rose-200" : "border-slate-200",
    Icon: isProfit ? TrendingUp : isLoss ? TrendingDown : Minus,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Título & Ações Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <BsSafe className="w-7 h-7 text-blue-600" />
              Cofre do Snecc-Bar
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Análise detalhada de saldo acumulado, lucros das vendas e perdas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAdjustModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition flex items-center gap-2 cursor-pointer"
            >
              <HandCoins className="w-4 h-4" />
              Alterar Saldo do Cofre
            </button>
          </div>
        </div>

        {/* 1. CARTÕES DE MÉTRICAS LADO A LADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          
          {/* Cartão 1: Saldo total no Cofre */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Saldo total no Cofre</span>
              <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                {euro.format(balanceValue)}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>

          {/* Cartão 2: Estado Financeiro (Lucro vs Prejuízo) */}
          <div className={`bg-white p-5 rounded-2xl border ${financialStatus.borderColor} shadow-sm flex items-center justify-between`}>
            <div>
              <span className="text-xs font-semibold text-slate-500">Valor Disponível no Cofre</span>
              <div className={`text-xl md:text-2xl font-black ${financialStatus.color} mt-1 flex items-center gap-2`}>
                {financialStatus.label}
              </div>
            </div>
            <div className={`w-12 h-12 ${financialStatus.bgColor} ${financialStatus.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <financialStatus.Icon className="w-6 h-6" />
            </div>
          </div>

        </div>

        <SafeAdjustModal
          isOpen={adjustModalOpen}
          onClose={() => setAdjustModalOpen(false)}
          onSuccess={getSafeData}
        /> 

      </main>
    </div>
  );
}