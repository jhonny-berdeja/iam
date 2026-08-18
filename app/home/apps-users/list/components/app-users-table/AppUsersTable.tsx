"use client";

import { useEffect, useState } from "react";
import { fetchAppUsers } from "@/app/home/apps-users/apps-users.api";
import type { AppUser } from "@/app/home/apps-users/apps-users.dto";

const LOAD_ERROR_MESSAGE = "No se pudieron cargar los usuarios de aplicación.";

/** Read-only view, no row actions -- editing/deleting an application user isn't a supported flow yet. clienteSecret never appears here (GET /api/apps-users never returns it). */
export default function AppUsersTable() {
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAppUsers()
      .then((data) => {
        if (cancelled) return;
        setAppUsers(data);
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

  if (appUsers.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No hay usuarios de aplicación creados.
      </p>
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
              Client ID
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
          {appUsers.map((appUser) => (
            <tr key={appUser.id}>
              <td className="px-4 py-2 text-gray-500">{appUser.id}</td>
              <td className="px-4 py-2 text-gray-900">{appUser.clienteId}</td>
              <td className="px-4 py-2 text-gray-900">{appUser.name}</td>
              <td className="px-4 py-2 text-gray-700">
                {appUser.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
