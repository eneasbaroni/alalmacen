import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { TransactionService } from "@/app/api/DAO/services/transactionService";
import { UserService } from "@/app/api/DAO/services/userService";

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Obtener usuario
    const user = await UserService.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Obtener transacciones de premios pendientes
    const transactions = await TransactionService.findByUser(
      user._id.toString()
    );

    const pendingPrizesCount = transactions.filter(
      (t) =>
        t.type === "redeem" && t.prizeType === "prize" && t.status === "pending"
    ).length;

    return NextResponse.json({ count: pendingPrizesCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending prizes count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
