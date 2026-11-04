"use client";

import { useState } from "react";
import { X, ArrowDownRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface LostProduct {
    name: string;
    id: string;
    image: string;
    totalStock: number;
}

interface LostStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: LostProduct | null;
  onSuccess?: () => void; // e.g. refetch product data
}

export default function LostStockModal({
  isOpen,
  onClose,
  product,
  onSuccess
}: LostStockModalProps) {
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [multiple, setMultiple] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setQuery("");
    setAmount("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !product) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/products/stock/losses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p_id: product?.id, lost: amount }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Falha ao registar stock perdido");
      }

      toast.success("Stock perdido registado com sucesso");
      onSuccess?.();
      resetAndClose();
    } catch (error) {
      console.error("Error registering lost stock:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao registar stock perdido"
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
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Registar Stock Perdido
              </h3>
              <p className="text-xs text-slate-400">
                Remover stock perdido do produto selecionado
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
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {product?.name}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-slate-400">Stock Atual</div>
                <div className="text-xs font-black text-blue-600">
                  {product?.totalStock ?? 0}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Quantidade a Remover
              </label>

              <input
                type="number"
                step="1"
                min="1"
                required
                placeholder="Ex: 7"
                value={amount}
                onChange={(e) => {
                    setAmount(e.target.value)
                    setMultiple(parseInt(e.target.value) > 1)
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAmount("");
                }}
                disabled={loading}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading || !amount}
                className="bg-rose-600 hover:bg-rose-700 w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>
                  {amount ? ("Remover " + amount + " unidade" + (multiple ? "s" : "")) : "Escolha uma quantidade para remover"}
                </span>
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}