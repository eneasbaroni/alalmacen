export interface Prize {
  _id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image: string;
  status: "available" | "unavailable";
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}
