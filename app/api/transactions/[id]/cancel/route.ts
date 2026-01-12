import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/app/api/DAO/services/userService";
import { PrizeService } from "@/app/api/DAO/services/prizeService";
import { TransactionService } from "@/app/api/DAO/services/transactionService";

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
        { error: "Solo se pueden cancelar transacciones de premios" },
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

    // Marcar como cancelada
    const updatedTransaction = await TransactionService.cancel(id);

    // 🔄 DEVOLVER PUNTOS: Los puntos fueron descontados, ahora hay que devolverlos
    // transaction.points es negativo (ej: -100), así que usamos decrementPoints con valor negativo para incrementar
    const userId =
      typeof transaction.userID === "object"
        ? String(transaction.userID._id)
        : String(transaction.userID);

    try {
      // Usar operación atómica para devolver puntos
      // decrementPoints con valor negativo = incrementar puntos
      await UserService.decrementPoints(userId, transaction.points);
    } catch (error) {
      console.error("Error al devolver puntos:", error);
      // No fallar la request, la transacción ya está cancelada
    }

    // 🔄 DEVOLVER STOCK: Incrementar stock y restaurar disponibilidad si es necesario
    if (transaction.prizeID) {
      const prizeId =
        typeof transaction.prizeID === "object"
          ? String(transaction.prizeID._id)
          : String(transaction.prizeID);

      try {
        await PrizeService.incrementStock(prizeId);
      } catch (error) {
        console.error("Error al devolver stock:", error);
        // No fallar la request, la transacción ya está cancelada
      }
    }

    return NextResponse.json({
      success: true,
      message: "Premio cancelado, puntos y stock devueltos",
      data: {
        transactionId: updatedTransaction?._id,
        status: updatedTransaction?.status,
      },
    });
  } catch (error) {
    console.error("Error en /api/transactions/[id]/cancel:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
