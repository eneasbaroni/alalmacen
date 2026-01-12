/**
 * Determina el color de los puntos según si son positivos o negativos
 */
export const getPointsColor = (points: number): string => {
  return points > 0 ? "text-aam-orange" : "text-aam-wine";
};

/**
 * Formatea el DNI con puntos como separadores
 */
export const formatDNI = (dni: number | string | undefined): string => {
  if (!dni) return "-";
  return dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Trunca texto largo para display en tablas
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
