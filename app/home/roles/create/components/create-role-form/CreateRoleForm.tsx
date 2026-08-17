"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { Application } from "@/app/home/roles/create/components/create-role-form/create-role-form.dto";
import {
  createRole,
  CreateRoleApiError,
  fetchApplications,
} from "@/app/home/roles/create/components/create-role-form/create-role-form.api";

const GENERIC_ERROR_MESSAGE = "No se pudo crear el rol. Intentá de nuevo.";
const APPLICATIONS_LOAD_ERROR_MESSAGE =
  "No se pudieron cargar las aplicaciones.";
const HOME_PATH = "/home";

/**
 * Real route, not a modal. Fetches its own applications list to populate
 * the selector -- fetch-in-effect pattern with the `cancelled` flag,
 * `setState` only inside `.then()/.catch()`.
 */
export default function CreateRoleForm() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(
    null,
  );

  const [applicationId, setApplicationId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchApplications()
      .then((data) => {
        if (cancelled) return;
        setApplications(data);
        setIsLoadingApplications(false);
      })
      .catch(() => {
        if (!cancelled) {
          setApplicationsError(APPLICATIONS_LOAD_ERROR_MESSAGE);
          setIsLoadingApplications(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);
    try {
      await createRole({
        applicationId: Number(applicationId),
        name,
        description,
      });
      router.push(HOME_PATH);
    } catch (submitError) {
      setError(
        submitError instanceof CreateRoleApiError
          ? submitError.message
          : GENERIC_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Crear Rol</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-role-application"
            className="text-sm font-medium text-gray-700"
          >
            Aplicación
          </label>
          <select
            id="create-role-application"
            required
            disabled={isLoadingApplications}
            value={applicationId}
            onChange={(event) => setApplicationId(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
          >
            <option value="" disabled>
              {isLoadingApplications
                ? "Cargando aplicaciones..."
                : "Seleccioná una aplicación"}
            </option>
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {application.name}
              </option>
            ))}
          </select>
          {applicationsError && (
            <p className="text-sm text-red-600">{applicationsError}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-role-name"
            className="text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="create-role-name"
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
            htmlFor="create-role-description"
            className="text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="create-role-description"
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
