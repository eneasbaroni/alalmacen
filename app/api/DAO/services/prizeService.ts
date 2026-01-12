import Prize from "@/app/api/DAO/models/prize.model";
import { connectMongoDB } from "@/lib/mongodb";

export class PrizeService {
  /**
   * Obtener todos los premios
   */
  static async findAll() {
    await connectMongoDB();
    return await Prize.find().sort({ createdAt: -1 }).lean();
  }

  /**
   * Obtener un premio por ID
   */
  static async findById(id: string) {
    await connectMongoDB();
    return await Prize.findById(id).lean();
  }

  /**
   * Crear un nuevo premio
   */
  static async create(data: {
    name: string;
    description: string;
    pointsRequired: number;
    image?: string;
    status?: "available" | "unavailable";
    stock: number;
  }) {
    await connectMongoDB();
    return await Prize.create({
      name: data.name,
      description: data.description,
      pointsRequired: data.pointsRequired,
      image: data.image || "empty.png",
      status: data.status || "available",
      stock: data.stock,
    });
  }

  /**
   * Actualizar un premio
   */
  static async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      pointsRequired: number;
      image: string;
      status: "available" | "unavailable";
      stock: number;
    }>
  ) {
    await connectMongoDB();
    return await Prize.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  /**
   * Eliminar un premio
   */
  static async delete(id: string) {
    await connectMongoDB();
    return await Prize.findByIdAndDelete(id).lean();
  }

  /**
   * Obtener premios disponibles
   */
  static async findAvailable() {
    await connectMongoDB();
    return await Prize.find({ status: "available" })
      .sort({ pointsRequired: 1 })
      .lean();
  }

  /**
   * 🔒 Decrementar stock de forma atómica
   * Retorna el premio actualizado o lanza error si no hay stock
   */
  static async decrementStock(id: string) {
    await connectMongoDB();

    // Primero obtener el premio actual
    const prize = await Prize.findOne({ _id: id, stock: { $gt: 0 } });

    if (!prize) {
      throw new Error("Premio sin stock disponible");
    }

    // Decrementar stock
    const newStock = prize.stock - 1;
    const newStatus = newStock === 0 ? "unavailable" : prize.status;

    // Operación atómica: actualizar solo si el stock no ha cambiado (evita race condition)
    const updatedPrize = await Prize.findOneAndUpdate(
      {
        _id: id,
        stock: prize.stock, // Solo actualizar si el stock sigue siendo el mismo
      },
      {
        $set: {
          stock: newStock,
          status: newStatus,
        },
      },
      { new: true }
    ).lean();

    if (!updatedPrize) {
      throw new Error("Premio sin stock disponible (race condition detectado)");
    }

    return updatedPrize;
  }

  /**
   * 🔒 Incrementar stock de forma atómica (usado en cancelaciones)
   * Restaura disponibilidad si estaba en 0
   */
  static async incrementStock(id: string) {
    await connectMongoDB();

    // Obtener el premio actual
    const prize = await Prize.findById(id);

    if (!prize) {
      return null;
    }

    // Incrementar stock
    const newStock = prize.stock + 1;
    const newStatus = prize.stock === 0 ? "available" : prize.status;

    // Operación atómica
    const updatedPrize = await Prize.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          stock: newStock,
          status: newStatus,
        },
      },
      { new: true }
    ).lean();

    return updatedPrize;
  }
}
