import type { InternalUserCreated } from "@/app/home/internal-users/create/components/create-internal-user-form/create-internal-user-form.dto";

const GENERIC_ERROR_MESSAGE =
  "No se pudo crear el usuario interno. Intentá de nuevo.";

interface CreateInternalUserPayload {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback) -- e.g. the "email already in use" 409. */
export class CreateInternalUserApiError extends Error {}

/** Creates an internal user. Rejects with CreateInternalUserApiError on a non-ok response; any other rejection means a network failure. */
export async function createInternalUser(
  payload: CreateInternalUserPayload,
): Promise<InternalUserCreated> {
  const response = await fetch("/api/internal-users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new CreateInternalUserApiError(await readErrorMessage(response));
  }

  return response.json();
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
