import { cache } from "react";
import { auth } from "@/auth"; // adjust to wherever auth.js lives
import prisma from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { type: true, balance: true },
  });

  if (!user) return null;

  return {
    isAdmin: user.type === "ADMIN",
    isSocio: user.type === "SOCIO" || user.type === "ADMIN",
    saldo: user.balance.toFixed(2),
  };
});