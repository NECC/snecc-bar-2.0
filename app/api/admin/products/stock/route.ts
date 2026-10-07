import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can add stock" }, { status: 403 });
  }

  const body = await req.json();
  const { p_id, precoSocio, precoNaoSocio, precoAquisicao, stock } = body;

  if (!precoSocio || !precoNaoSocio || !precoAquisicao || !stock) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const count = await prisma.stock.count({
        where: { product: { id: p_id } },
    });

    const st = await prisma.stock.create({
        data: {
            socio_price: parseFloat(precoSocio),
            nsocio_price: parseFloat(precoNaoSocio),
            acquisition_cost: parseFloat(precoAquisicao),
            quantity: parseInt(stock, 10),
            parcel_number: count + 1,
            product: {
                connect: {
                    id: p_id
                }
            }
        }
    });
  } catch (error) {
    console.error("Error adding stock:", error);
    return NextResponse.json({ message: "Error adding stock" }, { status: 500 });
  }

  return NextResponse.json({ message: "Stock added successfully" }, { status: 201 });
});

export const PUT = auth(async function PUT(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can alter stock" }, { status: 403 });
  }

  const body = await req.json();
  const { p_id } = body;

  if (!p_id) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const stock = await prisma.stock.findFirst({
        where: { product_id: p_id },
        orderBy: { createdAt: 'asc' },
    });

    if (!stock) {
        return NextResponse.json({ message: "Stock not found for the given product" }, { status: 404 });
    }

    const st = await prisma.stock.update({
        where: { id: stock.id },
        data: {
            quantity: stock.quantity - 1,
            lost: stock.lost + 1,
        }
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json({ message: "Error updating stock" }, { status: 500 });
  }

  return NextResponse.json({ message: "Stock updated successfully" }, { status: 200 });
});