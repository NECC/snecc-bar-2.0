"use client";

import { useState } from "react";
import { Tag, CreditCard, Calendar, Clock, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export interface CompraItem {
  id: string;
  produtoNome: string;
  produtoImagem: string;
  bay: string;
  precoPago: number;
  data: string;
  estatutoNaAltura: string;
}


interface OrdersViewProps {
  compras: CompraItem[];
}

export default function OrdersView({ compras }: OrdersViewProps) {
  const [subAba, setSubAba] = useState<"compras" | "saldo">("compras");

  const formatarData = (isoString: string) => {
    const d = new Date(isoString);
    return {
      data: d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }),
      hora: d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <main className="flex-1 min-w-0 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Histórico
        </h1>
      </div>

      {/* Alternador */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl mb-6 max-w-md">
        <button
          onClick={() => setSubAba("compras")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            subAba === "compras" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Tag className="w-4 h-4" />
          Compras de Snacks
        </button>
      </div>

      {/* Compras de Snacks */}
      {subAba === "compras" && (
        <div className="space-y-3">
          {compras.map((item) => {
            const { data, hora } = formatarData(item.data);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4 transition hover:border-slate-300"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.produtoImagem}
                    alt={item.produtoNome}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">
                        {item.produtoNome}
                      </h4>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0">
                        {item.bay}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-xs mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {data}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {hora}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm md:text-base font-extrabold text-slate-900">
                    -{item.precoPago.toFixed(2)}€
                  </div>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {item.estatutoNaAltura}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Movimentos de Saldo */}
      {/*{subAba === "saldo" && (
        <div className="space-y-3">
          {movimentosSaldo.map((item) => {
            const { data, hora } = formatarData(item.data);
            const isCarregar = item.type === "CARREGAR";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCarregar ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {isCarregar ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isCarregar ? "Carregamento de Saldo" : "Retirada de Saldo"}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Efetuado por: <span className="font-semibold text-slate-700">{item.responsavel}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm md:text-base font-extrabold ${isCarregar ? "text-emerald-600" : "text-rose-600"}`}>
                    {isCarregar ? "+" : "-"}{item.montante.toFixed(2)}€
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {data} às {hora}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}*/}
    </main>
  );
}