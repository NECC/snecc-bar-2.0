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
  const { p_id, lost, reason } = body;
  let remainingLoss = parseInt(lost);

  if (!p_id || !lost || !reason ) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }
const handlerId = req.auth.user.id;

  try {
    await prisma.$transaction(
      async (tx) => {
        // Read all stock batches inside the transaction, oldest first (FIFO)
        const batches = await tx.stock.findMany({
          where: { product_id: p_id, quantity: { gt: 0 } },
          orderBy: { createdAt: "asc" },
        });

        const available = batches.reduce((sum, b) => sum + b.quantity, 0);
        if (available <= 0) {
          throw NextResponse.json({ message: "No stock found for the given product" }, { status: 404 });
        }
        if (available < lost) {
          throw NextResponse.json({ message: "Loss is bigger than available stock" }, { status: 400 });
        }

        let remaining = lost;

        for (const batch of batches) {
          if (remaining <= 0) break;

          const take = Math.min(batch.quantity, remaining);

          await tx.stock.update({
            where: { id: batch.id },
            data: {
              quantity: { decrement: take },
              lost: { increment: take },
            },
          });

          await tx.stockLoss.create({
            data: {
              quantity: take,
              reason: reason,
              stock: {
                connect: {
                  id: batch.id,
                },
              },
              handler: {
                connect: {
                  id: handlerId,
                },
              }
            },
          });

          remaining -= take;
        }
      },
      { isolationLevel: "Serializable" }
    );


  } catch (error) {
    console.error("Error registering loss:", error);
    return NextResponse.json({ message: "Error registering loss" }, { status: 500 });
  }

  return NextResponse.json({ message: "Loss registered successfully" }, { status: 201 });
});