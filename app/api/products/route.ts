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

  const products = await prisma.product.findMany({
    where: {
      stock: {
        some: {
          quantity: {
            gt: 0
          }
        }
      }
    },
    include: {
      stock: {
        where: {
          quantity: {
            gt: 0
          }
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
      id: product.stock[0].id,
      preco: socio ? product.stock[0].socio_price.toFixed(2) : product.stock[0].nsocio_price.toFixed(2),
      nome: product.name,
      imagem: product.image || "",
    };
  });

  return NextResponse.json({ products: results }, { status: 200 });
});
