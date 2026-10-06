"use client";

import { UtensilsCrossed, Receipt, CheckCircle2, LogOut } from "lucide-react";
import { LuUtensilsCrossed } from "react-icons/lu";
import { IoReceiptOutline } from "react-icons/io5";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const pathsToNames: Record<string, string> = {
    "/products": "snacks",
    "/orders": "pedidos" 
}

export default function MobileFooter() {
    const pathname = usePathname()
    const abaAtiva = pathsToNames[pathname]
    const router = useRouter()

    return (
    <div>
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 py-2.5 px-6 flex justify-around items-center z-50 md:hidden">
            <button
                onClick={() => router.push("/products")}
                className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
                    abaAtiva === "snacks" ? "text-blue-600" : "text-slate-400"
                }`}
            >
                <UtensilsCrossed className="w-5 h-5" />
                <span>Snacks</span>
            </button>

            <button
                onClick={() => router.push("/orders")}
                className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition ${
                    abaAtiva === "pedidos" ? "text-blue-600" : "text-slate-400"
                }`}
            >
                <Receipt className="w-5 h-5" />
                <span>Pedidos</span>
            </button>
        </nav>
      </div>
    )
}