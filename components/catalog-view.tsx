"use client";

import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";

export interface Product {
  id: string;
  nome: string;
  bay: string;
  precoSocio: number;
  precoNaoSocio: number;
  stock: number;
  imagem: string;
}

interface CatalogViewProps {
  products: Product[];
  isSocio: boolean;
  onConfirmarCompra: (produto: Product) => void;
}

export default function CatalogView({
  products,
  isSocio,
  onConfirmarCompra,
}: CatalogViewProps) {
  // Guarda apenas o produto que está a ser comprado no momento
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);

  const fecharModal = () => setProdutoSelecionado(null);

  const handleConfirmar = () => {
    if (produtoSelecionado) {
      onConfirmarCompra(produtoSelecionado);
      fecharModal();
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Produtos Disponíveis
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Clique num produto para iniciar a compra
        </p>
      </div>

      {/* Grelha de Produtos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
        {products.map((prod) => {
          const precoExibido = isSocio ? prod.precoSocio : prod.precoNaoSocio;

          return (
            <div
              key={prod.id}
              onClick={() => setProdutoSelecionado(prod)}
              className="group relative bg-white rounded-2xl p-3.5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between select-none active:scale-95"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="bg-slate-800 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  {prod.bay}
                </span>
                {prod.stock <= 3 && (
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {prod.stock} rest.
                  </span>
                )}
              </div>

              <div className="relative w-full h-32 md:h-36 bg-slate-50 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                <img
                  src={prod.imagem}
                  alt={prod.nome}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <h3 className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                  {prod.nome}
                </h3>
                <div className="flex items-baseline justify-between mt-1.5">
                  <span className="text-sm md:text-base font-extrabold text-blue-600">
                    {precoExibido.toFixed(2)}€
                  </span>
                  {isSocio && (
                    <span className="text-[11px] text-slate-400 line-through font-medium">
                      {prod.precoNaoSocio.toFixed(2)}€
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POP-UP / MODAL DE CONFIRMAÇÃO DIRETA */}
      {produtoSelecionado && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-4">
            
            {/* Imagem do Produto */}
            <div className="w-28 h-28 bg-slate-50 rounded-2xl p-2 border border-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={produtoSelecionado.imagem}
                alt={produtoSelecionado.nome}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Nome do Produto */}
            <div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 inline-block">
                {produtoSelecionado.bay}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                {produtoSelecionado.nome}
              </h3>
            </div>

            {/* Preço */}
            <div className="text-2xl font-black text-blue-600">
              {(isSocio ? produtoSelecionado.precoSocio : produtoSelecionado.precoNaoSocio).toFixed(2)}€
            </div>

            {/* Botões de Ação */}
            <div className="w-full flex gap-3 pt-2">
              <button
                onClick={fecharModal}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 transition flex items-center justify-center gap-1.5"
              >
                Confirmar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}