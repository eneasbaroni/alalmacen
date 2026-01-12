import { z } from "zod";
import { VALIDATION } from "@/constants/validation";

// 📝 Schema para agregar puntos
export const addPointsSchema = z.object({
  amount: z
    .string()
    .min(1, "El monto es requerido")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= VALIDATION.AMOUNT.MIN;
      },
      { message: `El monto mínimo es $${VALIDATION.AMOUNT.MIN}` }
    )
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num <= VALIDATION.AMOUNT.MAX;
      },
      { message: `El monto máximo es $${VALIDATION.AMOUNT.MAX}` }
    ),
  concept: z
    .string()
    .min(
      VALIDATION.CONCEPT.MIN_LENGTH,
      `Mínimo ${VALIDATION.CONCEPT.MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION.CONCEPT.MAX_LENGTH,
      `Máximo ${VALIDATION.CONCEPT.MAX_LENGTH} caracteres`
    ),
});

export type AddPointsFormData = z.infer<typeof addPointsSchema>;

// 💸 Schema para aplicar descuento
export const applyDiscountSchema = z.object({
  pointsToUse: z
    .string()
    .min(1, "Los puntos son requeridos")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Los puntos deben ser mayor a 0" }
    ),
  concept: z
    .string()
    .min(1, "El concepto es requerido")
    .max(
      VALIDATION.CONCEPT.MAX_LENGTH,
      `Máximo ${VALIDATION.CONCEPT.MAX_LENGTH} caracteres`
    ),
});

export type ApplyDiscountFormData = z.infer<typeof applyDiscountSchema>;
