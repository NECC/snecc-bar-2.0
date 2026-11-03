"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  BarChart3, 
  Wallet,
  Minus,
  HandCoins
} from "lucide-react";
import SafeAdjustModal from "@/components/safe-adjust-modal";

const STAT_CONFIG = [
  {
    key: "totalBalance",
    label: "Saldo total no Cofre",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
] as const;

type SafeInfo = {
  totalBalance: string,
  lastUpdate: string,
}

const euro = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  });

export default function SafePage() {
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [safeData, setSafeData] = useState<SafeInfo>({
    totalBalance: "0.00",
    lastUpdate: ""
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

  const STATS = STAT_CONFIG.map((s) => {
    const bal = safeData[s.key];
    const value = Number(bal);
    const negative = value < 0;
    return {
      ...s,
      val: euro.format(value),
      color: negative ? "text-rose-600" : s.color,
      bgColor: negative ? "bg-rose-50" : s.bgColor,
    };
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Título & Ações Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-blue-600" />
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

        {/* 1. CARTÕES DE MÉTRICAS DETALHADAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stat.val}</div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
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