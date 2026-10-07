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

  const products = await prisma.product.findMany({
    include: {
      stock: {
        select: {
          id: true,
          socio_price: true,
          nsocio_price: true,
          acquisition_cost: true,
          quantity: true,
        }
      }
    }
  });
  console.log("Enter")
  return NextResponse.json({ products: products }, { status: 200 });
});
