import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can add balance" }, { status: 403 });
  }

  const body = await req.json();
  const { u_id, balance } = body;

  const amount = Prisma.Decimal(balance);
  if (!u_id || !balance) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  if (amount.isZero()) return NextResponse.json({ message: "Balance cannot be zero."}, { status: 400 })

  try {
    const user = await prisma.user.findUnique({
        where: { id: u_id },
    });

    if (!user) if (!user) throw new Error("User not found");

    const result = await prisma.$transaction([
        prisma.user.update({
            where: {
                id: u_id,
            },
            data: {
                balance: {
                    increment: amount,
                }
            }
        }),
        prisma.balanceTransaction.create({
            data: {
                user: {
                    connect: {
                        id: u_id,
                    }
                },
                handler: {
                    connect: {
                        id: req.auth.user.id,
                    }
                },
                amount: amount,
                type: amount.gt(0) ? "CARREGAR" : "RETIRAR",
            }
        })
    ])
  } catch (error) {
    console.error("Error adding stock:", error);
    return NextResponse.json({ message: "Error adding stock" }, { status: 500 });
  }

  return NextResponse.json({ message: "Stock added successfully" }, { status: 200 });
});