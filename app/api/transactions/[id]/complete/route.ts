import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/app/api/DAO/services/userService";
import { TransactionService } from "@/app/api/DAO/services/transactionService";
import { PrizeService } from "@/app/api/DAO/services/prizeService";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 SEGURIDAD: Verificar autenticación y rol de admin
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que el usuario sea admin
    const adminUser = await UserService.findByEmail(session.user.email);

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado - Se requiere rol de admin" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verificar que la transacción existe
    const transaction = await TransactionService.findById(id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transacción no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que es una transacción de premio
    if (transaction.type !== "redeem" || transaction.prizeType !== "prize") {
      return NextResponse.json(
        { error: "Solo se pueden completar transacciones de premios" },
        { status: 400 }
      );
    }

    // Verificar que está pendiente
    if (transaction.status !== "pending") {
      return NextResponse.json(
        {
          error: `La transacción ya está ${transaction.status}`,
        },
        { status: 400 }
      );
    }

    // 🔒 VALIDACIÓN: Verificar que el premio aún existe
    const prizeId =
      typeof transaction.prizeID === "object"
        ? String(transaction.prizeID._id)
        : String(transaction.prizeID);

    const prize = await PrizeService.findById(prizeId);

    if (!prize) {
      return NextResponse.json(
        { error: "El premio ya no existe" },
        { status: 404 }
      );
    }

    // Marcar como completada
    const updatedTransaction = await TransactionService.complete(id);

    return NextResponse.json({
      success: true,
      message: "Premio entregado correctamente",
      data: {
        transactionId: updatedTransaction?._id,
        status: updatedTransaction?.status,
      },
    });
  } catch (error) {
    console.error("Error en /api/transactions/[id]/complete:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
