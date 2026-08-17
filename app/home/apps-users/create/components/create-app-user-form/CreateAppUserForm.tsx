"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { AppUserCreated } from "@/app/home/apps-users/create/components/create-app-user-form/create-app-user-form.dto";
import {
  createAppUser,
  CreateAppUserApiError,
} from "@/app/home/apps-users/create/components/create-app-user-form/create-app-user-form.api";

const GENERIC_ERROR_MESSAGE =
  "No se pudo crear el usuario de aplicación. Intentá de nuevo.";
const COPY_FEEDBACK_MS = 2000;
const HOME_PATH = "/home";

type CopiedField = "clientId" | "clientSecret" | null;

/**
 * Real route, not a modal. On success it doesn't navigate away right
 * away: the backend's secret is only ever returned here, in plaintext,
 * so this component switches to a read-only result view instead of the
 * form. "Listo" is the only way out, once the user has copied what they
 * need.
 */
export default function CreateAppUserForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppUser, setCreatedAppUser] = useState<AppUserCreated | null>(
    null,
  );
  const [copiedField, setCopiedField] = useState<CopiedField>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);
    try {
      const appUser = await createAppUser({ name, description });
      setCreatedAppUser(appUser);
    } catch (submitError) {
      setError(
        submitError instanceof CreateAppUserApiError
          ? submitError.message
          : GENERIC_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy(field: "clientId" | "clientSecret", value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField((current) => (current === field ? null : current));
    }, COPY_FEEDBACK_MS);
  }

  if (createdAppUser) {
    return (
      <>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Usuario de aplicación creado
        </h2>
        <p className="mb-6 text-sm text-red-600">
          Guardá el secreto ahora: no vas a poder volver a verlo después de
          esto.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="created-client-id"
              className="text-sm font-medium text-gray-700"
            >
              ID de cliente
            </label>
            <div className="flex gap-2">
              <input
                id="created-client-id"
                type="text"
                readOnly
                value={createdAppUser.clienteId}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  void handleCopy("clientId", createdAppUser.clienteId)
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                {copiedField === "clientId" ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="created-client-secret"
              className="text-sm font-medium text-gray-700"
            >
              Secreto de cliente
            </label>
            <div className="flex gap-2">
              <input
                id="created-client-secret"
                type="text"
                readOnly
                value={createdAppUser.clienteSecret}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  void handleCopy("clientSecret", createdAppUser.clienteSecret)
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                {copiedField === "clientSecret" ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(HOME_PATH)}
            className="mt-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Listo
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        Crear Usuario de aplicación
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-app-user-name"
            className="text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="create-app-user-name"
            type="text"
            required
            maxLength={20}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-app-user-description"
            className="text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="create-app-user-description"
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
