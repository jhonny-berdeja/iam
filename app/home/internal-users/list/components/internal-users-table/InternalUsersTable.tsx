"use client";

import { useEffect, useState } from "react";
import { fetchInternalUsers } from "@/app/home/internal-users/internal-users.api";
import type { InternalUser } from "@/app/home/internal-users/internal-users.dto";

const LOAD_ERROR_MESSAGE = "No se pudieron cargar los usuarios internos.";

/** Read-only view, no row actions -- editing/deleting an internal user isn't a supported flow yet. Password never appears here (GET /api/internal-users never returns it). */
export default function InternalUsersTable() {
  const [internalUsers, setInternalUsers] = useState<InternalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchInternalUsers()
      .then((data) => {
        if (cancelled) return;
        setInternalUsers(data);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(LOAD_ERROR_MESSAGE);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Cargando...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (internalUsers.length === 0) {
    return (
      <p className="text-sm text-gray-500">No hay usuarios internos creados.</p>
    );
  }

  return (
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
              Apellido
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {internalUsers.map((internalUser) => (
            <tr key={internalUser.id}>
              <td className="px-4 py-2 text-gray-500">{internalUser.id}</td>
              <td className="px-4 py-2 text-gray-900">
                {internalUser.name}
              </td>
              <td className="px-4 py-2 text-gray-900">
                {internalUser.lastname}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {internalUser.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
