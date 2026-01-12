import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/app/api/DAO/services/userService";
import { PrizeService } from "@/app/api/DAO/services/prizeService";
import { TransactionService } from "@/app/api/DAO/services/transactionService";

export async function POST(request: Request) {
  try {
    // 🔒 SEGURIDAD: Verificar autenticación
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Obtener datos del usuario
    const user = await UserService.findByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Parsear body
    const body = await request.json();
    const { prizeID } = body;

    if (!prizeID) {
      return NextResponse.json(
        { error: "prizeID es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el premio existe y está disponible
    const prize = await PrizeService.findById(prizeID);

    if (!prize) {
      return NextResponse.json(
        { error: "Premio no encontrado" },
        { status: 404 }
      );
    }

    if (prize.status !== "available") {
      return NextResponse.json(
        { error: "Premio no disponible" },
        { status: 400 }
      );
    }

    // Verificar stock disponible
    if (prize.stock <= 0) {
      return NextResponse.json(
        { error: "Premio sin stock disponible" },
        { status: 400 }
      );
    }

    // Verificar que el usuario tiene suficientes puntos
    if (user.points < prize.pointsRequired) {
      return NextResponse.json(
        {
          error: "Puntos insuficientes",
          required: prize.pointsRequired,
          available: user.points,
        },
        { status: 400 }
      );
    }

    // 🔒 OPERACIÓN ATÓMICA: Decrementar puntos primero (previene race condition)
    let updatedUser;
    try {
      updatedUser = await UserService.decrementPoints(
        user._id.toString(),
        prize.pointsRequired
      );
    } catch (error) {
      // Si falla (ej: race condition detectado), retornar error
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Error al descontar puntos",
        },
        { status: 400 }
      );
    }

    // 🔒 DECREMENTAR STOCK: Operación atómica que también cambia status si llega a 0
    try {
      await PrizeService.decrementStock(prize._id.toString());
    } catch (error) {
      // 🔄 ROLLBACK: Devolver puntos si falla decrementar stock
      console.error("Error al decrementar stock:", error);
      await UserService.updatePoints(
        user._id.toString(),
        updatedUser.points + prize.pointsRequired
      );

      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Premio sin stock disponible. Puntos devueltos.",
        },
        { status: 400 }
      );
    }

    // Crear transacción con status="pending"
    let transaction;
    try {
      transaction = await TransactionService.create({
        userID: user._id.toString(),
        type: "redeem",
        concept: `Canje de premio: ${prize.name}`,
        points: -prize.pointsRequired, // Negativo porque se restan
        prizeID: prize._id.toString(),
        prizeType: "prize",
        status: "pending",
      });
    } catch (error) {
      // 🔄 ROLLBACK: Si falla crear la transacción, devolver puntos y stock
      console.error("Error al crear transacción:", error);
      await UserService.updatePoints(
        user._id.toString(),
        updatedUser.points + prize.pointsRequired
      );
      // Devolver el stock
      await PrizeService.incrementStock(prize._id.toString());

      return NextResponse.json(
        { error: "Error al crear la transacción. Puntos y stock devueltos." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Premio adquirido. Ve al local para retirarlo.",
      data: {
        transactionId: transaction._id,
        prizeName: prize.name,
        pointsDeducted: prize.pointsRequired,
        remainingPoints: updatedUser.points,
      },
    });
  } catch (error) {
    console.error("Error en /api/transactions/redeem:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
