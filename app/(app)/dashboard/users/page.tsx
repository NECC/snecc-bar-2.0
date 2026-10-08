"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import MobileFooter from "@/components/mobile-footer";
import RechargeModal from "@/components/recharge-modal";
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Shield, 
  Plus, 
  Mail
} from "lucide-react";
import { toast } from "sonner";

interface UserItem {
  id: string;
  name: string;
  email: string;
  type: "ADMIN" | "SOCIO" | "N_SOCIO";
  saldo?: number;
  createdAt?: string;
}

const MOCK_USERS: UserItem[] = [
  { id: "1", name: "Afonso Martins", email: "afonso.martins8282@gmail.com", type: "ADMIN", saldo: 15.50 },
  { id: "2", name: "João Silva", email: "joao.silva@alunos.uminho.pt", type: "SOCIO", saldo: 5.50 },
  { id: "3", name: "Ana Costa", email: "ana.costa@alunos.uminho.pt", type: "SOCIO", saldo: 2.10 },
  { id: "4", name: "Pedro Santos", email: "pedro.santos@gmail.com", type: "N_SOCIO", saldo: 0.00 },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "SOCIO" | "N_SOCIO" | "ADMIN">("ALL");
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);

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

  const getUserData = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Erro ao procurar dados do utilizador:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Filtragem de utilizadores por texto e por cargo/tipo
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filterType === "ALL" || u.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* Título & Botão de Ação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users className="w-7 h-7 text-blue-600" />
              Gestão de Utilizadores
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Lista de sócios, não-sócios e administradores do bar
            </p>
          </div>

          <button 
            onClick={() => setRechargeModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Carregar Saldo
          </button>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { label: "Todos", value: "ALL" },
              { label: "Sócios", value: "SOCIO" },
              { label: "Não Sócios", value: "N_SOCIO" },
              { label: "Admins", value: "ADMIN" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  filterType === f.value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Utilizadores */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Utilizadores ({filteredUsers.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                Nenhum utilizador encontrado com os filtros aplicados.
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center flex-shrink-0">
                      {u.name ? u.name.slice(0, 2).toUpperCase() : u.email.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{u.name || "Sem Nome"}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {u.email}
                      </div>
                    </div>
                  </div>

                  {/* Badges de Tipo & Saldo */}
                  <div className="flex items-center gap-4">
                    {/* Badge do Tipo */}
                    {u.type === "ADMIN" && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <Shield className="w-3 h-3" /> ADMIN
                      </span>
                    )}
                    {u.type === "SOCIO" && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> SÓCIO
                      </span>
                    )}
                    {u.type === "N_SOCIO" && (
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <UserX className="w-3 h-3" /> NÃO SÓCIO
                      </span>
                    )}

                    {/* Saldo se disponível */}
                    {u.saldo !== undefined && (
                      <div className="text-right min-w-[70px]">
                        <div className="text-[10px] text-slate-400">Saldo</div>
                        <div className="font-extrabold text-slate-900">{u.saldo.toFixed(2)}€</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* Modal de Carregamento de Saldo */}
      <RechargeModal 
        isOpen={rechargeModalOpen} 
        onClose={() => setRechargeModalOpen(false)} 
      />

    </div>
  );
}