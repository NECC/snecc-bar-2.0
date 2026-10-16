"use client";

import { useMemo, useState } from "react";
import { X, Search, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  type: "ADMIN" | "SOCIO" | "N_SOCIO";
  balance?: string;
  image?: string;
}

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSuccess?: () => void; // e.g. refetch the users list
}

const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

export default function RemoveModal({
  isOpen,
  onClose,
  users,
  onSuccess,
}: RemoveModalProps) {
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return users
      .filter((u) => u.type !== "ADMIN")
      .filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          u.name?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, users]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setQuery("");
    setAmount("");
    setSelectedUser(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ u_id: selectedUser.id, balance: amount }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Falha ao remover saldo");
      }

      toast.success("Ajuste realizado com sucesso");
      onSuccess?.();
      resetAndClose();
    } catch (error) {
      console.error("Error removing balance:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao remover saldo"
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
            <div className="bg-red-50 text-red-600 p-2.5 rounded-2xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Remover Saldo
              </h3>
              <p className="text-xs text-slate-400">
                Remover saldo a um sócio
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

        {/* Passo 1: Pesquisar Utilizador */}
        {!selectedUser ? (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Pesquisar Utilizador
            </label>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Nome ou email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {query.trim() && (
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                {results.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-semibold">
                    Nenhum utilizador encontrado.
                  </div>
                ) : (
                  results.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      className="w-full flex items-center justify-between gap-3 px-3.5 py-3 text-left hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-[11px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.email}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            u.email.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {u.name || u.email}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {u.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-slate-700 flex-shrink-0">
                        {euro.format(Number(u.balance ?? 0))}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* Passo 2: Inserir Montante e Confirmar */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {selectedUser.name || selectedUser.email}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {selectedUser.email}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-slate-400">Saldo Atual</div>
                <div className="text-xs font-black text-blue-600">
                  {euro.format(Number(selectedUser.balance ?? 0))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Montante a Retirar (€)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {["-2.00", "-5.00", "-10.00", "-20.00"].map((preset) => (
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
                    {preset}€
                  </button>
                ))}
              </div>

              <input
                type="number"
                step="0.01"
                max="-0.10"
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
                onClick={() => {
                  setSelectedUser(null);
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
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>
                  Confirmar {amount ? Number(amount).toFixed(2) : "0.00"}€
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}