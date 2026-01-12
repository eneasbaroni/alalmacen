import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/app/api/DAO/models/user.model";
import Transaction from "@/app/api/DAO/models/transaction.model";
import { UserService } from "@/app/api/DAO/services/userService";
import { calculateDiscount } from "@/constants/points";

export async function POST(request: Request) {
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

    const { userId, points, concept } = await request.json();

    // Validaciones
    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    if (typeof points !== "number" || points <= 0) {
      return NextResponse.json(
        { error: "Los puntos deben ser un número mayor a 0" },
        { status: 400 }
      );
    }

    if (!concept || typeof concept !== "string" || concept.trim().length < 3) {
      return NextResponse.json(
        { error: "El concepto debe tener al menos 3 caracteres" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario tiene suficientes puntos
    if (user.points < points) {
      return NextResponse.json(
        {
          error: `El usuario solo tiene ${user.points} puntos disponibles`,
        },
        { status: 400 }
      );
    }

    // Calcular el monto de descuento en pesos
    const cashbackAmount = calculateDiscount(points);

    // Crear transacción (con puntos negativos para representar descuento)
    const transaction = await Transaction.create({
      userID: userId,
      type: "redeem",
      concept: concept.trim(),
      points: -points, // Negativo porque es un descuento
      prizeType: "cashback", // Tipo de canje: descuento directo
      cashbackAmount, // Monto del descuento en pesos
    });

    // Actualizar puntos del usuario
    user.points -= points;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `${points} puntos descontados exitosamente`,
      data: {
        newBalance: user.points,
        pointsDeducted: points,
        cashbackAmount,
        transactionId: transaction._id,
      },
    });
  } catch (error) {
    console.error("Error al aplicar descuento:", error);
    return NextResponse.json(
      { error: "Error al aplicar descuento" },
      { status: 500 }
    );
  }
}
