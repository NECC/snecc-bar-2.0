"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";
import RechargeModal from "@/components/recharge-modal";
import { 
  CreditCard, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingDown,
  DollarSign,
  Wallet,
  Search,
  Filter
} from "lucide-react";

const STAT_CONFIG = [
  {
    key: "totalUserBalance",
    label: "Total Saldo Utilizadores",
    icon: CreditCard,
    color: "text-blue-600 dark:text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-50",
  },
  {
    key: "profit",
    label: "Lucro",
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-50",
  },
  {
    key: "losses",
    label: "Perdas",
    icon: TrendingDown,
    color: "text-rose-600 dark:text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-50",
  },
  {
    key: "netProfit",
    label: "Lucro Líquido",
    icon: Wallet,
    color: "text-violet-600 dark:text-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-50",
  },
] as const;

// Lista completa de transações do bar
const ALL_TRANSACTIONS = [
  { id: "1", user: "João Silva", email: "joao.silva@alunos.uminho.pt", item: "Depósito de Saldo", type: "CARREGAMENTO", amount: "+10.00€", date: "Hoje, 14:20", admin: "Admin Maria" },
  { id: "2", user: "Ana Costa", email: "ana.costa@alunos.uminho.pt", item: "Guaraná Antarctica", type: "COMPRA", amount: "-0.80€", date: "Hoje, 12:15", admin: "Sistema" },
  { id: "3", user: "Pedro Santos", email: "pedro.santos@gmail.com", item: "Ajuste", type: "AJUSTE", amount: "-2.50€", date: "Ontem, 18:00", admin: "Admin João" },
  { id: "4", user: "Afonso Martins", email: "afonso.martins8282@gmail.com", item: "Gomas Fini", type: "COMPRA", amount: "-0.75€", date: "Ontem, 16:10", admin: "Sistema" },
  { id: "5", user: "Mariana Lopes", email: "mariana.lopes@alunos.uminho.pt", item: "Depósito MBWay", type: "CARREGAMENTO", amount: "+20.00€", date: "09 Out, 11:30", admin: "Admin Maria" },
  { id: "6", user: "Carlos Eduardo", email: "carlos.eduardo@gmail.com", item: "Café Espresso", type: "COMPRA", amount: "-0.50€", date: "08 Out, 09:45", admin: "Sistema" },
  { id: "7", user: "Inês Ribeiro", email: "ines.ribeiro@alunos.uminho.pt", item: "Água Mineral 50cl", type: "COMPRA", amount: "-0.60€", date: "08 Out, 08:20", admin: "Sistema" },
];

type Metrics = {
  totalUserBalance: { current: string; change: number };
  profit: { current: string; change: number };
  losses: { current: string; change: number };
  netProfit: { current: string; change: number };
};

const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

const fmtChange = (v: number | null) => 
  v === null ? "—" : `${v > 0 ? "+" : ""}${v}% esta semana`;

