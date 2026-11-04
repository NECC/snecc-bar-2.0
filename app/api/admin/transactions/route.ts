import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  try {
    // 1. Verificação de Autenticação e Permissão de ADMIN
    if (!req.auth) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (req.auth.user?.type !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // 2. Transações de Saldo/Balanço (Carregamento / Retirar)
    const balanceTransactions = await prisma.balanceTransaction.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        handler: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const balance_formmated = balanceTransactions.map((transaction) => ({
      id: transaction.id,
      user: transaction.user?.email ?? "Sem utilizador",
      handler: transaction.handler?.email ?? "Sistema",
      type: transaction.type,
      amount: Number(transaction.amount),
      date: transaction.date,
    }));

    // 3. Transações de Compras (Stock + Product)
    const purchaseTransactions = await prisma.purchaseTransaction.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        product_v: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const purchase_formmated = purchaseTransactions.map((transaction) => ({
      id: transaction.id,
      user: transaction.user?.email ?? "Sem utilizador",
      price: Number(transaction.product_v?.price ?? 0),
      item: transaction.product_v?.product?.name ?? "Item indisponível",
      date: transaction.date,
    }));

    return NextResponse.json(
      { b_transactions: balance_formmated, p_transactions: purchase_formmated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro interno na rota /api/admin/transactions:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor ao carregar transações." },
      { status: 500 }
    );
  }
});