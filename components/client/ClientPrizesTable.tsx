"use client";

import { useState, useMemo } from "react";
import { Prize } from "@/types/prize";
import { LockIcon } from "@/app/icons";
import { prizeEmptyMessages } from "@/constants/table-config";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import { Button } from "../ui";

interface ClientPrizesTableProps {
  prizes: Prize[];
  userPoints: number;
  onViewDetail: (prize: Prize) => void;
  onAcquire: (prize: Prize) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ClientPrizesTable({
  prizes,
  userPoints,
  onViewDetail,
  onAcquire,
  searchTerm,
  onSearchChange,
}: ClientPrizesTableProps) {
  // 🚀 Filtrar y ordenar premios
  const filteredPrizes = useMemo(() => {
    return prizes
      .filter(
        (prize) =>
          prize.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prize.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.pointsRequired - b.pointsRequired);
  }, [prizes, searchTerm]);

  const canAcquire = (prize: Prize) => userPoints >= prize.pointsRequired;

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
        label: "PUNTOS NECESARIOS",
        sortable: true,
        className: "whitespace-nowrap",
        render: (prize) => (
          <Badge variant="points">{prize.pointsRequired} pts</Badge>
        ),
      },
      {
        key: "actions",
        label: "ACCIONES",
        sortable: false,
        render: (prize) => (
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => onViewDetail(prize)}
              className="px-2 py-1 text-xs font-normal bg-aam-orange/10 rounded hover:bg-aam-orange/50 transition-colors"
              text={"Ver Detalle"}
            />

            {userPoints >= prize.pointsRequired ? (
              <Button
                onClick={() => onAcquire(prize)}
                className="px-2 py-1 text-xs font-normal "
                text={"Adquirir Premio"}
              />
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-normal text-gray-500 bg-gray-100 rounded-3xl">
                <LockIcon className="w-4 h-4" />
                <span>Puntos Insuficientes</span>
              </div>
            )}
          </div>
        ),
      },
    ],
    [onViewDetail, onAcquire, userPoints]
  );

  const searchBar = (
    <input
      type="text"
      placeholder="buscar premios..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-orange focus:border-transparent"
      aria-label="Buscar premios"
    />
  );

  return (
    <>
      <DataTable
        data={filteredPrizes}
        columns={columns}
        keyExtractor={(prize) => prize._id}
        emptyMessage={
          searchTerm ? prizeEmptyMessages.search : prizeEmptyMessages.available
        }
        searchBar={searchBar}
        rowClassName={(prize) =>
          !canAcquire(prize)
            ? "opacity-60 hover:bg-gray-50"
            : "hover:bg-gray-50"
        }
      />

      {/* Footer con conteo */}
      {filteredPrizes.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">
              Mostrando {filteredPrizes.length} de {prizes.length} premios
            </p>
            <p className="text-xs font-medium text-aam-orange">
              TUS PUNTOS: {userPoints}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
