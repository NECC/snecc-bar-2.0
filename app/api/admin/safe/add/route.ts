import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can add safe balance" }, { status: 403 });
  }

  const body = await req.json();
  const { balance } = body;

  const amount = Number.parseFloat(balance) * 100;

  if (!balance) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  if (amount === 0) {
    return NextResponse.json({ message: "Amount cannot be zero."}, { status: 400 });
  }

  try {

    const result = await prisma.safe.findFirst();
    if (!result) {
      await prisma.safe.create({
        data: {
            balance: amount,
        },
      });
    } else {
      await prisma.safe.update({
        where: { id: result.id },
        data: {
          balance: { increment: amount },
        },
      });
    }
  } catch (error) {
    console.error("Error adding safe balance:", error);
    return NextResponse.json({ message: "Error adding safe balance" }, { status: 500 });
  }

  return NextResponse.json({ message: "Balance added successfully" }, { status: 200 });
});