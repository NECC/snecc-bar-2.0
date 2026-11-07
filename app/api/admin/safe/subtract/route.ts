import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can subtract safe balance" }, { status: 403 });
  }

  const body = await req.json();
  const { balance } = body;

  if (!balance) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const amount = new Prisma.Decimal(balance);

  if (amount.isZero() || amount.isNegative()) {
    return NextResponse.json({ message: "Amount must be greater than zero." }, { status: 400 });
  }

  try {
    const result = await prisma.safe.findFirst();

    // Se não existir cofre, o saldo é 0, logo não é possível subtrair nada
    if (!result || result.balance.minus(amount).isNegative()) {
      return NextResponse.json(
        { message: "Cannot subtract more than available balance" },
        { status: 400 }
      );
    }

    await prisma.safe.update({
      where: { id: result.id },
      data: {
        balance: { decrement: amount },
      },
    });
  } catch (error) {
    console.error("Error subtracting safe balance:", error);
    return NextResponse.json({ message: "Error subtracting safe balance" }, { status: 500 });
  }

  return NextResponse.json({ message: "Balance subtracted successfully" }, { status: 200 });
});