"use client";

import { useState } from "react";
import { Tag, Calendar, Clock, ShoppingBag } from "lucide-react";

export interface Compra {
  id: string;
  name: string;
  image: string;
  price: number;
  date: string;
  type: string;
}

interface OrdersViewProps {
  compras: Compra[];
}

const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

const formatAmount = (cents: number) => euro.format(cents / 100);

export default function OrdersView({ compras }: OrdersViewProps) {
  const [subAba, setSubAba] = useState<"compras" | "saldo">("compras");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const formatarData = (isoString: string) => {
    const d = new Date(isoString);
    return {
      data: d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }),
      hora: d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Ordena as compras por data decrescente (mais recentes no topo) e limita às últimas 5
  const ultimasCompras = [...compras]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <main className="flex-1 min-w-0 max-w-3xl mx-auto w-full px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Histórico
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Consulta as tuas últimas movimentações e compras no bar
          </p>
        </div>

        {/* Botão de Aba / Filtro */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setSubAba("compras")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              subAba === "compras"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            Compras de Snacks
          </button>
        </div>
      </div>

      {/* Lista de Compras */}
      {subAba === "compras" && (
        <div className="space-y-3">
          {ultimasCompras.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-semibold">
                Ainda não efetuaste nenhuma compra.
              </p>
            </div>
          ) : (
            ultimasCompras.map((item) => {
              const { data, hora } = formatarData(item.date);
              const hasImageError = failedImages[item.id] || !item.image;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between gap-4"
                >
                  {/* Imagem + Nome e Detalhes */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {!hasImageError ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={() => handleImageError(item.id)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">
                        {item.name}
                      </h4>

                      <div className="flex items-center gap-3 text-slate-400 text-xs mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {data}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {hora}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* do Preço */}
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 font-black text-sm md:text-base">
                      -{formatAmount(item.price)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </main>
  );
}