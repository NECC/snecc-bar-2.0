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

  if (!p_id ||!precoSocio || !precoNaoSocio || !precoAquisicao || !stock) {
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