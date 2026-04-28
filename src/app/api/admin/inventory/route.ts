import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  try {
    const inventory = await prisma.productVariant.findMany({
      where: {
        OR: [
          { product: { name: { contains: search } } },
          { size: { contains: search } },
          { color: { contains: search } },
        ],
      },
      include: {
        product: true,
      },
      orderBy: [
        { product: { name: "asc" } },
        { size: "asc" },
      ],
    });

    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
