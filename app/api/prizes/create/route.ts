import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserService } from "@/app/api/DAO/services/userService";
import { PrizeService } from "@/app/api/DAO/services/prizeService";
import { prizeSchema } from "@/lib/validations/prize";

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

    const body = await request.json();

    // Validar con Zod (reutiliza validaciones del frontend)
    const validation = prizeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, description, pointsRequired, status, stock } =
      validation.data;

    // Crear premio usando PrizeService
    const prize = await PrizeService.create({
      name: name.trim(),
      description: description.trim(),
      pointsRequired,
      status,
      stock,
    });

    return NextResponse.json({
      success: true,
      message: "Premio creado exitosamente",
      data: {
        prizeId: prize._id,
        name: prize.name,
      },
    });
  } catch (error) {
    console.error("Error al crear premio:", error);
    return NextResponse.json(
      { error: "Error al crear premio" },
      { status: 500 }
    );
  }
}
