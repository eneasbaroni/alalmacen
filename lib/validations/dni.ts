import { z } from "zod";

export const dniSchema = z.object({
  dni: z
    .string()
    .min(7, "El DNI debe tener al menos 7 dígitos")
    .max(8, "El DNI debe tener máximo 8 dígitos")
    .regex(/^\d+$/, "El DNI solo debe contener números"),
});

export type DNIFormData = z.infer<typeof dniSchema>;
