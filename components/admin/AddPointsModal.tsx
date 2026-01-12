"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Client } from "@/types/client";
import { calculatePoints, POINTS_CONFIG } from "@/constants/points";
import { VALIDATION } from "@/constants/validation";
import { TIMING } from "@/constants/animations";
import {
  addPointsSchema,
  type AddPointsFormData,
} from "@/lib/validations/transaction";
import { Button } from "../ui";

interface AddPointsModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function AddPointsModal({
  client,
  isOpen,
  onClose,
  onSuccess,
}: AddPointsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddPointsFormData>({
    resolver: zodResolver(addPointsSchema),
    defaultValues: {
      amount: "",
      concept: VALIDATION.CONCEPT.DEFAULT,
    },
  });

  const amount = watch("amount");
  const points = amount ? calculatePoints(parseInt(amount)) : 0;

  const onSubmit = async (data: AddPointsFormData) => {
    setServerError(null);
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMING.FETCH_TIMEOUT
    );

    try {
      const response = await fetch("/api/transactions/add-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: client._id,
          amount: parseInt(data.amount),
          concept: data.concept.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Error al cargar puntos");
      }

      reset();
      onClose();
      onSuccess(
        `${responseData.data.pointsAdded} puntos agregados exitosamente`
      );
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
    <Modal isOpen={isOpen} onClose={onClose} title="CARGAR PUNTOS">
      <div className="px-6 py-2 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          {client.name} ({client.email})
        </p>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Monto en pesos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MONTO DE COMPRA ($) *
          </label>
          <input
            type="number"
            {...register("amount")}
            placeholder="ej: 500"
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent"
            disabled={isLoading}
          />
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            cada ${POINTS_CONFIG.PESOS_PER_POINT} = 1 punto
          </p>
        </div>

        {/* Puntos calculados */}
        {amount && (
          <div className="border border-aam-orange/80 rounded-lg p-4">
            <p className="text-sm text-aam-orange">PUNTOS A SUMAR:</p>
            <p className="text-3xl font-bold text-aam-orange font-clash-display">
              +{points} pts
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
            placeholder="compra en el local"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent"
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
            className="flex-1 bg-white border border-aam-orange/80 hover:text-aam-orange! font-clash-display"
            disabled={isLoading}
            text={"Cancelar"}
          />
          <Button
            className="font-clash-display flex-1"
            disabled={isLoading || !amount || points === 0}
            text={isLoading ? "Cargando..." : "Cargar Puntos"}
          />
        </div>
      </form>
    </Modal>
  );
}
