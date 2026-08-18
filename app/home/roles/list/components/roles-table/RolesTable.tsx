"use client";

import { useEffect, useState } from "react";
import { fetchApplications, fetchRolesByApplication } from "@/app/home/roles/roles.api";
import type { Application, Role } from "@/app/home/roles/roles.dto";

const APPLICATIONS_LOAD_ERROR_MESSAGE = "No se pudieron cargar las aplicaciones.";
const ROLES_LOAD_ERROR_MESSAGE = "No se pudieron cargar los roles.";

/**
 * GET /roles requires applicationId -- there's no "every role across
 * every application" endpoint, so this picks an application first
 * (same cascading shape as AssignRoleToInternalUserForm's selector,
 * minus the assign step) and lists that application's roles below it.
 * Read-only, no row actions -- editing/deleting a role isn't a
 * supported flow yet.
 */
export default function RolesTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(
    null,
  );

  const [applicationId, setApplicationId] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesApplicationId, setRolesApplicationId] = useState("");
  const [rolesError, setRolesError] = useState<string | null>(null);

  // Derived, not reset synchronously in the effect below (which
  // react-hooks/set-state-in-effect disallows) -- same mechanism
  // AssignRoleToInternalUserForm's own cascading selector uses.
  const isLoadingRoles =
    Boolean(applicationId) && rolesApplicationId !== applicationId;
  const visibleRoles = rolesApplicationId === applicationId ? roles : [];

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

  useEffect(() => {
    if (!applicationId) {
      return;
    }

    let cancelled = false;

    fetchRolesByApplication(Number(applicationId))
      .then((data) => {
        if (cancelled) return;
        setRoles(data);
        setRolesError(null);
        setRolesApplicationId(applicationId);
      })
      .catch(() => {
        if (!cancelled) {
          setRoles([]);
          setRolesError(ROLES_LOAD_ERROR_MESSAGE);
          setRolesApplicationId(applicationId);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="roles-table-application"
          className="text-sm font-medium text-gray-700"
        >
          Aplicación
        </label>
        <select
          id="roles-table-application"
          disabled={isLoadingApplications || applications.length === 0}
          value={applicationId}
          onChange={(event) => setApplicationId(event.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
        >
          <option value="">
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

      {!applicationId && (
        <p className="text-sm text-gray-500">
          Seleccioná una aplicación para ver sus roles.
        </p>
      )}

      {applicationId && isLoadingRoles && (
        <p className="text-sm text-gray-500">Cargando...</p>
      )}

      {applicationId && !isLoadingRoles && rolesError && (
        <p className="text-sm text-red-600">{rolesError}</p>
      )}

      {applicationId &&
        !isLoadingRoles &&
        !rolesError &&
        visibleRoles.length === 0 && (
          <p className="text-sm text-gray-500">
            Esta aplicación no tiene roles creados.
          </p>
        )}

      {applicationId && !isLoadingRoles && !rolesError && visibleRoles.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {visibleRoles.map((role) => (
                <tr key={role.id}>
                  <td className="px-4 py-2 text-gray-500">{role.id}</td>
                  <td className="px-4 py-2 text-gray-900">{role.name}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {role.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
