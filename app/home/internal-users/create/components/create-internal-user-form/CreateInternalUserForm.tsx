"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  createInternalUser,
  CreateInternalUserApiError,
} from "@/app/home/internal-users/create/components/create-internal-user-form/create-internal-user-form.api";

const GENERIC_ERROR_MESSAGE =
  "No se pudo crear el usuario interno. Intentá de nuevo.";
const HOME_PATH = "/home";

/**
 * Real route, not a modal: on success there's no secret to show (unlike
 * CreateAppUserForm), so it navigates straight back to /home. "Cancelar"
 * does the same navigation without saving.
 */
export default function CreateInternalUserForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);
    try {
      await createInternalUser({ name, lastname, email, password });
      router.push(HOME_PATH);
    } catch (submitError) {
      setError(
        submitError instanceof CreateInternalUserApiError
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
        Crear Usuario interno
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-internal-user-name"
            className="text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="create-internal-user-name"
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
            htmlFor="create-internal-user-lastname"
            className="text-sm font-medium text-gray-700"
          >
            Apellido
          </label>
          <input
            id="create-internal-user-lastname"
            type="text"
            required
            maxLength={15}
            value={lastname}
            onChange={(event) => setLastname(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-internal-user-email"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="create-internal-user-email"
            type="email"
            required
            maxLength={30}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-internal-user-password"
            className="text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="create-internal-user-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
