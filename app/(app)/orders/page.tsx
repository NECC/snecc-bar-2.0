"use client";

import { useEffect, useState } from "react";

import OrdersView, { Compra } from "@/components/orders-view";

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