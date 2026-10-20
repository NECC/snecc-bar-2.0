import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  // exemplo de rota protegida ver mais em https://authjs.dev/getting-started/session-management/protecting
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type === "ADMIN") {
    return NextResponse.json({ message: "Admins can't buy products" }, { status: 403 });
  }

  const socio = req.auth.user?.type === "SOCIO";

  const totals = await prisma.stock.groupBy({
    by: ['product_id'],
    _sum: { quantity: true },
    having: { quantity: { _sum: { gt: 0 } } },
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: totals.map(t => t.product_id)
      }
    },
    include: {
      stock: {
        where: {
          quantity: {
            gt: 0
          }
        },
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          socio_price: true,
          nsocio_price: true,
        },
        take: 1,
      }
    }
  });

  const results = products.map(product => {
    return {
      id: product.id,
      preco: socio ? product.stock[0].socio_price.toFixed(2) : product.stock[0].nsocio_price.toFixed(2),
      nome: product.name,
      imagem: product.image || "",
    };
  });

  return NextResponse.json({ products: results }, { status: 200 });
});
