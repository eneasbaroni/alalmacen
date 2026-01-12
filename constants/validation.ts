// Constantes de validación compartidas entre frontend y backend
export const VALIDATION = {
  AMOUNT: {
    MIN: 100,
    MAX: 1000000, // 1 millón de pesos
  },
  CONCEPT: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    DEFAULT: "Compra en el local",
  },
  POINTS: {
    MAX: 999999, // Límite para evitar overflow visual
  },
} as const;

// Helpers de validación reutilizables
export function validateAmount(amount: number): {
  isValid: boolean;
  error?: string;
} {
  if (typeof amount !== "number" || isNaN(amount)) {
    return { isValid: false, error: "El monto debe ser un número válido" };
  }

  if (amount < VALIDATION.AMOUNT.MIN) {
    return {
      isValid: false,
      error: `El monto mínimo es $${VALIDATION.AMOUNT.MIN}`,
    };
  }

  if (amount > VALIDATION.AMOUNT.MAX) {
    return {
      isValid: false,
      error: `El monto máximo es $${VALIDATION.AMOUNT.MAX.toLocaleString()}`,
    };
  }

  return { isValid: true };
}

export function validateConcept(concept: string): {
  isValid: boolean;
  error?: string;
} {
  if (!concept || typeof concept !== "string") {
    return { isValid: false, error: "El concepto es requerido" };
  }

  const trimmed = concept.trim();

  if (trimmed.length < VALIDATION.CONCEPT.MIN_LENGTH) {
    return {
      isValid: false,
      error: `El concepto debe tener al menos ${VALIDATION.CONCEPT.MIN_LENGTH} caracteres`,
    };
  }

  if (trimmed.length > VALIDATION.CONCEPT.MAX_LENGTH) {
    return {
      isValid: false,
      error: `El concepto no puede superar ${VALIDATION.CONCEPT.MAX_LENGTH} caracteres`,
    };
  }

  return { isValid: true };
}
