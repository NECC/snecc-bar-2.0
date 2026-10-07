"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. ACTION: Carregar Saldo a um Utilizador
// ==========================================
export async function rechargeUserBalanceAction(formData: {
  email: string;
  amount: number;
}) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Sessão inválida ou não autenticada." };
    }

    const { email, amount } = formData;

    if (!email || amount <= 0) {
      return { success: false, error: "Dados ou montante inválidos para o carregamento." };
    }

    // 1. Procura o utilizador destinatário pelo email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return { success: false, error: "Utilizador destinatário não foi encontrado na base de dados." };
    }

    // 2. Procura o utilizador administrador responsável
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!adminUser) {
      return { success: false, error: "Utilizador administrador responsável não foi encontrado na base de dados." };
    }

    // 3. Regista a transação de carregamento na tabela BalanceTransaction
    await prisma.balanceTransaction.create({
      data: {
        user_id: targetUser.id,
        handler_id: adminUser.id,
        type: "CARREGAR",
        amount: amount,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/products");

    return { 
      success: true, 
      message: `Carregamento de ${amount.toFixed(2)}€ efetuado com sucesso para ${targetUser.email}!` 
    };
  } catch (error) {
    console.error("Erro ao carregar saldo:", error);
    return { success: false, error: "Ocorreu um erro ao processar o carregamento na base de dados." };
  }
}

// ==========================================
// 2. ACTION: Criar ou Atualizar Produto
// ==========================================
export async function saveProductAction(formData: {
  id?: string;
  nome: string;
  bay?: string;
  precoSocio: number;
  precoNaoSocio: number;
  stock: number;
  imagem?: string;
}) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Não autenticado." };
    }

    const { id, nome, precoSocio, precoNaoSocio, stock, imagem } = formData;

    if (!nome || precoSocio < 0 || precoNaoSocio < 0 || stock < 0) {
      return { success: false, error: "Preencha todos os campos obrigatórios com valores válidos." };
    }

    if (id) {
      // Atualizar produto existente
      await prisma.product.update({
        where: { id },
        data: {
          name: nome,
          image: imagem || null,
        },
      });
    } else {
      // Criar novo Produto juntamente com a respetiva entrada na tabela Stock
      await prisma.product.create({
        data: {
          name: nome,
          image: imagem || null,
          stock: {
            create: {
              quantity: Number(stock),
              socio_price: precoSocio,
              nsocio_price: precoNaoSocio,
              acquisition_cost: 0.00,
            },
          },
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/products");

    return { 
      success: true, 
      message: `Produto "${nome}" guardado com sucesso!` 
    };
  } catch (error) {
    console.error("Erro ao guardar produto:", error);
    return { success: false, error: "Ocorreu um erro ao guardar o produto na base de dados." };
  }
}