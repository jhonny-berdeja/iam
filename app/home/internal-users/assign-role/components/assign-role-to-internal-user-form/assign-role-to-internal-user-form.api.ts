import type { Role } from "@/app/home/internal-users/assign-role/components/assign-role-to-internal-user-form/assign-role-to-internal-user-form.dto";

const GENERIC_ERROR_MESSAGE = "No se pudo asignar el rol. Intentá de nuevo.";

/** Fetches every role for the given application, to populate the cascading role selector. Throws on a non-ok response or network failure. */
export async function fetchRolesByApplication(
  applicationId: number,
): Promise<Role[]> {
  const response = await fetch(`/api/roles?applicationId=${applicationId}`);
  if (!response.ok) {
    throw new Error("Failed to load roles");
  }
  const body: { data: Role[] } = await response.json();
  return body.data;
}

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback) -- e.g. the "already assigned" 409. */
export class AssignRoleToInternalUserApiError extends Error {}

/** Assigns a role to an internal user. Rejects with AssignRoleToInternalUserApiError on a non-ok response; any other rejection means a network failure. */
export async function assignRoleToInternalUser(
  internalUserId: number,
  roleId: number,
): Promise<void> {
  const response = await fetch(`/api/internal-users/${internalUserId}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roleId }),
  });

  if (!response.ok) {
    throw new AssignRoleToInternalUserApiError(
      await readErrorMessage(response),
    );
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }
  return GENERIC_ERROR_MESSAGE;
}
