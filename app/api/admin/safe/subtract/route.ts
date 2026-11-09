import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const POST = auth(async function POST(req) {
  if (!req.auth || req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { balance } = body;

  const amount = Number.parseFloat(balance) * 100;

  if (balance === undefined || balance === null || balance === "") {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  if (amount === 0 || amount < 0) {
    return NextResponse.json({ message: "Amount must be a positive number." }, { status: 400 });
  }

  try {
    const safe = await prisma.safe.findFirst();
    const safeBalance = safe ? safe.balance : 0;

    // Somatório de saldos dos utilizadores
    const userBalanceAggregate = await prisma.user.aggregate({
      _sum: { balance: true },
    });
    const totalUsersBalance = userBalanceAggregate._sum.balance ?? 0;

    // Saldo máximo permitido para retirar (sem afetar o dinheiro reservado aos users)
    const maxSpendable = safeBalance - totalUsersBalance;

    if (amount > maxSpendable) {
      return NextResponse.json(
        { 
          message: `Não podes retirar mais do que a liquidez disponível (${maxSpendable.toFixed(2)}€). O restante dinheiro pertence aos utilizadores.` 
        },
        { status: 400 }
      );
    }

    await prisma.safe.update({
      where: { id: safe!.id },
      data: {
        balance: { decrement: amount },
        last_updated: new Date(),
      },
    });

    return NextResponse.json({ message: "Balance subtracted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error subtracting safe balance:", error);
    return NextResponse.json({ message: "Error subtracting safe balance" }, { status: 500 });
  }
});