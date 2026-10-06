import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";
import { 
  CreditCard, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingDown,
  DollarSign,
  Package
} from "lucide-react";

// Novas Métricas Atualizadas
const STATS = [
  { 
    label: "Total Saldo Utilizadores", 
    val: "428.50€", 
    icon: CreditCard, 
    change: "+12%",
    color: "text-blue-600",
    bgColor: "bg-blue-50" 
  },
  { 
    label: "Lucro", 
    val: "64.10€", 
    icon: DollarSign, 
    change: "+15%",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50" 
  },
  { 
    label: "Perdas", 
    val: "3.20€", 
    icon: TrendingDown, 
    change: "-2%",
    color: "text-rose-600",
    bgColor: "bg-rose-50" 
  },
];

const RECENT_TRANSACTIONS = [
  { id: "1", user: "João Silva", type: "CARREGAMENTO", amount: "+10.00€", date: "Hoje, 14:20", admin: "Admin Maria" },
  { id: "2", user: "Ana Costa", type: "COMPRA", amount: "-0.80€", date: "Hoje, 12:15", admin: "Sistema" },
  { id: "3", user: "Pedro Santos", type: "RETIRADA", amount: "-2.50€", date: "Ontem, 18:00", admin: "Admin João" },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  // Dados do utilizador para o Header
  const userData = {
    nome: session.user.name || session.user.email?.split("@")[0] || "Administrador",
    isSocio: true,
    saldo: 5.50,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">
      
      {/* HEADER UNIFICADO */}
      <Header user={userData} />

      {/* CONTEÚDO DA DASHBOARD */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        
        {/* Título & Ações Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Painel de Controlo
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Visão geral do sistema e gestão do bar para <strong className="text-slate-800">{session.user.email}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Carregar Saldo
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer">
              <Package className="w-4 h-4" />
              Gerir Stock
            </button>
          </div>
        </div>

        {/* Grelha de Métricas (4 Cartões) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  <div className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stat.val}</div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-2">
                    {stat.change} este mês
                  </span>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabela de Transações Recentes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Últimas Transações</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Ver Todas</button>
          </div>

          <div className="divide-y divide-slate-100">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    tx.type === "CARREGAMENTO" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : tx.type === "RETIRADA"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {tx.type === "CARREGAMENTO" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{tx.user}</div>
                    <div className="text-[10px] text-slate-400">{tx.date} • Resp: {tx.admin}</div>
                  </div>
                </div>

                <div className={`font-black text-sm ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER MOBILE */}
      <MobileFooter />

    </div>
  );
}