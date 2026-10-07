"use client";

import { TextAlignJustify, Minus } from "lucide-react";
import { useState } from "react";

export interface Stock {
  id: string;
  socio_price: string;
  nsocio_price: string;
  acquisition_cost: string;
  quantity: number;
  acquisition_date: string;
  lost: number;
  parcel_number: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  stock: Stock[];
}


interface ProductsViewProps {
  products: Product[];
  lostStock: (id: string) => void;
}


export default function ProductsView({ products, lostStock }: ProductsViewProps) {

    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

    const toggleProductDetails = (productId: string) => {
      setExpandedProductId((prevId) => (prevId === productId ? null : productId));
    };

    return (
        <div className="divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id}>
              <div className="py-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-28 h-20 md:w-36 md:h-24 shrink-0 rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <div> 
                    <div className="font-bold text-lg text-slate-800 truncate">{product.name}</div>
                    <div className="text-sm text-slate-400">Stock total: {product.stock ? product.stock.reduce((total, item) => total + item.quantity, 0) : 0}</div>
                  </div>
                </div>

                <button
                  onClick={() => lostStock(product.id)}
                  aria-label="Hide product details"
                  aria-expanded={true}
                  className="mr-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                            bg-red-50 text-red-600 ring-1 ring-inset ring-red-200
                            transition duration-150
                            hover:bg-red-500 hover:text-white hover:ring-red-500
                            active:scale-95
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  <Minus size={20} strokeWidth={2} />
                </button>
                <button
                  onClick={() => toggleProductDetails(product.id)}
                  aria-label="Show product details"
                  aria-expanded={false}
                  className={`mr-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset
                  transition duration-150 active:scale-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2
                  ${product.id === expandedProductId
                    ? "bg-slate-700 text-white ring-slate-700"
                    : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-700 hover:text-white hover:ring-slate-700"}`}
                >
                  <TextAlignJustify size={20} strokeWidth={2}/>
                </button>
              </div>
              <div className={`px-4 pb-4 ${expandedProductId === product.id ? 'block' : 'hidden'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-slate-400">
                    <thead>
                      <tr className="border-b border-slate-700 text-left text-slate-600">
                        <th className="py-2 pr-4 font-medium">Parcela número</th>
                        <th className="py-2 pr-4 font-medium">Data de Aquisição</th>
                        <th className="py-2 pr-4 font-medium">Stock restante</th>
                        <th className="py-2 pr-4 font-medium">Stock perdido</th>
                        <th className="py-2 pr-4 font-medium">Preço Sócio</th>
                        <th className="py-2 pr-4 font-medium">Preço N/Sócio</th>
                        <th className="py-2 font-medium">Preço Aquisição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.stock.map((stock) => (
                        <tr key={stock.id} className="border-b border-slate-800 last:border-0">
                          <td className="py-1 pr-4">{stock.parcel_number}</td>
                          <td className="py-1 pr-4">{stock.acquisition_date}</td>
                          <td className="py-1 pr-4">{stock.quantity}</td>
                          <td className="py-1 pr-4">{stock.lost}</td>
                          <td className="py-1 pr-4">€{Number.parseFloat(stock.socio_price).toFixed(2)}</td>
                          <td className="py-1 pr-4">€{Number.parseFloat(stock.nsocio_price).toFixed(2)}</td>
                          <td className="py-1">€{Number.parseFloat(stock.acquisition_cost).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
        )

}