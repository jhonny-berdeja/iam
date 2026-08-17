"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  createApplication,
  CreateApplicationApiError,
} from "@/app/home/applications/create/components/create-application-form/create-application-form.api";

const GENERIC_ERROR_MESSAGE =
  "No se pudo crear la aplicación. Intentá de nuevo.";
const HOME_PATH = "/home";

/**
 * Real route, not a modal: on success there's no list to notify, so the
 * only thing left to do is navigate back to /home. "Cancelar" does the
 * same navigation without saving.
 */
export default function CreateApplicationForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);
    try {
      await createApplication({ name, description });
      router.push(HOME_PATH);
    } catch (submitError) {
      setError(
        submitError instanceof CreateApplicationApiError
          ? submitError.message
          : GENERIC_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Crear Aplicación
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-application-name"
            className="text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="create-application-name"
            type="text"
            required
            maxLength={15}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-application-description"
            className="text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="create-application-description"
            required
            maxLength={200}
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => router.push(HOME_PATH)}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {isSubmitting ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>
    </>
  );
}
