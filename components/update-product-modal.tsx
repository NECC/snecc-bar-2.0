"use client";

import { useState } from "react";
import { X, Package, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productIDs: { id: string; name: string }[];
}

export default function AddStockModal({ isOpen, onClose, productIDs }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    precoSocio: "",
    precoNaoSocio: "",
    precoAquisicao: "",
    stock: "",
    p_id: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/products/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const data = await response.json();
      toast.success(data.message);
      setFormData({
        precoSocio: "",
        precoNaoSocio: "",
        precoAquisicao: "",
        stock: "",
        p_id: "",
      });
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product");
    } finally {
      setLoading(false);
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
          <div className="gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Escolher Produto</label>
              <select
                required
                value={formData.p_id}
                onChange={(e) => setFormData({ ...formData, p_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              >
                <option value="">Selecione um produto</option>
                {productIDs.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-3">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Preço Aquisição (€)</label>
              <input
                type="number"
                step="0.05"
                required
                placeholder="0.10"
                value={formData.precoAquisicao}
                onChange={(e) => setFormData({ ...formData, precoAquisicao: e.target.value })}
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