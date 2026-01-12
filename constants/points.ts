/**
 * Constantes de conversión de puntos
 */
export const POINTS_CONFIG = {
  // Pesos por cada punto al CARGAR (cada $100 de compra = 1 punto)
  PESOS_PER_POINT: 100,

  // Valor de cada punto al DESCONTAR (1 punto = $2 de descuento)
  DISCOUNT_VALUE_PER_POINT: 2,

  // Punto mínimo que se puede cargar
  MIN_AMOUNT: 100,
} as const;

/**
 * Calcula los puntos basado en el monto en pesos
 */
export const calculatePoints = (amount: number): number => {
  return Math.floor(amount / POINTS_CONFIG.PESOS_PER_POINT);
};

/**
 * Calcula el monto de descuento basado en los puntos
 */
export const calculateDiscount = (points: number): number => {
  return points * POINTS_CONFIG.DISCOUNT_VALUE_PER_POINT;
};

/**
 * Calcula el monto en pesos basado en los puntos
 */
export const calculateAmount = (points: number): number => {
  return points * POINTS_CONFIG.PESOS_PER_POINT;
};
