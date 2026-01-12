import { requireAdmin } from "@/lib/auth";
import { UserService } from "@/app/api/DAO/services/userService";
import ClientsStats from "@/components/admin/ClientsStats";
import ClientsTable from "@/components/admin/ClientsTable";
import { Client } from "@/types/client";
import { Link } from "next-transition-router";
import { Button } from "@/components/ui";

export default async function ClientsPage() {
  await requireAdmin();

  // Obtener todos los clientes (no admins)
  const allUsers = await UserService.findAll();
  const clients = allUsers.filter((user) => user.role === "client");

  // Serializar datos para evitar problemas con Mongoose
  const serializedClients: Client[] = clients.map((client) => ({
    _id: client._id.toString(),
    email: client.email,
    name: client.name || "Sin nombre",
    dni: client.dni,
    points: client.points,
    createdAt: client.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mt-24 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">GESTIÓN DE CLIENTES</h1>
            <p className="text-gray-600 mt-2">
              Administra puntos y premios de tus clientes
            </p>
          </div>
          <Link href="/admin/dashboard">
            <Button
              text={"Volver a Dashboard"}
              className="font-clash-display"
            />
          </Link>
        </div>

        {/* Manager con stats y tabla */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Estadísticas */}
          <div className="mb-6">
            <ClientsStats clients={serializedClients} />
          </div>

          {/* Tabla de clientes */}
          <ClientsTable clients={serializedClients} />
        </div>
      </div>
    </div>
  );
}
