"use client";

import { UserCheck, CreditCard, LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface ProfileViewProps {
  user: {
    nome: string;
    email?: string;
    isSocio: boolean;
    saldo: number;
    role?: string;
  };
}

export default function ProfileView({ user }: ProfileViewProps) {
  return (
    <main className="flex-1 min-w-0 max-w-2xl mx-auto w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* 1. Identificação do Utilizador */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md shadow-blue-200">
          {user.nome.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{user.nome}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              <UserCheck className="w-3.5 h-3.5" />
              {user.isSocio ? "Sócio Verificado" : "Não Sócio"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Cartão de Saldo */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Saldo na Conta
          </span>
          <div className="text-3xl font-black text-blue-600 mt-1">
            {user.saldo.toFixed(2)}€
          </div>
        </div>
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <CreditCard className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Ações da Conta */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <button 
          onClick={() => toast.success("Logout efetuado")} 
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
        >
          <LogOut className="w-4 h-4 hover:bg-red-500" />
          Terminar Sessão
        </button>
      </div>
    </main>
  );
}