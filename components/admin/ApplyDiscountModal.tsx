"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Client } from "@/types/client";
import { POINTS_CONFIG, calculateDiscount } from "@/constants/points";
import { TIMING } from "@/constants/animations";
import {
  applyDiscountSchema,
  type ApplyDiscountFormData,
} from "@/lib/validations/transaction";
import { Button } from "../ui";

interface ApplyDiscountModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function ApplyDiscountModal({
  client,
  isOpen,
  onClose,
  onSuccess,
}: ApplyDiscountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ApplyDiscountFormData>({
    resolver: zodResolver(applyDiscountSchema),
    defaultValues: {
      pointsToUse: "",
      concept: "Descuento aplicado",
    },
  });

  const pointsToUse = watch("pointsToUse");
  const discountAmount = pointsToUse
    ? calculateDiscount(parseInt(pointsToUse))
    : 0;

  const onSubmit = async (data: ApplyDiscountFormData) => {
    setServerError(null);

    const points = parseInt(data.pointsToUse);

    // Validación adicional: puntos disponibles del cliente
    if (points > client.points) {
      setError("pointsToUse", {
        message: `El cliente solo tiene ${client.points} puntos disponibles`,
      });
      return;
    }

    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMING.FETCH_TIMEOUT
    );

    try {
      const response = await fetch("/api/transactions/apply-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: client._id,
          points,
          concept: data.concept.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Error al aplicar descuento");
      }

      reset();
      onClose();
      onSuccess(`$${discountAmount} de descuento aplicado (-${points} puntos)`);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setServerError("La operación tardó demasiado. Verifica tu conexión.");
        } else {
          setServerError(err.message);
        }
      } else {
        setServerError("Error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="APLICAR DESCUENTO">
      <div className="px-6 py-2 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          {client.name} - {client.points} pts disponibles
        </p>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Puntos a usar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PUNTOS A USAR *
          </label>
          <input
            type="number"
            {...register("pointsToUse")}
            placeholder={`máx: ${client.points}`}
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-orange focus:border-transparent"
            disabled={isLoading}
          />
          {errors.pointsToUse && (
            <p className="text-sm text-red-600 mt-1">
              {errors.pointsToUse.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            1 punto = ${POINTS_CONFIG.DISCOUNT_VALUE_PER_POINT} de descuento
          </p>
        </div>

        {/* Descuento calculado */}
        {pointsToUse && (
          <div className="bg-aam-green/10 rounded-lg p-4 border border-aam-green">
            <p className="text-sm text-gray-600">DESCUENTO A APLICAR:</p>
            <p className="text-3xl font-clash-display font-bold text-green-600">
              ${discountAmount}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              se descontarán {pointsToUse} puntos
            </p>
          </div>
        )}

        {/* Concepto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CONCEPTO *
          </label>
          <input
            type="text"
            {...register("concept")}
            placeholder="descuento aplicado"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-orange focus:border-transparent"
            disabled={isLoading}
          />
          {errors.concept && (
            <p className="text-sm text-red-600 mt-1">
              {errors.concept.message}
            </p>
          )}
        </div>

        {/* Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => {
              reset();
              onClose();
            }}
            className="flex-1 font-clash-display bg-white border border-aam-orange/80 hover:text-aam-orange!"
            disabled={isLoading}
            text={"Cancelar"}
          />
          <Button
            className="flex-1 font-clash-display"
            disabled={isLoading || !pointsToUse || discountAmount === 0}
            text={isLoading ? "Aplicando..." : "Aplicar Descuento"}
          />
        </div>
      </form>
    </Modal>
  );
}
