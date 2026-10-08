import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

async function getWeekMetrics(start: Date, end: Date) {
  const [profitRows, balanceRows, lost] = await Promise.all([
    prisma.$queryRaw<{ profit: string }[]>`
      SELECT COALESCE(SUM(p.price - p.acquisition_cost), 0)::text AS profit
      FROM (
        SELECT CASE u."type"
                 WHEN 'SOCIO'   THEN s.socio_price
                 WHEN 'N_SOCIO' THEN s.nsocio_price
               END AS price,
               s.acquisition_cost
        FROM "PurchaseTransaction" pt
        JOIN "User"  u ON u.id = pt.user_id
        JOIN "Stock" s ON s.id = pt.product_v_id
        WHERE pt.date >= ${start} AND pt.date < ${end}
      ) p
      WHERE p.price IS NOT NULL
    `,

    // Sum of all user balances as of `end`, rebuilt from the ledger
    prisma.$queryRaw<{ balance: string }[]>`
      SELECT (
        (SELECT COALESCE(SUM(
                  CASE bt.type
                    WHEN 'CARREGAR' THEN bt.amount
                    WHEN 'RETIRAR'  THEN -bt.amount
                  END), 0)
         FROM "BalanceTransaction" bt
         WHERE bt.date < ${end})
        -
        (SELECT COALESCE(SUM(
                  CASE u."type"
                    WHEN 'SOCIO'   THEN s.socio_price
                    WHEN 'N_SOCIO' THEN s.nsocio_price
                  END), 0)
         FROM "PurchaseTransaction" pt
         JOIN "User"  u ON u.id = pt.user_id
         JOIN "Stock" s ON s.id = pt.product_v_id
         WHERE pt.date < ${end})
      )::text AS balance
    `,

    prisma.lostStock.findMany({
      where: { date: { gte: start, lt: end } },
      select: { stock: { select: { acquisition_cost: true } } },
    }),
  ]);

  const profit = new Prisma.Decimal(profitRows[0].profit);
  const losses = lost.reduce(
    (total, item) => total.add(item.stock.acquisition_cost),
    new Prisma.Decimal(0)
  );

  return {
    totalUserBalance: new Prisma.Decimal(balanceRows[0].balance).toFixed(2),
    profit: profit.toFixed(2),
    losses: losses.toFixed(2),
    netProfit: profit.sub(losses).toFixed(2),
  };
}

const pctChange = (cur: string, prev: string): number | null => {
  const p = new Prisma.Decimal(prev);
  const c = new Prisma.Decimal(cur);
  if (p.isZero()) return c > new Prisma.Decimal(0.0) ? 100 : c.isZero() ? 0 : -100;
  return c
    .sub(p)
    .div(p.abs())
    .mul(100)
    .toDecimalPlaces(1)
    .toNumber();
};

export const GET = auth(async function GET(req) {
  // exemplo de rota protegida ver mais em https://authjs.dev/getting-started/session-management/protecting
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can access this resource" }, { status: 403 });
  }

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfPreviousWeek = new Date(startOfWeek);
  startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);

  const endOfPreviousWeek = new Date(endOfWeek);
  endOfPreviousWeek.setDate(endOfPreviousWeek.getDate() - 7);


  const [current, previous] = await Promise.all([
    getWeekMetrics(startOfWeek, endOfWeek),
    getWeekMetrics(startOfPreviousWeek, startOfWeek),
  ]);

  const keys = ["totalUserBalance", "profit", "losses", "netProfit"] as const;

  const stats = Object.fromEntries(
    keys.map((k) => [
      k,
      { current: current[k], change: pctChange(current[k], previous[k]) },
    ])
  ) as Record<(typeof keys)[number], { current: string; change: number | null }>;

  return NextResponse.json({ stats }, { status: 200 });
});
