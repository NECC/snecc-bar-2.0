import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  // exemplo de rota protegida ver mais em https://authjs.dev/getting-started/session-management/protecting
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.auth.user.id
    },
    select: {
        type: true,
        balance: true,
    }
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const result = {
    isSocio: user.type === "SOCIO" || user?.type === "ADMIN",
    isAdmin: user.type === "ADMIN",
    saldo: user.type === "ADMIN" ? NaN : user?.balance ?? 0,
  }

  return NextResponse.json({ user: result }, { status: 200 });
});