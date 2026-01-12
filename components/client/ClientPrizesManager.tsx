"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ClientPrizesTable from "./ClientPrizesTable";
import PrizeCard from "./PrizeCard";
import PrizeDetailModal from "@/components/admin/PrizeDetailModal";
import ConfirmPrizeModal from "./ConfirmPrizeModal";
import Snackbar from "@/components/common/Snackbar";
import { Prize } from "@/types/prize";
import { TIMING } from "@/constants/animations";

interface ClientPrizesManagerProps {
  prizes: Prize[];
  userPoints: number;
  isAuthenticated: boolean;
}

export default function ClientPrizesManager({
  prizes,
  userPoints,
  isAuthenticated,
}: ClientPrizesManagerProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPrizeDetailModalOpen, setIsPrizeDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // Filtrar premios para mobile
  const filteredPrizes = prizes
    .filter(
      (prize) =>
        prize.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prize.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.pointsRequired - b.pointsRequired);

  const handleViewDetail = useCallback((prize: Prize) => {
    setSelectedPrize(prize);
    setIsPrizeDetailModalOpen(true);
  }, []);

  const handleAcquire = useCallback(
    (prize: Prize) => {
      if (!isAuthenticated) {
        setSnackbarMessage("Debes iniciar sesión para adquirir premios");
        setSnackbarType("error");
        setShowSnackbar(true);
        return;
      }

      // Abrir modal de confirmación
      setSelectedPrize(prize);
      setIsConfirmModalOpen(true);
    },
    [isAuthenticated]
  );

  const handleConfirmAcquire = async (prize: Prize) => {
    try {
      const response = await fetch("/api/transactions/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prizeID: prize._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al adquirir el premio");
      }

      // Éxito
      setSnackbarMessage(
        data.message || "Premio adquirido. Ve al local para retirarlo."
      );
      setSnackbarType("success");
      setShowSnackbar(true);

      // Cerrar modal
      setIsConfirmModalOpen(false);
      setSelectedPrize(null);

      // Esperar un momento y refrescar la página para actualizar puntos
      setTimeout(() => {
        router.refresh();
      }, TIMING.SNACKBAR_DURATION);
    } catch (error: unknown) {
      console.error("Error al adquirir premio:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al adquirir el premio";
      setSnackbarMessage(errorMessage);
      setSnackbarType("error");
      setShowSnackbar(true);

      // Cerrar modal en caso de error también
      setIsConfirmModalOpen(false);
    }
  };

  if (prizes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">🎁</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          NO HAY PREMIOS DISPONIBLES
        </h3>
        <p className="text-gray-600">
          PRONTO HABRÁ NUEVOS PREMIOS PARA CANJEAR
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop: Tabla */}
      <div className="hidden md:block">
        <ClientPrizesTable
          prizes={prizes}
          userPoints={userPoints}
          onViewDetail={handleViewDetail}
          onAcquire={handleAcquire}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Mobile: Buscador + Cards */}
      <div className="md:hidden">
        {/* Buscador Mobile */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar premios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aam-orange focus:border-transparent"
          />
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {filteredPrizes.map((prize) => (
            <PrizeCard
              key={prize._id}
              prize={prize}
              userPoints={userPoints}
              onViewDetail={handleViewDetail}
              onAcquire={handleAcquire}
            />
          ))}
        </div>
      </div>

      {/* Modal detalle de premio */}
      <PrizeDetailModal
        prize={selectedPrize}
        isOpen={isPrizeDetailModalOpen}
        onClose={() => setIsPrizeDetailModalOpen(false)}
        showTimestamps={false}
      />

      {/* Modal confirmar adquisición */}
      <ConfirmPrizeModal
        prize={selectedPrize}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAcquire}
        userPoints={userPoints}
      />

      {/* Snackbar */}
      <Snackbar
        message={snackbarMessage}
        type={snackbarType}
        isOpen={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
}
