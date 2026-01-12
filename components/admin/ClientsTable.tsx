"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Client } from "@/types/client";
import { formatDateShort } from "@/utils/formatters";
import { formatDNI } from "@/utils/table-helpers";
import { clientEmptyMessages } from "@/constants/table-config";
import AddPointsModal from "./AddPointsModal";
import ApplyDiscountModal from "./ApplyDiscountModal";
import Snackbar from "@/components/common/Snackbar";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";

interface ClientsTableProps {
  clients: Client[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [isApplyDiscountModalOpen, setIsApplyDiscountModalOpen] =
    useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // 🚀 Optimización: Evitar recalcular filtro en cada render
  const filteredClients = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.dni?.toString().includes(searchTerm)
      ),
    [clients, searchTerm]
  );

  const handleAddPoints = (client: Client) => {
    setSelectedClient(client);
    setIsAddPointsModalOpen(true);
  };

  const handleApplyDiscount = (client: Client) => {
    setSelectedClient(client);
    setIsApplyDiscountModalOpen(true);
  };

  const handlePointsSuccess = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    router.refresh();
  };

  const handleDiscountSuccess = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    router.refresh();
  };

  const columns: Column<Client>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Cliente",
        sortable: true,
        render: (client) => (
          <div>
            <div className="text-xs font-medium text-gray-900">
              {client.name}
            </div>
            <div className="text-xs text-gray-500">{client.email}</div>
          </div>
        ),
      },
      {
        key: "dni",
        label: "DNI",
        sortable: true,
        className: "whitespace-nowrap",
        render: (client) => (
          <div className="flex items-center gap-2">
            {client.dni ? (
              <>
                <span className="text-green-500">✓</span>
                <span className="text-xs text-gray-900">
                  {formatDNI(client.dni)}
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-400">✗</span>
                <span className="text-xs text-gray-500">Sin DNI</span>
              </>
            )}
          </div>
        ),
      },
      {
        key: "points",
        label: "Puntos",
        sortable: true,
        className: "whitespace-nowrap",
        render: (client) => <Badge variant="points">{client.points} pts</Badge>,
      },
      {
        key: "createdAt",
        label: "Registro",
        sortable: true,
        className: "whitespace-nowrap",
        render: (client) => (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>📅</span>
            {formatDateShort(client.createdAt)}
          </div>
        ),
      },
      {
        key: "actions",
        label: "Acciones",
        sortable: false,
        render: (client) => (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleAddPoints(client)}
              className="px-3 py-1 text-xs font-medium text-white bg-aam-wine rounded-3xl hover:bg-aam-wine/90 transition-colors"
            >
              Cargar Puntos
            </button>
            <button
              onClick={() => handleApplyDiscount(client)}
              className="px-3 py-1 text-xs font-medium text-white bg-aam-orange rounded-3xl hover:bg-aam-orange/90 transition-colors"
            >
              Aplicar Descuento
            </button>
            <Link
              href={`/admin/clients/${client._id}/prizes`}
              className="px-3 py-1 text-xs font-medium text-aam-wine bg-aam-wine/10 rounded-3xl hover:bg-aam-wine/20 transition-colors inline-block text-center"
            >
              Ver Premios
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const searchBar = (
    <input
      type="text"
      placeholder="Buscar por nombre, email o DNI..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent"
    />
  );

  return (
    <>
      <DataTable
        data={filteredClients}
        columns={columns}
        keyExtractor={(client) => client._id}
        emptyMessage={
          searchTerm ? clientEmptyMessages.search : clientEmptyMessages.all
        }
        searchBar={searchBar}
      />

      {/* Footer con conteo */}
      {filteredClients.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-600">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </p>
        </div>
      )}

      {/* Modal para agregar puntos */}
      {selectedClient && (
        <AddPointsModal
          client={selectedClient}
          isOpen={isAddPointsModalOpen}
          onClose={() => setIsAddPointsModalOpen(false)}
          onSuccess={handlePointsSuccess}
        />
      )}

      {/* Modal para aplicar descuento */}
      {selectedClient && (
        <ApplyDiscountModal
          client={selectedClient}
          isOpen={isApplyDiscountModalOpen}
          onClose={() => setIsApplyDiscountModalOpen(false)}
          onSuccess={handleDiscountSuccess}
        />
      )}

      {/* Snackbar global */}
      <Snackbar
        message={snackbarMessage}
        type="success"
        isOpen={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
}
