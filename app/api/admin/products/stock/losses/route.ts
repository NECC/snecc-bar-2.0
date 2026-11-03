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
  const { p_id, lost } = body;
  let remainingLoss = parseInt(lost);

  if (!p_id || !lost) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const quantity = await prisma.stock.aggregate({
      where: { 
        product_id: p_id,
        quantity: {
          gt: 0,
        } 
      },
      _sum: {
        quantity: true,
      },
    });

    if (!quantity._sum.quantity || quantity._sum.quantity <= 0) {
      return NextResponse.json({ message: "No stock found for the given product" }, { status: 404 });
    }
      
    if (quantity._sum.quantity < remainingLoss) {
      return NextResponse.json({ message: "Loss is bigger than available stock" }, { status: 400 });
    }

    while (remainingLoss > 0) {
      const st = await prisma.stock.findFirst({
        where: { 
          product_id: p_id,
          quantity: {
            gt: 0,
          } 
        },
        orderBy: { createdAt: 'asc' },
      });

      if (st) {
        if (st.quantity >= remainingLoss) {
          await prisma.stock.update({
            where: { id: st.id },
            data: {
              quantity: {
                decrement: remainingLoss
              }
            }
          });
          remainingLoss = 0;

        } else {
          await prisma.stock.update({
            where: { id: st.id },
            data: {
              quantity: {
                decrement: st.quantity
              }
            }
          });
          remainingLoss -= st.quantity;
        }
      } else break; // No more stock to process
    }

  } catch (error) {
    console.error("Error registering loss:", error);
    return NextResponse.json({ message: "Error registering loss" }, { status: 500 });
  }

  return NextResponse.json({ message: "Loss registered successfully" }, { status: 201 });
});