import Transaction from "@/app/api/DAO/models/transaction.model";
import "@/app/api/DAO/models/prize.model"; // Importar para registrar el schema
import "@/app/api/DAO/models/user.model"; // Importar para registrar el schema
import { connectMongoDB } from "@/lib/mongodb";

export class TransactionService {
  /**
   * Crear una nueva transacción
   */
  static async create(data: {
    userID: string;
    type: "purchase" | "redeem";
    concept: string;
    points: number;
    prizeID?: string;
    prizeType?: "prize" | "cashback";
    cashbackAmount?: number;
    status?: "pending" | "completed" | "cancelled";
  }) {
    await connectMongoDB();
    const transaction = await Transaction.create(data);
    return transaction.toObject();
  }

  /**
   * Obtener todas las transacciones (para admin)
   */
  static async findAll() {
    await connectMongoDB();
    return await Transaction.find({})
      .sort({ createdAt: -1 })
      .populate("userID")
      .populate("prizeID")
      .lean();
  }

  /**
   * Obtener transacciones de un usuario
   */
  static async findByUser(userID: string) {
    await connectMongoDB();
    return await Transaction.find({ userID })
      .sort({ createdAt: -1 })
      .populate("prizeID")
      .lean();
  }

  /**
   * Obtener todas las transacciones de redención de premios
   */
  static async findAllPrizeRedemptions() {
    await connectMongoDB();
    return await Transaction.find({
      type: "redeem",
      prizeType: "prize",
    })
      .sort({ createdAt: -1 })
      .populate("userID")
      .populate("prizeID")
      .lean();
  }

  /**
   * Obtener todas las transacciones de redención de premios de un usuario específico
   */
  static async findPrizeRedemptionsByUser(userID: string) {
    await connectMongoDB();
    return await Transaction.find({
      userID,
      type: "redeem",
      prizeType: "prize",
    })
      .sort({ createdAt: -1 })
      .populate("prizeID")
      .lean();
  }

  /**
   * Obtener transacciones pendientes (premios por entregar)
   */
  static async findPending() {
    await connectMongoDB();
    return await Transaction.find({
      type: "redeem",
      prizeType: "prize",
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("userID")
      .populate("prizeID")
      .lean();
  }

  /**
   * Obtener transacciones pendientes de un usuario específico
   */
  static async findPendingByUser(userID: string) {
    await connectMongoDB();
    return await Transaction.find({
      userID,
      type: "redeem",
      prizeType: "prize",
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("prizeID")
      .lean();
  }

  /**
   * Marcar transacción como completada
   */
  static async complete(transactionID: string) {
    await connectMongoDB();
    return await Transaction.findByIdAndUpdate(
      transactionID,
      { status: "completed" },
      { new: true }
    ).lean();
  }

  /**
   * Cancelar transacción
   */
  static async cancel(transactionID: string) {
    await connectMongoDB();
    return await Transaction.findByIdAndUpdate(
      transactionID,
      { status: "cancelled" },
      { new: true }
    ).lean();
  }

  /**
   * Obtener transacción por ID
   */
  static async findById(transactionID: string) {
    await connectMongoDB();
    return await Transaction.findById(transactionID)
      .populate("userID")
      .populate("prizeID")
      .lean();
  }
}
