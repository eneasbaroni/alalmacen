import { Client } from "@/types/client";

interface ClientsStatsProps {
  clients: Client[];
}

export default function ClientsStats({ clients }: ClientsStatsProps) {
  const totalClients = clients.length;
  const totalPoints = clients.reduce((sum, c) => sum + c.points, 0);
  const verifiedClients = clients.filter((c) => c.dni).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-aam-orange/10 border border-aam-orange/30 rounded-lg p-4">
        <p className="text-sm text-aam-orange">Total Clientes</p>
        <p className="text-2xl font-bold text-aam-orange">{totalClients}</p>
        <p className="text-xs text-aam-orange/80 mt-1">clientes registrados</p>
      </div>
      <div className="bg-aam-wine/10 border border-aam-wine/30 rounded-lg p-4">
        <p className="text-sm text-aam-wine">Puntos Distribuidos</p>
        <p className="text-2xl font-bold text-aam-wine">{totalPoints} pts</p>
        <p className="text-xs text-aam-wine/80 mt-1">puntos en circulación</p>
      </div>
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <p className="text-sm text-gray-600">Clientes Verificados</p>
        <p className="text-2xl font-bold text-gray-800">{verifiedClients}</p>
        <p className="text-xs text-gray-600 mt-1">
          {Math.round((verifiedClients / totalClients) * 100)}% del total
        </p>
      </div>
    </div>
  );
}
