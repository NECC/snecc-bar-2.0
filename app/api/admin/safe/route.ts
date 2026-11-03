import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } else if (req.auth.user?.type !== "ADMIN") {
    return NextResponse.json({ message: "Only admins can view safe balance" }, { status: 403 });
  }

  try {
    const safe = await prisma.safe.findFirst();
    if (!safe) {
      const newSafe = await prisma.safe.create({
        data: {
          balance: Prisma.Decimal(0),
        },
      });
      return NextResponse.json({ totalBalance: newSafe.balance.toString(), lastUpdate: newSafe.last_updated }, { status: 200 });
    }
    
    return NextResponse.json({ totalBalance: safe.balance.toString(), lastUpdate: safe.last_updated }, { status: 200 });
  } catch (error) {
    console.error("Error fetching safe balance:", error);
    return NextResponse.json({ message: "Error fetching safe balance" }, { status: 500 });
  }
});