import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can register losses" }, { status: 403 });
  }

  const body = await req.json();
  const { p_id } = body;

  if (!p_id) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const st = await prisma.stock.findFirst({
      where: { product_id: p_id },
      orderBy: { createdAt: 'asc' },
    });

    if(!st) {
      return NextResponse.json({ message: "No stock found for the given product" }, { status: 404 });
    }

    const loss = await prisma.lostStock.create({
      data: {
        stock: {
            connect: {
                id: st.id
            }
        }
      }
    });

    if (loss) {
      await prisma.stock.update({
        where: { id: st.id },
        data: {
          quantity: {
            decrement: 1
          }
        }
      });
    }
  } catch (error) {
    console.error("Error adding loss:", error);
    return NextResponse.json({ message: "Error adding loss" }, { status: 500 });
  }

  return NextResponse.json({ message: "Loss added successfully" }, { status: 201 });
});