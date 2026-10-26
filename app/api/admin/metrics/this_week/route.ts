import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

async function getWeekMetrics(start: Date, end: Date) {
  const [profitRows, balanceRows, lost] = await Promise.all([
    prisma.$queryRaw<{ profit: string }[]>`
      SELECT COALESCE(SUM(p.price - p.acquisition_cost), 0)::text AS profit
      FROM (
        SELECT CASE pt.user_type
                 WHEN 'SOCIO'   THEN s.socio_price
                 WHEN 'N_SOCIO' THEN s.nsocio_price
               END AS price,
               s.acquisition_cost
        FROM "PurchaseTransaction" pt
        JOIN "Stock" s ON s.id = pt.product_v_id
        WHERE pt.date >= ${start} AND pt.date < ${end}
      ) p
      WHERE p.price IS NOT NULL
    `,

    // Sum of all user balances as of `end`, rebuilt from the ledger
    prisma.$queryRaw<{ balance: string }[]>`
      SELECT (
        (SELECT COALESCE(SUM(bt.amount), 0)
         FROM "BalanceTransaction" bt
         WHERE bt.date < ${end})
        -
        (SELECT COALESCE(SUM(s.acquisition_cost * (s.quantity + COALESCE(sold.cnt, 0) + COALESCE(lost.cnt, 0))), 0)
        FROM "Stock" s 
        LEFT JOIN (
          SELECT product_v_id, COUNT(*) as cnt
          FROM "PurchaseTransaction" 
          GROUP BY product_v_id
        ) sold ON sold.product_v_id = s.id
        LEFT JOIN (
          SELECT stock_id, COUNT(*) as cnt
          FROM "LostStock"
          GROUP BY stock_id
        ) lost ON lost.stock_id = s.id
        WHERE s."createdAt" < ${end})
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
    totalBalance: new Prisma.Decimal(balanceRows[0].balance).toFixed(2),
    profit: profit.toFixed(2),
    losses: losses.toFixed(2),
    netProfit: profit.sub(losses).toFixed(2),
  };
}

const pctChange = (cur: string, prev: string): number | null => {
  const p = new Prisma.Decimal(prev);
  const c = new Prisma.Decimal(cur);
  if (p.isZero()) return c.gt(0) ? 100 : c.isZero() ? 0 : -100;
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

  const keys = ["totalBalance", "profit", "losses", "netProfit"] as const;

  const stats = Object.fromEntries(
    keys.map((k) => [
      k,
      { current: current[k], change: pctChange(current[k], previous[k]) },
    ])
  ) as Record<(typeof keys)[number], { current: string; change: number | null }>;

  return NextResponse.json({ stats }, { status: 200 });
});
