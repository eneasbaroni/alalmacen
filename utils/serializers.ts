import { Prize } from "@/types/prize";

/**
 * Serializa datos de usuario populated
 */
export function serializeUser(userData: unknown) {
  if (!userData) return undefined;

  const u = userData as Record<string, unknown>;
  const isPopulated =
    typeof userData === "object" && userData !== null && u.email;

  if (!isPopulated) {
    return String(userData); // Retornar solo el ID si no está populated
  }

  return {
    _id: String(u._id),
    name: String(u.name || ""),
    email: String(u.email),
    dni: u.dni ? Number(u.dni) : undefined,
    points: Number(u.points || 0),
    role: String(u.role) as "client" | "admin",
  };
}

/**
 * Serializa una transacción básica para Client Component
 */
export function serializeBasicTransaction(transaction: unknown) {
  const t = transaction as Record<string, unknown>;
  return {
    _id: String(t._id),
    userID: String(t.userID),
    type: t.type as "purchase" | "redeem",
    concept: String(t.concept),
    points: Number(t.points),
    prizeID: t.prizeID ? String(t.prizeID) : undefined,
    prizeType: t.prizeType as "prize" | "cashback" | undefined,
    status: t.status as "pending" | "completed" | "cancelled" | undefined,
    date: (t.date as Date)?.toISOString() || new Date().toISOString(),
    createdAt: (t.createdAt as Date)?.toISOString(),
    updatedAt: (t.updatedAt as Date)?.toISOString(),
  };
}

/**
 * Serializa datos de premio populated
 */
export function serializePrize(prizeData: unknown): Prize | undefined {
  if (!prizeData) return undefined;

  const p = prizeData as Record<string, unknown>;
  const isPopulated =
    typeof prizeData === "object" && prizeData !== null && p.name;

  if (!isPopulated) {
    return {
      _id: String(prizeData),
      name: "Premio no disponible",
      description: "",
      pointsRequired: 0,
      image: "empty.png",
      status: "unavailable",
    };
  }

  return {
    _id: String(p._id),
    name: String(p.name),
    description: String(p.description),
    pointsRequired: Number(p.pointsRequired),
    image: String(p.image),
    status: String(p.status) as "available" | "unavailable",
    createdAt: (p.createdAt as Date)?.toISOString(),
    updatedAt: (p.updatedAt as Date)?.toISOString(),
  };
}

/**
 * Serializa transacción con premio y usuario populated
 */
export function serializeTransactionWithPrize(transaction: unknown) {
  const t = transaction as Record<string, unknown>;

  const baseTransaction = serializeBasicTransaction(transaction);
  const serializedUser = serializeUser(t.userID);
  const serializedPrize = serializePrize(t.prizeID);

  return {
    ...baseTransaction,
    userID: serializedUser || baseTransaction.userID, // Usar el populated o el ID
    prize: serializedPrize, // Campo separado para el premio populated
  };
}
