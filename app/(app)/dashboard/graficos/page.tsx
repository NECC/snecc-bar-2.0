"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown, 
  BarChart3, 
  Wallet
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

const STAT_CONFIG = [
  {
    key: "totalBalance",
    label: "Saldo total no Cofre",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    key: "profit",
    label: "Lucro",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    key: "losses",
    label: "Perdas",
    icon: TrendingDown,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    key: "netProfit",
    label: "Lucro Líquido",
    icon: Wallet,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
] as const;

type WeeklyMetrics = {
  weekStart: string,
  totalBalance: string,
  profit: string,
  losses: string,
  netProfit: string,
}

type Metrics = {
  totalBalance: {
    current: string,
    change: number,
  };
  profit: {
    current: string,
    change: number,
  };
  losses: {
    current: string,
    change: number,
  };
  netProfit: {
    current: string,
    change: number,
  };
};

const euro = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  });

const fmtChange = (v: number | null) => 
  v === null ? "—" : `${v > 0 ? "+" : ""}${v != 0 ? v + "%" : "Nenhuma mudança"} esta semana`;

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"ALL" | "12M" | "6M" | "3M" | "1M" | "3W" | "2W" >("1M");
  const timeRangeToText = {
    "ALL": "ao longo do tempo",
    "12M": "durante o último ano",
    "6M": "durante os últimos 6 meses",
    "3M": "durante os últimos 3 meses",
    "1M": "durante o último mês",
    "3W": "durante as últimas 3 semanas",
    "2W": "durante as últimas 2 semanas"
  }
  const [weeklyMetricsData, setWeeklyMetricsData] = useState<WeeklyMetrics[]>([]);
  const [metricsData, setMetricsData] = useState<Metrics>({
      totalBalance: {
        current: "0.00",
        change: 0.00,
      },
      profit: {
        current: "0.00",
        change: 0.00,
      },
      losses: {
        current: "0.00",
        change: 0.00,
      },
      netProfit: {
        current: "0.00",
        change: 0.00,
      },
    });
  
    const getMetricsData = async () => {
      try {
        const general_response = await fetch("/api/admin/metrics/this_week");
        if (!general_response.ok) {
          throw new Error("Failed to fetch general metrics data");
        }
        const data = await general_response.json();
        setMetricsData(data.stats);

        const weekly_response = await fetch("/api/admin/metrics/full");
        if (!weekly_response.ok) {
          throw new Error("Failed to fetch metrics data by week")
        }
        const weekly_data = await weekly_response.json();
        setWeeklyMetricsData(weekly_data.weeks)
        // Update state with metrics data
      } catch (error) {
        console.error("Error fetching metrics data:", error);
      }
    };
  
    useEffect(() => {
      getMetricsData();
    }, []);
  
    const STATS = STAT_CONFIG.map((s) => {
      const { current, change } = metricsData[s.key];
      const value = Number(current);
      const negative = s.key === "netProfit" && value < 0;
      return {
        ...s,
        val: euro.format(value),
        change: fmtChange(change),
        color: negative ? "text-rose-600" : s.color,
        bgColor: negative ? "bg-rose-50" : s.bgColor,
      };
    });
  

  // Filtragem dinâmica do intervalo temporal selecionado
  const getFilteredData = () => {
    switch (timeRange) {
      case "2W":
        return weeklyMetricsData.slice(-2);
      case "3W":
        return weeklyMetricsData.slice(-3);
      case "1M":
        return weeklyMetricsData.slice(-4);
      case "3M":
        return weeklyMetricsData.slice(-12);
      case "6M":
        return weeklyMetricsData.slice(-36);
      case "12M":
        return weeklyMetricsData.slice(-52)
      default:
        return weeklyMetricsData;
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
              {(["2W", "3W", "1M", "3M", "6M", "12M", "ALL"] as const).map((range) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stat.val}</div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-2">
                    {stat.change != "0%" ? stat.change : "Nenhuma mudança"}
                  </span>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. GRÁFICO PRINCIPAL: Evolução do Saldo Total */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Evolução do Saldo do Cofre</h2>
              <p className="text-xs text-slate-400">Total acumulado no cofre do Snecc-Bar {timeRangeToText[timeRange]}</p>
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
                <XAxis dataKey="weekStart" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(val) => `${val}€`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "1rem", color: "#fff", border: "none" }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)}€`, "Saldo Total"]}
                />
                <Area type="monotone" dataKey="totalBalance" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
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
                <XAxis dataKey="weekStart" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(val) => `${val}€`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "1rem", color: "#fff", border: "none" }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)}€`]}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="profit" name="Lucro (€)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="losses" name="Perdas (€)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>

    </div>
  );
}