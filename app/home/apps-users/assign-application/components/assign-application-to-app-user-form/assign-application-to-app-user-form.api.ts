const GENERIC_ERROR_MESSAGE =
  "No se pudo asignar la aplicación. Intentá de nuevo.";

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback) -- e.g. the "already assigned" 409. */
export class AssignApplicationToAppUserApiError extends Error {}

/** Assigns an application to an application user. Rejects with AssignApplicationToAppUserApiError on a non-ok response; any other rejection means a network failure. */
export async function assignApplicationToAppUser(
  appUserId: number,
  applicationId: number,
): Promise<void> {
  const response = await fetch(`/api/apps-users/${appUserId}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applicationId }),
  });

  if (!response.ok) {
    throw new AssignApplicationToAppUserApiError(
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
