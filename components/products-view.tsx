"use client";

import { TextAlignJustify } from "lucide-react";
import { useState } from "react";

export interface Stock {
  id: string;
  socio_price: number;
  nsocio_price: number;
  acquisition_price: number;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  stock: Stock[];
}


interface ProductsViewProps {
  products: Product[];
}


export default function ProductsView({ products }: ProductsViewProps) {

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

                <button onClick={() => toggleProductDetails(product.id)} className="font-black text-lg whitespace-nowrap shrink-0">
                  <TextAlignJustify className="inline-block mr-4" />
                </button>
              </div>
              <div className={`px-4 pb-4 ${expandedProductId === product.id ? 'block' : 'hidden'}`}>
                {product.stock.map((stock) => (
                  <div key={stock.id} className="text-sm text-slate-400">
                    {stock.quantity} unidades em stock
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )

}