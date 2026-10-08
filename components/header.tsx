"use client";

import { UtensilsCrossed, Receipt, CheckCircle2, LogOut, LayoutDashboard, UserShield } from "lucide-react";
import { LuUtensilsCrossed } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";
import { RiUserSearchLine } from "react-icons/ri";
import { GoGraph } from "react-icons/go";
import { signOutAction } from "@/app/actions/auth";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const pathsToNames: Record<string, string> = {
  "/products": "snacks",
  "/orders": "pedidos",
  "/dashboard": "dashboard",
  "/dashboard/products": "products",
  "/dashboard/users" : "users",
  "/dashboard/graficos" : "graficos"
};

interface User {
    isAdmin: boolean,
    isSocio: boolean,
    saldo: number
}

interface UserInterface {
    user: User
}

export default function Header(userInterface: UserInterface) {
    const pathname = usePathname()
    const abaAtiva = pathsToNames[pathname]
    const router = useRouter()
    const user = userInterface.user

    return (
    <div>
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2.5">
                    <div className="bg-blue-600 text-white font-extrabold text-bg p-2 rounded-xl shadow-md shadow-blue-200 hidden md:flex">
                        sNECC-Bar
                    </div>
                    <div className="bg-blue-600 text-white font-extrabold text-bg p-2 rounded-xl shadow-md shadow-blue-200 md:hidden">
                        sNECC Bar
                    </div>
                </div>
    
                {!user.isAdmin && 
                <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                    onClick={() => router.push("/products")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    abaAtiva === "snacks"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <LuUtensilsCrossed className="w-4 h-4"/>
                    Snacks
                </button>
                <button
                    onClick={() => router.push("/orders")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    abaAtiva === "pedidos"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <IoReceiptOutline className="w-4 h-4 "/>
                    Pedidos
                </button>
                </nav>
                }
                { user.isAdmin &&
                <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                    onClick={() => router.push("/dashboard")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    abaAtiva === "dashboard"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </button>
                
                <button
                    onClick={() => router.push("/dashboard/products")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    abaAtiva === "products"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Produtos
                </button>

                <button
                    onClick={() => router.push("/dashboard/users")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    abaAtiva === "users"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <RiUserSearchLine className="w-4 h-4" />
                    Users
                </button>

                <button
                    onClick={() => router.push("/dashboard/graficos")}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                    abaAtiva === "graficos"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <GoGraph className="w-4 h-4" />
                    Gráficos
                </button>
                </nav>}
            </div>
    
            {/* Canto Superior Direito */}
            {!user.isAdmin &&
            <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
                <span className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-1.5">
                    {user.isSocio && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 flex-shrink-0" />
                    )}
                </span>
    
                <div className="h-4 w-px bg-slate-200" />
    
                <span className="text-xs font-semibold text-slate-500">
                    Saldo: <strong className="text-blue-600 font-extrabold">{user.saldo.toFixed(2)}€</strong>
                </span>
                </div>
    
                
                <form action={signOutAction}>
                    <button type="submit" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition">
                        <LogOut className="w-5 h-5" />
                    </button>
                </form>
            </div>}

            {user.isAdmin &&
            <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
                <span className="font-bold text-xs md:text-sm text-slate-800 flex items-center gap-1.5">
                    <UserShield className="w-4 h-4 text-emerald-500 fill-emerald-100 flex-shrink-0" />
                </span>
    
                <div className="h-4 w-px bg-slate-200" />
    
                <span className="text-xs font-semibold text-slate-500">
                    Admin
                </span>
                </div>
    
                
                <form action={signOutAction}>
                    <button type="submit" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition">
                        <LogOut className="w-5 h-5" />
                    </button>
                </form>
            </div>}
            </header>
      </div>
    )
}