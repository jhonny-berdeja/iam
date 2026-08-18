"use client";

import { useEffect, useState } from "react";
import { fetchApplications } from "@/app/home/applications/applications.api";
import type { Application } from "@/app/home/applications/applications.dto";

const LOAD_ERROR_MESSAGE = "No se pudieron cargar las aplicaciones.";

/** Read-only view, no row actions -- editing/deleting an application isn't a supported flow yet. */
export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchApplications()
      .then((data) => {
        if (cancelled) return;
        setApplications(data);
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

  if (applications.length === 0) {
    return <p className="text-sm text-gray-500">No hay aplicaciones creadas.</p>;
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
              Descripción
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {applications.map((application) => (
            <tr key={application.id}>
              <td className="px-4 py-2 text-gray-500">{application.id}</td>
              <td className="px-4 py-2 text-gray-900">{application.name}</td>
              <td className="px-4 py-2 text-gray-700">
                {application.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
