"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { dniSchema, type DNIFormData } from "@/lib/validations/dni";

interface DNIFormProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DNIForm({ email, onSuccess, onCancel }: DNIFormProps) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DNIFormData>({
    resolver: zodResolver(dniSchema),
  });

  const onSubmit = async (data: DNIFormData) => {
    setServerError("");
    setLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          dni: parseInt(data.dni, 10),
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || "Error al actualizar DNI");
      }

      onSuccess();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
      <div>
        <label
          htmlFor="dni"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Número de DNI
        </label>
        <input
          type="text"
          id="dni"
          {...register("dni")}
          placeholder="Ej: 12345678"
          maxLength={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          disabled={loading}
        />
        {errors.dni && (
          <p className="mt-2 text-xs text-red-600">{errors.dni.message}</p>
        )}
        {serverError && (
          <p className="mt-2 text-xs text-red-600">{serverError}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-aam-orange text-white hover:bg-aam-orange/80 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar DNI"}
        </button>
      </div>
    </form>
  );
}
