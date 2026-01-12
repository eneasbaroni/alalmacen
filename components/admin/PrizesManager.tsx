"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Snackbar from "@/components/common/Snackbar";
import { CreatePrizeModal } from "./CreatePrizeModal";
import EditPrizeModal from "./EditPrizeModal";
import PrizeDetailModal from "./PrizeDetailModal";
import PrizesTable from "./PrizesTable";
import { GiftIcon } from "@/app/icons";
import { Prize } from "@/types/prize";
import { Button } from "../ui";

interface PrizesManagerProps {
  prizes: Prize[];
}

type FilterType = "all" | "available" | "unavailable";

export const PrizesManager = ({ prizes }: PrizesManagerProps) => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPrizeDetailModalOpen, setIsPrizeDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  // Filtrar premios según filtro activo
  const filteredPrizes = useMemo(() => {
    if (activeFilter === "available") {
      return prizes.filter((p) => p.status === "available");
    }
    if (activeFilter === "unavailable") {
      return prizes.filter((p) => p.status === "unavailable");
    }
    return prizes;
  }, [prizes, activeFilter]);

  // Contar premios por disponibilidad
  const counts = useMemo(() => {
    return {
      all: prizes.length,
      available: prizes.filter((p) => p.status === "available").length,
      unavailable: prizes.filter((p) => p.status === "unavailable").length,
    };
  }, [prizes]);

  const handleCreateSuccess = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    router.refresh();
  };

  const handleEditSuccess = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    router.refresh();
  };

  const handleViewDetail = (prize: Prize) => {
    setSelectedPrize(prize);
    setIsPrizeDetailModalOpen(true);
  };

  const handleEdit = (prize: Prize) => {
    setSelectedPrize(prize);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      {/* Action Bar */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {prizes.length === 0
            ? "No hay premios cargados"
            : activeFilter === "all"
            ? `${prizes.length} premios`
            : `${filteredPrizes.length} de ${prizes.length} premios`}
        </p>
        <div className="flex gap-3">
          <Link href="/admin/pending-prizes">
            <Button
              text="Ver Premios Solicitados"
              className="bg-white border border-aam-orange/50 hover:text-aam-orange! font-clash-display"
            />
          </Link>

          <Button
            text="+ Crear Premio"
            className="font-clash-display"
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>

      {/* Filtros con tabs */}
      {prizes.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveFilter("all")}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeFilter === "all"
                    ? "border-aam-wine text-aam-wine"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              Todos ({counts.all})
            </button>
            <button
              onClick={() => setActiveFilter("available")}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeFilter === "available"
                    ? "border-aam-wine text-aam-wine"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              Disponibles ({counts.available})
            </button>
            <button
              onClick={() => setActiveFilter("unavailable")}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeFilter === "unavailable"
                    ? "border-aam-wine text-aam-wine"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              No disponibles ({counts.unavailable})
            </button>
          </nav>
        </div>
      )}

      {/* Empty State */}
      {prizes.length === 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex justify-center items-center mb-4">
            <GiftIcon size={60} className="text-aam-wine" />
          </div>
          <h3 className="text-xl font-semibold text-aam-wine mb-2">
            No hay premios disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primer premio para que los clientes puedan
            canjear sus puntos
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="font-clash-display"
            text={"Crear Primer Premio"}
          />
        </div>
      )}

      {/* Tabla de premios */}
      {prizes.length > 0 && (
        <PrizesTable
          prizes={filteredPrizes}
          activeFilter={activeFilter}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
        />
      )}

      {/* Modal para crear premio */}
      <CreatePrizeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal editar premio */}
      <EditPrizeModal
        prize={selectedPrize}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      {/* Modal detalle de premio */}
      <PrizeDetailModal
        prize={selectedPrize}
        isOpen={isPrizeDetailModalOpen}
        onClose={() => setIsPrizeDetailModalOpen(false)}
      />

      {/* Snackbar */}
      <Snackbar
        message={snackbarMessage}
        type="success"
        isOpen={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
};
