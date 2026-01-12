"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { TIMING } from "@/constants/animations";
import { prizeSchema, type PrizeFormData } from "@/lib/validations/prize";
import { Prize } from "@/types/prize";
import { Button } from "../ui";

interface EditPrizeModalProps {
  prize: Prize | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function EditPrizeModal({
  prize,
  isOpen,
  onClose,
  onSuccess,
}: EditPrizeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrizeFormData>({
    resolver: zodResolver(prizeSchema),
    defaultValues: {
      name: "",
      description: "",
      pointsRequired: undefined,
      status: "available",
      stock: undefined,
    },
  });

  // Precargar valores cuando se abre el modal
  useEffect(() => {
    if (isOpen && prize) {
      reset({
        name: prize.name,
        description: prize.description,
        pointsRequired: prize.pointsRequired,
        status: prize.status,
        stock: prize.stock,
      });
    }
  }, [isOpen, prize, reset]);

  const onSubmit = async (data: PrizeFormData) => {
    if (!prize) return;

    setServerError("");
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMING.FETCH_TIMEOUT
    );

    try {
      const response = await fetch(`/api/prizes/update/${prize._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          description: data.description.trim(),
          pointsRequired: data.pointsRequired,
          stock: data.stock ?? null,
          status: data.status,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Error al actualizar premio");
      }

      onClose();
      onSuccess(`Premio "${data.name}" actualizado exitosamente`);
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

  const handleClose = () => {
    setServerError("");
    onClose();
  };

  if (!prize) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="EDITAR PREMIO"
      maxWidth="lg"
    >
      <div className="px-6 py-2">
        <p className="text-sm text-gray-600">
          MODIFICA LA INFORMACIÓN DEL PREMIO
        </p>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NOMBRE DEL PREMIO *
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="ej: descuento 20%"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent disabled:bg-gray-100"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DESCRIPCIÓN *
          </label>
          <textarea
            {...register("description")}
            placeholder="describe el premio..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent resize-none disabled:bg-gray-100"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-2 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Puntos requeridos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PUNTOS NECESARIOS *
          </label>
          <input
            type="number"
            {...register("pointsRequired", { valueAsNumber: true })}
            placeholder="ej: 50"
            min="1"
            step="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent disabled:bg-gray-100"
            disabled={isLoading}
          />
          {errors.pointsRequired && (
            <p className="mt-2 text-xs text-red-600">
              {errors.pointsRequired.message}
            </p>
          )}

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              STOCK *
            </label>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="ej: 10"
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent disabled:bg-gray-100"
              disabled={isLoading}
            />
            {errors.stock && (
              <p className="mt-2 text-xs text-red-600">
                {errors.stock.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              cantidad disponible del premio
            </p>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ESTADO *
          </label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aam-wine focus:border-transparent disabled:bg-gray-100"
            disabled={isLoading}
          >
            <option value="available">DISPONIBLE</option>
            <option value="unavailable">NO DISPONIBLE</option>
          </select>
          {errors.status && (
            <p className="mt-2 text-xs text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Error del servidor */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleClose}
            className="flex-1 bg-white border border-aam-orange/80 hover:text-aam-orange! font-clash-display "
            disabled={isLoading}
            text={"Cancelar"}
          />

          <Button
            className="flex-1 font-clash-display"
            disabled={isLoading}
            text={isLoading ? "Actualizando..." : "Guardar Cambios"}
          />
        </div>
      </form>
    </Modal>
  );
}
