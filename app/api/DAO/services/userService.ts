import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../models/user.model";

export class UserService {
  /**
   * Asegura la conexión a MongoDB
   */
  private static async ensureConnection() {
    await connectMongoDB();
  }

  /**
   * Encuentra un usuario por email
   */
  static async findByEmail(email: string) {
    await this.ensureConnection();
    return await User.findOne({ email });
  }

  /**
   * Encuentra un usuario por ID
   */
  static async findById(userId: string) {
    await this.ensureConnection();
    return await User.findById(userId).lean();
  }

  /**
   * Obtiene todos los usuarios
   */
  static async findAll() {
    await this.ensureConnection();
    return await User.find({}).sort({ createdAt: -1 });
  }

  /**
   * Crea o retorna un usuario existente
   * @returns { user, created } - El usuario y si fue creado o ya existía
   */
  static async findOrCreate(email: string, name?: string) {
    await this.ensureConnection();

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      return { user: existingUser, created: false };
    }

    const newUser = new User({ email, name });
    await newUser.save();

    return { user: newUser, created: true };
  }

  /**
   * Crea un nuevo usuario (falla si ya existe)
   */
  static async create(email: string, name?: string) {
    await this.ensureConnection();

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = new User({ email, name });
    await newUser.save();

    return newUser;
  }

  /**
   * Actualiza los datos de un usuario por email
   */
  static async updateByEmail(
    email: string,
    updateData: { dni?: number; name?: string }
  ) {
    await this.ensureConnection();

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Actualiza los puntos de un usuario por ID
   */
  static async updatePoints(userId: string, newPoints: number) {
    await this.ensureConnection();

    const user = await User.findByIdAndUpdate(
      userId,
      { points: newPoints },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Decrementa puntos de forma atómica (previene race conditions)
   * @throws Error si el usuario no existe o no tiene suficientes puntos
   */
  static async decrementPoints(userId: string, pointsToDeduct: number) {
    await this.ensureConnection();

    // Operación atómica: decrementa y retorna el documento actualizado
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { points: -pointsToDeduct },
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Validar que no quedó en negativo (race condition detected)
    if (user.points < 0) {
      // Rollback: devolver los puntos
      await User.findByIdAndUpdate(userId, {
        $inc: { points: pointsToDeduct },
      });
      throw new Error("Puntos insuficientes");
    }

    return user;
  }
}
