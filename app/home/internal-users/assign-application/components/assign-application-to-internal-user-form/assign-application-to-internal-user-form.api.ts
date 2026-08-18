const GENERIC_ERROR_MESSAGE =
  "No se pudo asignar la aplicación. Intentá de nuevo.";

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback) -- e.g. the "already assigned" 409. */
export class AssignApplicationToInternalUserApiError extends Error {}

/** Assigns an application to an internal user. Rejects with AssignApplicationToInternalUserApiError on a non-ok response; any other rejection means a network failure. */
export async function assignApplicationToInternalUser(
  internalUserId: number,
  applicationId: number,
): Promise<void> {
  const response = await fetch(
    `/api/internal-users/${internalUserId}/applications`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    },
  );

  if (!response.ok) {
    throw new AssignApplicationToInternalUserApiError(
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
