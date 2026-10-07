"use client";

import { useState } from "react";
import { X, Search, CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<{ name: string; email: string; balance: number } | null>(null);

  if (!isOpen) return null;

  // Mock de pesquisa rápida de utilizador
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    // Simulação de resultado encontrado
    setSelectedUser({
      name: "João Silva",
      email: query.includes("@") ? query : "joao.silva@alunos.uminho.pt",
      balance: 5.50,
    });
  };

  const handleConfirmRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount) return;

    alert(`Carregamento de ${parseFloat(amount).toFixed(2)}€ efetuado com sucesso para ${selectedUser.name}!`);
    
    // Reset do modal
    setQuery("");
    setAmount("");
    setSelectedUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative p-6">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-2xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Carregar Saldo</h3>
              <p className="text-xs text-slate-400">Adicionar saldo à conta de um sócio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passo 1: Pesquisar Utilizador */}
        {!selectedUser ? (
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pesquisar Sócio
              </label>
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="Email ou número de sócio..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition cursor-pointer"
            >
              <span>Procurar Utilizador</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Passo 2: Inserir Montante e Confirmar */
          <form onSubmit={handleConfirmRecharge} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-800">{selectedUser.name}</div>
                <div className="text-[11px] text-slate-400">{selectedUser.email}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Saldo Atual</div>
                <div className="text-xs font-black text-blue-600">{selectedUser.balance.toFixed(2)}€</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Montante a Carregar (€)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {["2.00", "5.00", "10.00", "20.00"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      amount === preset 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    +{preset}€
                  </button>
                ))}
              </div>

              <input
                type="number"
                step="0.01"
                min="0.10"
                required
                placeholder="Valor personalizado (Ex: 7.50)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar (+{amount ? parseFloat(amount).toFixed(2) : "0.00"}€)</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}