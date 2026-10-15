"use client";

import { useState, useEffect } from "react";
import RechargeModal from "@/components/recharge-modal";
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search,
  Receipt
} from "lucide-react";

type Transaction = {
  id: string,
  email: string,
  item: string | null,
  type: string,
  amount: string,
  date: string,
  admin: string | null,
}

const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"TODAS" | "Carregamento" | "Compra" | "Ajuste">("TODAS");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const getTransactionsData = async () => {
    try {
      setTransactions([]);
      const response = await fetch("/api/admin/transactions", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch transactions data");
      }
      const data = await response.json();
      const fromBalance = (data.b_transactions ?? []).map((tx: any) => ({
        id: `b-${tx.id}`,
        email: tx.user,
        item: null,
        type: tx.type == "RETIRAR" ? "Ajuste" : "Carregamento",
        amount: euro.format(tx.amount),
        admin: tx.handler,
        date: tx.date.toLocaleString("pt-PT", { timeZone: "UTC" }),
      }));

      const fromPurchase = (data.p_transactions ?? []).map((tx: any) => ({
        id: `p-${tx.id}`,
        email: tx.user,
        item: tx.item,
        type: "Compra",
        amount: euro.format(tx.amount),
        admin: null,
        date: tx.date.toLocaleString("en-GB", { timeZone: "UTC" }),
      }));

      setTransactions([...fromBalance, ...fromPurchase]);
    } catch (error) {
      console.error("Error fetching transactions data:", error);
    }
  };

  useEffect(() => {
    getTransactionsData();
  }, []);
  

  // Filtro dinâmico por texto (pesquisa por nome, email ou produto/depósito) e tipo
  const filteredTransactions = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      tx.email.toLowerCase().includes(q) ||
      (tx.admin && tx.admin.toLowerCase().includes(q)) ||
      (tx.item && tx.item.toLowerCase().includes(q));

    const matchesType = selectedType === "TODAS" || tx.type === selectedType;

    return matchesQuery && matchesType;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-white text-slate-800 dark:text-slate-800 flex flex-col pb-20 md:pb-0 transition-colors duration-300">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Título & Ações Rápidas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-900 tracking-tight flex items-center gap-2.5">
              <Receipt className="w-7 h-7 text-blue-600" />
              Transações Realizadas
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-500 mt-1">
              Consulta e pesquisa o histórico completo de compras, depósitos e ajustes do bar
            </p>
          </div>
        </div>

        {/* Painel do Histórico Completo de Transações */}
        <div className="bg-white dark:bg-white rounded-3xl p-6 border border-slate-200 dark:border-slate-200 shadow-sm space-y-5">
          
          {/* Header da Tabela com Pesquisa & Filtro */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-900">
                Histórico ({filteredTransactions.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Registo detalhado das movimentações de saldo no sistema
              </p>
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
                  className="w-full bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-800 focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              {/* Seletor do Tipo de Transação */}
              <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {(["TODAS", "Carregamento", "Compra", "Ajuste"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer whitespace-nowrap border ${
                      selectedType === type
                        ? "bg-slate-900 dark:bg-slate-900 text-white dark:text-white border-slate-900"
                        : "bg-white dark:bg-white text-slate-600 dark:text-slate-600 border-slate-200 dark:border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-50"
                    }`}
                  >
                    {type === "TODAS" ? "Todas" : type === "Carregamento" ? "Depósitos" : type === "Compra" ? "Compras" : "Ajustes"}
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
                      tx.type === "Carregamento" 
                        ? "bg-emerald-100 dark:bg-emerald-100 text-emerald-700 dark:text-emerald-700" 
                        : tx.type === "AJUSTE"
                        ? "bg-rose-100 dark:bg-rose-100 text-rose-700 dark:text-rose-700"
                        : "bg-blue-100 dark:bg-blue-100 text-blue-700 dark:text-blue-700"
                    }`}>
                      {tx.type === "Carregamento" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-800 text-sm">
                        {tx.email} <span className={`font-normal text-xs text-slate-500 dark:text-slate-500 ${!tx.item ? "hidden" : ""}`}>({tx.item})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className={`${!tx.item ? "hidden" : ""}`}>{tx.item} •</span>
                        <span>{tx.date}</span>
                        <span className={`${!tx.admin ? "hidden" : ""}`}>• Responsável: {tx.admin}</span>
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
    </div>
  );
}