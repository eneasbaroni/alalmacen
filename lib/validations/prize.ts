import { z } from "zod";

export const prizeSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede superar 500 caracteres"),
  pointsRequired: z
    .number({ message: "Los puntos deben ser un número" })
    .int("Los puntos deben ser un número entero")
    .positive("Los puntos deben ser mayor a 0"),
  status: z.enum(["available", "unavailable"]),
  stock: z
    .number({ message: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo"),
});

export type PrizeFormData = z.infer<typeof prizeSchema>;
