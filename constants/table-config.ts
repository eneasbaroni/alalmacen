import { BadgeVariant } from "@/components/common/Badge";

// Status badge configurations
export const transactionStatusConfig = {
  pending: { variant: "pending" as BadgeVariant, label: "Pendiente" },
  completed: { variant: "completed" as BadgeVariant, label: "Completado" },
  cancelled: { variant: "cancelled" as BadgeVariant, label: "Cancelado" },
} as const;

export const transactionTypeConfig = {
  purchase: { variant: "purchase" as BadgeVariant, label: "Compra" },
  redeem: { variant: "redeem" as BadgeVariant, label: "Canje" },
} as const;

export const prizeStatusConfig = {
  available: { variant: "available" as BadgeVariant, label: "Disponible" },
  unavailable: {
    variant: "unavailable" as BadgeVariant,
    label: "No Disponible",
  },
} as const;

// Empty messages
export const transactionEmptyMessages = {
  all: "No hay transacciones registradas",
  purchase: "No hay compras registradas",
  redeem: "No hay canjes registrados",
} as const;

export const prizeRedemptionEmptyMessages = {
  all: "No hay premios solicitados",
  pending: "No hay premios pendientes de entrega",
  completed: "No hay premios completados",
  cancelled: "No hay premios cancelados",
} as const;

export const prizeEmptyMessages = {
  all: "No hay premios registrados",
  available: "No hay premios disponibles",
  unavailable: "No hay premios no disponibles",
  search: "No se encontraron premios con ese criterio",
} as const;

export const clientEmptyMessages = {
  all: "No hay clientes registrados",
  search: "No se encontraron clientes con ese criterio",
} as const;

export const myPrizesEmptyMessages = {
  all: "No tienes premios canjeados",
  pending: "No tienes premios pendientes de retirar",
  completed: "No tienes premios retirados",
  cancelled: "No tienes premios cancelados",
} as const;
