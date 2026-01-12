import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/app/api/DAO/models/user.model";
import Transaction from "@/app/api/DAO/models/transaction.model";
import { calculatePoints } from "@/constants/points";
import { UserService } from "@/app/api/DAO/services/userService";
import { validateAmount, validateConcept } from "@/constants/validation";

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

    const { userId, amount, concept } = await request.json();

    // Validaciones con helpers compartidos
    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      return NextResponse.json(
        { error: amountValidation.error },
        { status: 400 }
      );
    }

    const conceptValidation = validateConcept(concept);
    if (!conceptValidation.isValid) {
      return NextResponse.json(
        { error: conceptValidation.error },
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

    // Calcular puntos
    const points = calculatePoints(amount);

    // Crear transacción
    const transaction = await Transaction.create({
      userID: userId,
      type: "purchase",
      concept: concept.trim(),
      points,
    });

    // Actualizar puntos del usuario
    user.points += points;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `${points} puntos agregados exitosamente`,
      data: {
        newBalance: user.points,
        pointsAdded: points,
        transactionId: transaction._id,
      },
    });
  } catch (error) {
    console.error("Error al agregar puntos:", error);
    return NextResponse.json(
      { error: "Error al agregar puntos" },
      { status: 500 }
    );
  }
}
