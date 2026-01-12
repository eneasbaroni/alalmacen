import { Prize } from "./prize";

export interface User {
  _id: string;
  name?: string;
  email: string;
  dni?: number;
  points: number;
  role: "client" | "admin";
}

export interface Transaction {
  _id: string;
  userID: string | User; // Puede ser ID o usuario populated
  type: "purchase" | "redeem";
  concept: string;
  points: number;
  prizeID?: string;
  prizeType?: "prize" | "cashback"; // Tipo de premio
  prize?: Prize; // Premio populated (cuando está disponible)
  cashbackAmount?: number;
  status?: "pending" | "completed" | "cancelled"; // Solo para type="redeem" + prizeType="prize"
  date: string;
  createdAt?: string;
  updatedAt?: string;
}
