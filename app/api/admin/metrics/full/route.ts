import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json(
      { message: "Only admins can access this resource" },
      { status: 403 }
    );
  }

  const weeks = await prisma.$queryRaw<
    {
      weekStart: string;
      totalUserBalance: string;
      profit: string;
      losses: string;
      netProfit: string;
    }[]
  >`
    WITH first_event AS (
      SELECT MIN(d) AS d FROM (
        SELECT MIN(date) AS d FROM "PurchaseTransaction"
        UNION ALL SELECT MIN(date) FROM "BalanceTransaction"
        UNION ALL SELECT MIN(date) FROM "LostStock"
      ) x
    ),
    weeks AS (
      SELECT generate_series(
        date_trunc('week', (SELECT d FROM first_event) + interval '1 day') - interval '1 day',
        date_trunc('week', (now() AT TIME ZONE 'UTC') + interval '1 day') - interval '1 day',
        interval '7 days'
      ) AS week_start
    ),
    purchases AS (
      SELECT date_trunc('week', pt.date + interval '1 day') - interval '1 day' AS week_start,
             SUM(p.price)                      AS revenue,
             SUM(p.price - s.acquisition_cost) AS profit
      FROM "PurchaseTransaction" pt
      JOIN "User"  u ON u.id = pt.user_id
      JOIN "Stock" s ON s.id = pt.product_v_id
      CROSS JOIN LATERAL (
        SELECT CASE u."type"
                 WHEN 'SOCIO'   THEN s.socio_price
                 WHEN 'N_SOCIO' THEN s.nsocio_price
               END AS price
      ) p
      WHERE p.price IS NOT NULL
      GROUP BY 1
    ),
    losses AS (
      SELECT date_trunc('week', ls.date + interval '1 day') - interval '1 day' AS week_start,
             SUM(s.acquisition_cost) AS losses
      FROM "LostStock" ls
      JOIN "Stock" s ON s.id = ls.stock_id
      GROUP BY 1
    ),
    deposits AS (
      SELECT date_trunc('week', bt.date + interval '1 day') - interval '1 day' AS week_start,
             SUM(CASE bt.type WHEN 'CARREGAR' THEN bt.amount ELSE -bt.amount END) AS delta
      FROM "BalanceTransaction" bt
      GROUP BY 1
    )
    SELECT to_char(w.week_start, 'YYYY-MM-DD') AS "weekStart",
           SUM(COALESCE(d.delta, 0) - COALESCE(p.revenue, 0))
             OVER (ORDER BY w.week_start)::text AS "totalUserBalance",
           COALESCE(p.profit, 0)::text AS profit,
           COALESCE(l.losses, 0)::text AS losses,
           (COALESCE(p.profit, 0) - COALESCE(l.losses, 0))::text AS "netProfit"
    FROM weeks w
    LEFT JOIN purchases p ON p.week_start = w.week_start
    LEFT JOIN losses    l ON l.week_start = w.week_start
    LEFT JOIN deposits  d ON d.week_start = w.week_start
    ORDER BY w.week_start
  `;

  return NextResponse.json({ weeks }, { status: 200 });
});