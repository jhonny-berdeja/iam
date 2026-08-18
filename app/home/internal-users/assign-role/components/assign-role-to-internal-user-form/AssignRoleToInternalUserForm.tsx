"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type {
  InternalUser,
  Application,
} from "@/app/home/internal-users/internal-users.dto";
import {
  fetchInternalUsers,
  fetchApplications,
} from "@/app/home/internal-users/internal-users.api";
import type { Role } from "@/app/home/internal-users/assign-role/components/assign-role-to-internal-user-form/assign-role-to-internal-user-form.dto";
import {
  assignRoleToInternalUser,
  AssignRoleToInternalUserApiError,
  fetchRolesByApplication,
} from "@/app/home/internal-users/assign-role/components/assign-role-to-internal-user-form/assign-role-to-internal-user-form.api";

const GENERIC_ERROR_MESSAGE = "No se pudo asignar el rol. Intentá de nuevo.";
const INTERNAL_USERS_LOAD_ERROR_MESSAGE =
  "No se pudieron cargar los usuarios internos.";
const APPLICATIONS_LOAD_ERROR_MESSAGE =
  "No se pudieron cargar las aplicaciones.";
const ROLES_LOAD_ERROR_MESSAGE = "No se pudieron cargar los roles.";
const HOME_PATH = "/home";

/**
 * Real route, not a modal. The role selector cascades from the chosen
 * application -- same fetch-in-effect + `cancelled` pattern as the other
 * selectors, but this one also depends on `applicationId`, so it
 * refetches every time the application changes (same mechanism
 * CreateRoleForm uses for its own application selector, with the
 * dependency added). `applicationId` is only used locally to filter this
 * selector -- it is never sent in the final submit.
 *
 * `rolesApplicationId` tracks which application the last completed role
 * fetch belongs to -- `isLoadingRoles`/the visible role list are derived
 * from comparing it to the currently selected `applicationId`, instead of
 * resetting state synchronously in the effect body (which
 * `react-hooks/set-state-in-effect` disallows: every setState call here
 * stays inside `.then()/.catch()`).
 */
export default function AssignRoleToInternalUserForm() {
  const router = useRouter();

  const [internalUsers, setInternalUsers] = useState<InternalUser[]>([]);
  const [isLoadingInternalUsers, setIsLoadingInternalUsers] = useState(true);
  const [internalUsersError, setInternalUsersError] = useState<string | null>(
    null,
  );

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(
    null,
  );

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesApplicationId, setRolesApplicationId] = useState("");
  const [rolesError, setRolesError] = useState<string | null>(null);

  const [internalUserId, setInternalUserId] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoadingRoles = Boolean(applicationId) && rolesApplicationId !== applicationId;
  const visibleRoles = rolesApplicationId === applicationId ? roles : [];

  useEffect(() => {
    let cancelled = false;

    fetchInternalUsers()
      .then((data) => {
        if (cancelled) return;
        setInternalUsers(data);
        setIsLoadingInternalUsers(false);
      })
      .catch(() => {
        if (!cancelled) {
          setInternalUsersError(INTERNAL_USERS_LOAD_ERROR_MESSAGE);
          setIsLoadingInternalUsers(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);
    try {
      await assignRoleToInternalUser(Number(internalUserId), Number(roleId));
      router.push(HOME_PATH);
    } catch (submitError) {
      setError(
        submitError instanceof AssignRoleToInternalUserApiError
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
        Asignar rol a usuario interno
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="assign-role-internal-user"
            className="text-sm font-medium text-gray-700"
          >
            Usuario interno
          </label>
          <select
            id="assign-role-internal-user"
            required
            disabled={isLoadingInternalUsers || internalUsers.length === 0}
            value={internalUserId}
            onChange={(event) => setInternalUserId(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
          >
            <option value="" disabled>
              {isLoadingInternalUsers
                ? "Cargando usuarios internos..."
                : "Seleccioná un usuario interno"}
            </option>
            {internalUsers.map((internalUser) => (
              <option key={internalUser.id} value={internalUser.id}>
                {internalUser.name} {internalUser.lastname} (
                {internalUser.email})
              </option>
            ))}
          </select>
          {internalUsersError && (
            <p className="text-sm text-red-600">{internalUsersError}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="assign-role-application"
            className="text-sm font-medium text-gray-700"
          >
            Aplicación
          </label>
          <select
            id="assign-role-application"
            required
            disabled={isLoadingApplications || applications.length === 0}
            value={applicationId}
            onChange={(event) => {
              setApplicationId(event.target.value);
              setRoleId("");
            }}
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
            htmlFor="assign-role-role"
            className="text-sm font-medium text-gray-700"
          >
            Rol
          </label>
          <select
            id="assign-role-role"
            required
            disabled={
              !applicationId || isLoadingRoles || visibleRoles.length === 0
            }
            value={roleId}
            onChange={(event) => setRoleId(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:opacity-60"
          >
            <option value="" disabled>
              {!applicationId
                ? "Seleccioná una aplicación primero"
                : isLoadingRoles
                  ? "Cargando roles..."
                  : "Seleccioná un rol"}
            </option>
            {visibleRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {rolesError && <p className="text-sm text-red-600">{rolesError}</p>}
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
            {isSubmitting ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </form>
    </>
  );
}
