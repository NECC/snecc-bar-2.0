import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can create products" }, { status: 403 });
  }

  const body = await req.json();
  const { nome, precoSocio, precoNaoSocio, precoAquisicao, stock, imagem } = body;

  if (!nome || !precoSocio || !precoNaoSocio || !precoAquisicao || !stock) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: nome,
        image: imagem || null,
        stock: {
          create: {
            socio_price: parseFloat(precoSocio),
            nsocio_price: parseFloat(precoNaoSocio),
            acquisition_cost: parseFloat(precoAquisicao),
            quantity: parseInt(stock, 10),
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Error creating product" }, { status: 500 });
  }

  return NextResponse.json({ message: "Product created successfully" }, { status: 201 });
});

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
          createdAt: true,
          parcel_number: true,
          _count: {
            select: { lost: true },
          },
        },
        orderBy: {
          createdAt: 'asc',
        }
      }
    }
  });

  const results = products.map(product => {
    return {
      id: product.id,
      name: product.name,
      image: product.image || "",
      stock: product.stock.map(stock => ({
        id: stock.id,
        socio_price: stock.socio_price,
        nsocio_price: stock.nsocio_price,
        acquisition_cost: stock.acquisition_cost,
        quantity: stock.quantity,
        acquisition_date: stock.createdAt.toLocaleDateString("pt-PT"),
        parcel_number: stock.parcel_number,
        lost: stock._count.lost,
      })),
    };
  });

  return NextResponse.json({ products: results }, { status: 200 });
});
