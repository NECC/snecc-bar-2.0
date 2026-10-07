import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCurrentUserData() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  // 1. Procura o utilizador na BD pelo email da sessão
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      transactions: true, // BalanceTransactions do utilizador
    },
  });

  if (!user) {
    return {
      nome: session.user.name || session.user.email.split("@")[0],
      isSocio: false,
      saldo: 0.0,
    };
  }

  // 2. Calcula o saldo total somando todos os carregamentos (CARREGAR) e subtraindo retiradas
  const totalRecharges = user.transactions
    .filter((tx) => tx.type === "CARREGAR")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const totalWithdrawals = user.transactions
    .filter((tx) => tx.type === "RETIRAR")
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const currentBalance = totalRecharges - totalWithdrawals;

  return {
    nome: user.name || user.email.split("@")[0],
    isSocio: user.type === "SOCIO" || user.type === "ADMIN",
    saldo: Math.max(0, currentBalance),
  };
}