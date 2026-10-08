"use client";

import { useState, useEffect } from "react";
import MobileFooter from "@/components/mobile-footer";
import RechargeModal from "@/components/recharge-modal";
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

// Dados temporais estendidos (12 meses para demonstrar o fluxo completo)
const ALL_METRICS_TIMELINE = [
  { mes: "Nov 25", saldoTotal: 180.00, lucro: 22.40, perdas: 3.80 },
  { mes: "Dez 25", saldoTotal: 210.00, lucro: 28.50, perdas: 2.10 },
  { mes: "Jan 26", saldoTotal: 195.00, lucro: 18.20, perdas: 4.00 },
  { mes: "Fev 26", saldoTotal: 230.50, lucro: 31.00, perdas: 1.20 },
  { mes: "Mar 26", saldoTotal: 260.00, lucro: 34.80, perdas: 2.50 },
  { mes: "Abr 26", saldoTotal: 245.00, lucro: 29.10, perdas: 3.10 },
  { mes: "Mai 26", saldoTotal: 280.00, lucro: 35.20, perdas: 1.50 },
  { mes: "Jun 26", saldoTotal: 310.50, lucro: 42.80, perdas: 0.80 },
  { mes: "Jul 26", saldoTotal: 350.00, lucro: 48.10, perdas: 2.10 },
  { mes: "Ago 26", saldoTotal: 320.00, lucro: 39.50, perdas: 4.50 },
  { mes: "Set 26", saldoTotal: 395.20, lucro: 55.40, perdas: 1.20 },
  { mes: "Out 26", saldoTotal: 428.50, lucro: 64.10, perdas: 3.20 },
];

export default function AnalyticsPage() {
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"12M" | "6M" | "3M" | "1M">("6M");

  const [userData, setUserData] = useState<{
    nome: string;
    isSocio: boolean;
    isAdmin: boolean;
    saldo: number;
  }>({
    nome: "Administrador",
    isSocio: true,
    isAdmin: true,
    saldo: 0.00,
  });

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do utilizador:", error);
      }
    }
    getUserData();
  }, []);

  // Filtragem dinâmica do intervalo temporal selecionado
  const getFilteredData = () => {
    switch (timeRange) {
      case "1M":
        return ALL_METRICS_TIMELINE.slice(-1);
      case "3M":
        return ALL_METRICS_TIMELINE.slice(-3);
      case "6M":
        return ALL_METRICS_TIMELINE.slice(-6);
      case "12M":
      default:
        return ALL_METRICS_TIMELINE;
    }
  };

  const chartData = getFilteredData();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Título & Ações Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              Métricas e Estatísticas
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Análise detalhada de saldo acumulado, lucros das vendas e perdas
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Seletor de Período Dinâmico */}
            <div className="bg-white border border-slate-200/80 p-1 rounded-xl flex items-center gap-1 shadow-sm">
              {(["1M", "3M", "6M", "12M"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timeRange === range
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. CARTÕES DE MÉTRICAS DETALHADAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card: Total Saldo Utilizadores */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Saldo Utilizadores</span>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">428.50€</div>
              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>+8.4% em relação ao mês anterior (Set 26)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Soma acumulada das contas de todos os sócios ativos.</p>
          </div>

          {/* Card: Lucro */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lucro Líquido</span>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">64.10€</div>
              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>+15.7% este mês (Out 26)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Margem gerada entre o custo de aquisição e preço final.</p>
          </div>

          {/* Card: Perdas */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perdas & Validade</span>
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">3.20€</div>
              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-rose-600">
                <ArrowDownRight className="w-4 h-4" />
                <span>-2.1% (redução de desperdício)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Produtos fora do prazo de validade ou danificados.</p>
          </div>

        </div>

        {/* 2. GRÁFICO PRINCIPAL: Evolução do Saldo Total */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Evolução do Saldo Global dos Utilizadores</h2>
              <p className="text-xs text-slate-400">Total acumulado na carteira virtual dos sócios ao longo do tempo ({timeRange})</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(val) => `${val}€`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "1rem", color: "#fff", border: "none" }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)}€`, "Saldo Total"]}
                />
                <Area type="monotone" dataKey="saldoTotal" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. GRÁFICO COMPARATIVO: Lucro vs Perdas */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Comparativo: Lucro vs. Perdas</h2>
              <p className="text-xs text-slate-400">Relação mensal entre os lucros obtidos e o valor de produtos perdidos ({timeRange})</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(val) => `${val}€`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "1rem", color: "#fff", border: "none" }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)}€`]}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="lucro" name="Lucro (€)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="perdas" name="Perdas (€)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>

      {/* Modal de Carregamento */}
      <RechargeModal 
        isOpen={rechargeModalOpen} 
        onClose={() => setRechargeModalOpen(false)} 
      />

    </div>
  );
}