"use client";

import { useMemo, useState } from "react";
import { X, Search, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SafeAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // e.g. refetch safe balance
}

export default function SafeAdjustModal({
  isOpen,
  onClose,
  onSuccess,
}: SafeAdjustModalProps) {
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [subtract, setSubtract] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setQuery("");
    setAmount("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);

    try {
      const response = await fetch(subtract ? "/api/admin/safe/subtract" : "/api/admin/safe/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: amount }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Falha ao atualizar saldo do cofre");
      }

      toast.success("Saldo do cofre atualizado com sucesso");
      onSuccess?.();
      resetAndClose();
    } catch (error) {
      console.error("Error adjusting balance:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao ajustar saldo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative p-6">
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl ${!subtract ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Ajustar Saldo do Cofre
              </h3>
              <p className="text-xs text-slate-400">
                Adicionar ou remover saldo do cofre
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passo 2: Inserir Montante e Confirmar */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSubtract(false)}
                type="button"
                className={`w-full ${!subtract ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-white-300 text-emerald-500 border-2 border-emerald-600"} active:scale-[0.98] px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition flex items-center gap-2 cursor-pointer`}
              >
                  Adicionar
              </button>
              <button
                onClick={() => setSubtract(true)}
                type="button"
                className={`w-full ${subtract ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-white-300 text-rose-500 border-2 border-rose-600"} active:scale-[0.98] px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition flex items-center gap-2 cursor-pointer`}
              >
                Remover
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Montante a {subtract ? "Remover" : "Carregar"} (€)
              </label>

              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="Ex: 7.50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading || !amount}
                className={`${subtract ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"} mx-auto w-1000 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>
                  Confirmar ({subtract ? "-" : "+"}{amount ? Number(amount).toFixed(2) : "0.00"}€)
                </span>
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}