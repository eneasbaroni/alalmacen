"use client";

import { useState, useMemo } from "react";
import { Prize } from "@/types/prize";
import { formatDateShort } from "@/utils/formatters";
import {
  prizeStatusConfig,
  prizeEmptyMessages,
} from "@/constants/table-config";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";

type FilterType = "all" | "available" | "unavailable";

interface PrizesTableProps {
  prizes: Prize[];
  activeFilter: FilterType;
  onViewDetail: (prize: Prize) => void;
  onEdit: (prize: Prize) => void;
}

export default function PrizesTable({
  prizes,
  activeFilter,
  onViewDetail,
  onEdit,
}: PrizesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // 🚀 Optimización: Evitar recalcular filtro en cada render
  const filteredPrizes = useMemo(
    () =>
      prizes.filter(
        (prize) =>
          prize.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prize.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [prizes, searchTerm]
  );

  const emptyMessage = searchTerm
    ? prizeEmptyMessages.search
    : activeFilter === "available"
    ? prizeEmptyMessages.available
    : activeFilter === "unavailable"
    ? prizeEmptyMessages.unavailable
    : prizeEmptyMessages.all;

  const columns: Column<Prize>[] = useMemo(
    () => [
      {
        key: "name",
        label: "PREMIO",
        sortable: true,
        render: (prize) => (
          <div>
            <div className="text-xs font-medium text-gray-900">
              {prize.name}
            </div>
            <div className="text-xs text-gray-500 max-w-md truncate">
              {prize.description}
            </div>
          </div>
        ),
      },
      {
        key: "pointsRequired",
        label: "PUNTOS REQUERIDOS",
        sortable: true,
        className: "whitespace-nowrap",
        render: (prize) => (
          <Badge variant="points">{prize.pointsRequired} pts</Badge>
        ),
      },
      {
        key: "stock",
        label: "STOCK",
        sortable: true,
        className: "whitespace-nowrap",
        render: (prize) => (
          <div className="text-sm font-semibold">
            {prize.stock === 0 ? (
              <span className="text-red-600">Sin stock</span>
            ) : prize.stock <= 5 ? (
              <span className="text-orange-600">{prize.stock}</span>
            ) : (
              <span className="text-gray-900">{prize.stock}</span>
            )}
          </div>
        ),
      },
      {
        key: "status",
        label: "ESTADO",
        sortable: true,
        className: "whitespace-nowrap",
        render: (prize) => {
          const config =
            prizeStatusConfig[prize.status as keyof typeof prizeStatusConfig];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      },
      {
        key: "createdAt",
        label: "CREADO",
        sortable: true,
        className: "whitespace-nowrap",
        render: (prize) => (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>📅</span>
            {prize.createdAt ? formatDateShort(prize.createdAt) : "-"}
          </div>
        ),
      },
      {
        key: "actions",
        label: "ACCIONES",
        sortable: false,
        render: (prize) => (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onViewDetail(prize)}
              className="px-3 py-1 text-xs font-medium text-aam-wine bg-aam-wine/10 rounded-3xl hover:bg-aam-wine/20 transition-colors"
            >
              Ver Detalle
            </button>
            <button
              onClick={() => onEdit(prize)}
              className="px-3 py-1 text-xs font-medium text-white bg-aam-wine rounded-3xl hover:bg-aam-wine/90 transition-colors"
            >
              Editar
            </button>
          </div>
        ),
      },
    ],
    [onViewDetail, onEdit]
  );

  const searchBar = (
    <input
      type="text"
      placeholder="buscar por nombre o descripción..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent"
    />
  );

  return (
    <>
      <DataTable
        data={filteredPrizes}
        columns={columns}
        keyExtractor={(prize) => prize._id}
        emptyMessage={emptyMessage}
        searchBar={searchBar}
      />

      {/* Footer con conteo */}
      {filteredPrizes.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-600">
            Mostrando {filteredPrizes.length} de {prizes.length} premios
          </p>
        </div>
      )}
    </>
  );
}
