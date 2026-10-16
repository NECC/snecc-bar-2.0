import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
    // exemplo de rota protegida ver mais em https://authjs.dev/getting-started/session-management/protecting
    if (!req.auth) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    } else if (req.auth.user.type === "ADMIN") return NextResponse.json({ message: "Admins can't use this resource."})

    const user = await prisma.user.findUnique({
        where: {
            id: req.auth.user.id,
        }
    })

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const purchases = await prisma.purchaseTransaction.findMany({
        where: {
            user_id: req.auth.user.id
        },
        include: {
            product_v: {
                include: {
                    product: {
                        select: {
                            image: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

  const result = purchases.map((p) => {
    return {
        id: p.id,
        date: p.date,
        image: p.product_v.product.image,
        type: p.user_type,
        price: p.user_type === "SOCIO" ? p.product_v.socio_price : p.product_v.nsocio_price,
        name: p.product_v.product.name,
    }
  })

  return NextResponse.json({ orders: result }, { status: 200 });
});