const GENERIC_ERROR_MESSAGE =
  "No se pudo crear la aplicación. Intentá de nuevo.";

interface CreateApplicationPayload {
  name: string;
  description: string;
}

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback). */
export class CreateApplicationApiError extends Error {}

/** Creates an application. Rejects with CreateApplicationApiError on a non-ok response; any other rejection means a network failure. */
export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<void> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new CreateApplicationApiError(await readErrorMessage(response));
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
