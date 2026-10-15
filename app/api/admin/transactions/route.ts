import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  // exemplo de rota protegida ver mais em https://authjs.dev/getting-started/session-management/protecting
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const balanceTransactions = await prisma.balanceTransaction.findMany({
    include: {
        user: {
            select: {
                email: true,
            }
        },
        handler: {
            select: {
                email: true,
            }
        }
    }
  });

  console.log(balanceTransactions)

  const balance_formmated = balanceTransactions.map(transaction => {
    return {
      id: transaction.id,
      user: transaction.user.email,
      handler: transaction.handler.email,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date.toLocaleString("pt-PT", {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}),
    };
  });

  const purchaseTransactions = await prisma.purchaseTransaction.findMany({
    include: {
        user: {
            select: {
                email: true,
                type: true,
            }
        },
        product_v: {
            include: {
                product: {
                  select: {
                    name: true,
                  }
                }
            }
        }
    }
  });

  const purchase_formmated = purchaseTransactions.map(transaction => {
    return {
      id: transaction.id,
      user: transaction.user.email,
      price: transaction.user.type == "SOCIO" ? transaction.product_v.socio_price : transaction.product_v.nsocio_price,
      item: transaction.product_v.product.name,
      date: transaction.date.toLocaleString("pt-PT"),
    };
  });

  return NextResponse.json({ b_transactions: balance_formmated, p_transactions: purchase_formmated }, { status: 200 });
});