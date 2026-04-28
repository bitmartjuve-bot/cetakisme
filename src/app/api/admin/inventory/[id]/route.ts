import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { stock, reason, change } = await req.json();

  try {
    const variant = await prisma.$transaction(async (tx) => {
      const current = await tx.productVariant.findUnique({
        where: { id },
      });

      if (!current) throw new Error("Variant not found");

      const newStock = stock !== undefined ? stock : current.stock + (change || 0);

      const updated = await tx.productVariant.update({
        where: { id },
        data: { stock: newStock },
      });

      await tx.stockHistory.create({
        data: {
          variantId: id,
          change: change || (newStock - current.stock),
          reason: reason || "Manual adjustment by admin",
        },
      });

      return updated;
    });

    return NextResponse.json(variant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update stock" }, { status: 500 });
  }
}
