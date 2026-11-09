import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can view safe balance" }, { status: 403 });
  }

  try {
    let safe = await prisma.safe.findFirst();
    if (!safe) {
      safe = await prisma.safe.create({
        data: {
          balance: 0,
        },
      });
    }

    // 1. Calcular o saldo total de todos os utilizadores
    const userBalancesSum = await prisma.user.aggregate({
      _sum: {
        balance: true,
      },
    });

    const totalUserBalances = userBalancesSum._sum.balance ?? 0;

    // 2. Disponível para compras = Saldo do Cofre - Saldo dos Utilizadores
    const availableForShopping = safe.balance - totalUserBalances;

    return NextResponse.json({
      totalBalance: safe.balance.toString(),
      totalUserBalances: totalUserBalances.toString(),
      availableForShopping: availableForShopping.toString(),
      lastUpdate: safe.last_updated,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching safe balance:", error);
    return NextResponse.json({ message: "Error fetching safe balance" }, { status: 500 });
  }
});