"use client";

import { useEffect, useState } from "react";

import OrdersView, { Compra } from "@/components/orders-view";
import { toast } from "sonner";

const MOCK_COMPRAS = [
  {
    id: "tc-101",
    produtoNome: "Gomas Fini",
    produtoImagem: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=400",
    bay: "BAY-02",
    precoPago: 0.75,
    data: "2026-10-06T10:30:00Z",
    estatutoNaAltura: "Sócio",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Compra[]>([]);

  const getOrderData = async () => {
    try {
      const response = await fetch("/api/user/orders");
      const data = await response.json();
      if (response.ok) {
        console.log(data.orders)
        setOrders(data.orders);
      } else {
        console.error(`Failed to get orders:`, data?.message)
      }
    } catch (error) {
      console.error("Error getting the user's orders", error);
    }
  };

  useEffect(() => {
    getOrderData();
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col pb-20 md:pb-0">

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex gap-8">
            <OrdersView 
                compras={orders} 
            />
        </div>

        {/* BARRA INFERIOR TELEMÓVEL */}

    </div>
  );
}