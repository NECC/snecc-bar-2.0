import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

// Função para calcular a sexta-feira da semana de uma determinada data
function getFridayOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay(); // 0: Dom, 1: Seg, ..., 5: Sex, 6: Sáb
  
  // Distância até à sexta-feira dessa semana
  const diff = 5 - (day === 0 ? 7 : day);
  
  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date;
}

// Formatação da chave de data (DD/MM/YYYY)
function formatDateKey(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const GET = auth(async function GET(req) {
  if (!req.auth || req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") === "daily" ? "daily" : "weekly";

  try {
    // 1. Obter todas as transações de compra com o preço do produto associado
    const purchases = await prisma.purchaseTransaction.findMany({
      include: {
        product_v: {
          select: { price: true },
        },
      },
      orderBy: { date: "asc" },
    });

    // 2. Obter todos os lotes de stock que têm unidades registradas como perdidas
    const stocksWithLosses = await prisma.stock.findMany({
      where: { lost: { gt: 0 } },
      select: {
        lost: true,
        acquisition_cost: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const map = new Map<
      string,
      { dateObj: Date; profit: Prisma.Decimal; losses: Prisma.Decimal }
    >();

    // 3. Acumular Lucros (Vendas) -> Converte cêntimos para Euros dividindo por 100
    for (const purchase of purchases) {
      const targetDate = period === "weekly" ? getFridayOfWeek(purchase.date) : new Date(purchase.date);
      const key = formatDateKey(targetDate);
      
      const rawPrice = purchase.product_v?.price ?? new Prisma.Decimal(0);
      const priceInEuros = new Prisma.Decimal(rawPrice).div(100);

      if (!map.has(key)) {
        map.set(key, {
          dateObj: targetDate,
          profit: new Prisma.Decimal(0),
          losses: new Prisma.Decimal(0),
        });
      }

      const current = map.get(key)!;
      current.profit = current.profit.add(priceInEuros);
    }

    // 4. Acumular Perdas (Lotes com unidades perdidas) -> Converte custo em cêntimos para Euros dividindo por 100
    for (const stock of stocksWithLosses) {
      const targetDate = period === "weekly" ? getFridayOfWeek(stock.createdAt) : new Date(stock.createdAt);
      const key = formatDateKey(targetDate);

      const rawCost = new Prisma.Decimal(stock.acquisition_cost);
      const totalLossInEuros = rawCost.div(100).mul(stock.lost);

      if (!map.has(key)) {
        map.set(key, {
          dateObj: targetDate,
          profit: new Prisma.Decimal(0),
          losses: new Prisma.Decimal(0),
        });
      }

      const current = map.get(key)!;
      current.losses = current.losses.add(totalLossInEuros);
    }

    // 5. Converter o Map num Array ordenado por data descendente (mais recentes primeiro)
    const sortedReport = Array.from(map.entries())
      .map(([key, data]) => {
        const difference = data.profit.minus(data.losses);
        return {
          dateLabel: key,
          timestamp: data.dateObj.getTime(),
          profit: Number(data.profit),
          losses: Number(data.losses),
          difference: Number(difference),
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ report: sortedReport }, { status: 200 });
  } catch (error) {
    console.error("Erro ao gerar relatório de lucros/perdas:", error);
    return NextResponse.json(
      { message: "Erro interno ao gerar relatório." },
      { status: 500 }
    );
  }
});