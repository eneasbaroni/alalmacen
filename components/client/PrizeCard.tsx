import { Prize } from "@/types/prize";
import { LockIcon } from "@/app/icons";
import Badge from "@/components/common/Badge";
import { Button } from "../ui";

interface PrizeCardProps {
  prize: Prize;
  userPoints: number;
  onViewDetail: (prize: Prize) => void;
  onAcquire: (prize: Prize) => void;
}

export default function PrizeCard({
  prize,
  userPoints,
  onViewDetail,
  onAcquire,
}: PrizeCardProps) {
  const canAcquire = userPoints >= prize.pointsRequired;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {prize.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {prize.description}
        </p>
      </div>

      {/* Points Badge */}
      <div className="mb-4">
        <Badge variant="points">{prize.pointsRequired} pts</Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => onViewDetail(prize)}
          className="flex-1 px-3 py-2 text-sm font-normal bg-aam-orange/10 rounded hover:bg-aam-orange/50 transition-colors font-clash-display"
          text="Ver Detalle"
        />

        {canAcquire ? (
          <Button
            onClick={() => onAcquire(prize)}
            className="flex-1 px-3 py-2 text-sm font-normal font-clash-display"
            text="Canjear"
          />
        ) : (
          <button
            disabled
            className="flex-1 px-3 py-2 text-sm font-normal bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center gap-1 rounded font-clash-display"
          >
            <LockIcon />
            <span>Bloqueado</span>
          </button>
        )}
      </div>

      {/* Availability Indicator */}
      {!canAcquire && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Te faltan {prize.pointsRequired - userPoints} puntos
        </p>
      )}
    </div>
  );
}
