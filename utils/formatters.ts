/**
 * Formatea una fecha al formato español completo
 */
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formatea una fecha al formato corto para tablas (DD/MM/YYYY)
 */
export const formatDateShort = (date: Date | string): string => {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formatea un número de puntos
 */
export const formatPoints = (points: number): string => {
  return `${Math.abs(points)} pts`;
};