export default function DashboardPage() {
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"TODAS" | "CARREGAMENTO" | "COMPRA" | "AJUSTE">("TODAS");

  const [metricsData, setMetricsData] = useState<Metrics>({
    totalUserBalance: { current: "0.00", change: 0.00 },
    profit: { current: "0.00", change: 0.00 },
    losses: { current: "0.00", change: 0.00 },
    netProfit: { current: "0.00", change: 0.00 },
  });

  const getMetricsData = async () => {
    try {
      const response = await fetch("/api/admin/metrics/this_week");
      if (!response.ok) {
        throw new Error("Failed to fetch metrics data");
      }
      const data = await response.json();
      setMetricsData(data.stats);
    } catch (error) {
      console.error("Error fetching metrics data:", error);
    }
  };

  useEffect(() => {
    getMetricsData();
  }, []);

  // Filtro dinâmico por texto e tipo
  const filteredTransactions = ALL_TRANSACTIONS.filter((tx) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      tx.user.toLowerCase().includes(q) ||
      tx.email.toLowerCase().includes(q) ||
      tx.item.toLowerCase().includes(q);

    const matchesType = selectedType === "TODAS" || tx.type === selectedType;

    return matchesQuery && matchesType;
  });

  const STATS = STAT_CONFIG.map((s) => {
    const { current, change } = metricsData[s.key];
    const value = Number(current);
    const negative = s.key === "netProfit" && value < 0;
    return {
      ...s,
      val: euro.format(value),
      change: fmtChange(change),
      color: negative ? "text-rose-600 dark:text-rose-600" : s.color,
      bgColor: negative ? "bg-rose-50 dark:bg-rose-50" : s.bgColor,
    };
  });

  return (
    <div className="min-h-screen bg-white dark:bg-white text-slate-800 dark:text-slate-800 flex flex-col pb-20 md:pb-0 transition-colors duration-300">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        {/* Título & Ações Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-900 tracking-tight">
              Painel de Controlo
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-500 mt-1">
              Visão geral do sistema e gestão do bar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setRechargeModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-200 dark:shadow-none transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Carregar Saldo
            </button>
          </div>
        </div>

        {/* Grelha de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white dark:bg-white p-5 rounded-2xl border border-slate-200 dark:border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-500">{stat.label}</span>
                  <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-900 mt-1">{stat.val}</div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-600 bg-slate-100 dark:bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-2 border border-slate-200 dark:border-slate-200">
                    {stat.change}
                  </span>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Histórico Completo de Transações */}
        <div className="bg-white dark:bg-white rounded-3xl p-6 border border-slate-200 dark:border-slate-200 shadow-sm space-y-5">
          
          {/* Header da Tabela com Pesquisa & Filtro */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-900">Todas as Transações</h2>
              <p className="text-xs text-slate-500 dark:text-slate-500">Histórico de compras, depósitos de saldo e ajustes</p>
            </div>

            {/* Controlo de Filtros */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              
              {/* Campo de Pesquisa por Email/Produto/Utilizador */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Pesquisar email ou produto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-white border border-slate-200 dark:border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-800 focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              {/* Seletor do Tipo de Transação */}
              <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {(["TODAS", "CARREGAMENTO", "COMPRA", "AJUSTE"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer whitespace-nowrap border ${
                      selectedType === type
                        ? "bg-slate-900 dark:bg-slate-900 text-white dark:text-white border-slate-900"
                        : "bg-white dark:bg-white text-slate-600 dark:text-slate-600 border-slate-200 dark:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-50"
                    }`}
                  >
                    {type === "TODAS" ? "Todas" : type === "CARREGAMENTO" ? "Depósitos" : type === "COMPRA" ? "Compras" : "Ajustes"}
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* Tabela de Resultados */}
          <div className="divide-y divide-slate-100 dark:divide-slate-100 overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                Nenhuma transação encontrada para os filtros aplicados.
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  
                  {/* Ícone, Nome/Email e Detalhes */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                      tx.type === "CARREGAMENTO" 
                        ? "bg-emerald-100 dark:bg-emerald-100 text-emerald-700 dark:text-emerald-700" 
                        : tx.type === "AJUSTE"
                        ? "bg-rose-100 dark:bg-rose-100 text-rose-700 dark:text-rose-700"
                        : "bg-blue-100 dark:bg-blue-100 text-blue-700 dark:text-blue-700"
                    }`}>
                      {tx.type === "CARREGAMENTO" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-800 text-sm">
                        {tx.user} <span className="font-normal text-xs text-slate-500 dark:text-slate-500">({tx.item})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{tx.email}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>Resp: {tx.admin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Valor Mapeado */}
                  <div className={`font-black text-sm whitespace-nowrap ${tx.amount.startsWith("+") ? "text-emerald-600 dark:text-emerald-600" : "text-slate-900 dark:text-slate-900"}`}>
                    {tx.amount}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      </main>

      {/* Modais da Dashboard */}
      <RechargeModal 
        isOpen={rechargeModalOpen} 
        onClose={() => setRechargeModalOpen(false)} 
      />
    </div>
  );
}