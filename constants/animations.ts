// Constantes de animaciones para consistencia en toda la app
export const ANIMATION = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5,
  },
  EASE: {
    OUT: "easeOut",
    IN: "easeIn",
    IN_OUT: "easeInOut",
  },
  FADE: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  SLIDE_UP: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  SCALE: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  MODAL: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  },
} as const;

// Z-indexes para mantener consistencia en capas
export const Z_INDEX = {
  NAVBAR: 40,
  MODAL_BACKDROP: 50,
  MODAL_CONTENT: 50,
  SNACKBAR: 50,
  TOOLTIP: 60,
} as const;

// Tiempos de espera y duraciones
export const TIMING = {
  SNACKBAR_DURATION: 2000, // 2 segundos
  FETCH_TIMEOUT: 10000, // 10 segundos
  DEBOUNCE_SEARCH: 300, // 300ms
} as const;
