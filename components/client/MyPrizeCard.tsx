import { Transaction } from "@/types/transaction";
import { Prize } from "@/types/prize";
import { formatDateShort } from "@/utils/formatters";
import { transactionStatusConfig } from "@/constants/table-config";
import Badge from "@/components/common/Badge";
import { Button } from "../ui";

interface MyPrizeCardProps {
  transaction: Transaction;
  onViewDetail: (prize: Prize) => void;
}

export default function MyPrizeCard({
  transaction,
  onViewDetail,
}: MyPrizeCardProps) {
  const prize = transaction.prize;

  if (!prize) return null;

  const status = transaction.status || "pending";
  const statusConfig = transactionStatusConfig[status];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      {/* Header with Status */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {prize.name}
        </h3>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>

      {/* Description */}
      {prize.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {prize.description}
        </p>
      )}

      {/* Info Grid */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Puntos:</span>
          <span className="text-sm font-medium text-aam-orange">
            {Math.abs(transaction.points)} pts
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Fecha Solicitud:</span>
          <span className="text-sm text-gray-900">
            {transaction.createdAt
              ? formatDateShort(transaction.createdAt)
              : "N/A"}
          </span>
        </div>

        {transaction.status === "completed" && transaction.updatedAt && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Retirado:</span>
            <span className="text-sm text-gray-900">
              {formatDateShort(transaction.updatedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onViewDetail(prize)}
        className="w-full px-3 py-2 text-sm font-normal bg-aam-orange/10 rounded hover:bg-aam-orange/50 transition-colors"
        text="Ver Detalle"
      />
    </div>
  );
}
