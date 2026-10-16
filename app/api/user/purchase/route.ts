import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

class PurchaseError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type === "ADMIN") {
    return NextResponse.json({ message: "Admins can't use this resource" }, { status: 403 });
  }

  const body = await req.json();
  const { p_id } = body;
  const userId = req.auth.user.id;
  const userType = req.auth.user.type;

  if (!p_id) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const { productName } = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({ 
            where: { 
                id: userId,
            } 
        });
        if (!user) throw new PurchaseError("Utilizador não encontrado", 404);

        const stock = await tx.stock.findFirst({
            where: { 
                product_id: p_id, 
                quantity: { 
                    gte: 1 
                } 
            },
            include: { 
                product: true 
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        if (!stock) throw new PurchaseError("Produto sem stock", 409);

        const price = user.type === "SOCIO" ? stock.socio_price : stock.nsocio_price;

        
        const stockUpdate = await tx.stock.updateMany({
            where: { 
                id: stock.id,
                quantity: {
                    gte: 1
                }
            },
            data: { 
                quantity: { 
                    decrement: 1 
                } 
            },
        });
        if (stockUpdate.count === 0) throw new PurchaseError("Produto sem stock", 409);

        const userUpdate = await tx.user.updateMany({
            where: { 
                id: user.id, 
                balance: { 
                    gte: price 
                } 
            },
            data: { 
                balance: { 
                    decrement: price 
                } 
            },
        });
        if (userUpdate.count === 0) throw new PurchaseError("Saldo insuficiente", 400);

        await tx.purchaseTransaction.create({
            data: {
                user: { 
                    connect: { 
                        id: user.id 
                    } 
                },
                product_v: { 
                    connect: { 
                        id: stock.id 
                    } 
                },
                user_type: userType,
            },
        });

        return { productName: stock.product.name };
    });

    return NextResponse.json({ message: `Compra de "${productName}" efetuada com sucesso!` }, { status: 200 });
  } catch (error) {
    if (error instanceof PurchaseError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("Error processing purchase:", error);
    return NextResponse.json({ message: "Erro ao processar a compra" }, { status: 500 });
  }
});