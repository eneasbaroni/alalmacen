import { z } from "zod";

/**
 * Schema de ejemplo para cargar puntos a un cliente (Admin)
 *
 * Usar como template para crear nuevos schemas
 */
export const addPointsSchema = z.object({
  // Email o DNI del cliente
  identifier: z.string().min(1, "El email o DNI es requerido"),

  // Cantidad de puntos a agregar
  points: z
    .number({ message: "Debe ser un número" })
    .int("Debe ser un número entero")
    .positive("Debe ser un número positivo")
    .max(10000, "Máximo 10,000 puntos por transacción"),

  // Concepto/razón de la carga de puntos
  concept: z
    .string()
    .min(3, "El concepto debe tener al menos 3 caracteres")
    .max(200, "El concepto debe tener máximo 200 caracteres")
    .default("Compra en el local"),
});

export type AddPointsFormData = z.infer<typeof addPointsSchema>;

/**
 * PATRÓN PARA NUEVOS SCHEMAS:
 *
 * 1. Crear archivo en lib/validations/[nombre].ts
 * 2. Definir schema con z.object({})
 * 3. Agregar validaciones específicas (.min, .max, .regex, etc.)
 * 4. Exportar tipo inferido: type FormData = z.infer<typeof schema>
 * 5. Usar en componente con useForm + zodResolver
 *
 * Ejemplo de uso en componente:
 *
 * const { register, handleSubmit, formState: { errors } } = useForm<AddPointsFormData>({
 *   resolver: zodResolver(addPointsSchema),
 * });
 */
