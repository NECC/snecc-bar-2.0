"use client";

import { useState } from "react";
import { X, Package, Save, Loader2 } from "lucide-react";
import { saveProductAction } from "@/app/actions/dashboard";
import { toast } from "sonner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ isOpen, onClose }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    bay: "BAY-01",
    precoSocio: "",
    precoNaoSocio: "",
    stock: "",
    imagem: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await saveProductAction({
      nome: formData.nome,
      bay: formData.bay,
      precoSocio: parseFloat(formData.precoSocio),
      precoNaoSocio: parseFloat(formData.precoNaoSocio),
      stock: parseInt(formData.stock, 10),
      imagem: formData.imagem || undefined,
    });

    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setFormData({
        nome: "",
        bay: "BAY-01",
        precoSocio: "",
        precoNaoSocio: "",
        stock: "",
        imagem: "",
      });
      onClose();
    } else {
      toast.error(res.error || "Erro ao guardar o produto.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative p-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Gerir Stock & Produtos</h3>
              <p className="text-xs text-slate-400">Adicionar ou editar item no catálogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Produto</label>
              <input
                type="text"
                required
                placeholder="Ex: Guaraná Antarctica"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">BAY (Slot)</label>
              <input
                type="text"
                required
                placeholder="Ex: BAY-07"
                value={formData.bay}
                onChange={(e) => setFormData({ ...formData, bay: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preço Sócio (€)</label>
              <input
                type="number"
                step="0.05"
                required
                placeholder="0.80"
                value={formData.precoSocio}
                onChange={(e) => setFormData({ ...formData, precoSocio: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preço N/Sócio (€)</label>
              <input
                type="number"
                step="0.05"
                required
                placeholder="1.00"
                value={formData.precoNaoSocio}
                onChange={(e) => setFormData({ ...formData, precoNaoSocio: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantidade Stock</label>
              <input
                type="number"
                required
                placeholder="10"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL da Imagem</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imagem}
              onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Guardar Produto</span>
          </button>
        </form>

      </div>
    </div>
  );
}