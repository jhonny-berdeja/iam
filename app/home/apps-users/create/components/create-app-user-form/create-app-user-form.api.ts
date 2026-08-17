import type { AppUserCreated } from "@/app/home/apps-users/create/components/create-app-user-form/create-app-user-form.dto";

const GENERIC_ERROR_MESSAGE =
  "No se pudo crear el usuario de aplicación. Intentá de nuevo.";

interface CreateAppUserPayload {
  name: string;
  description: string;
}

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback). */
export class CreateAppUserApiError extends Error {}

/** Creates an application user. Rejects with CreateAppUserApiError on a non-ok response; any other rejection means a network failure. */
export async function createAppUser(
  payload: CreateAppUserPayload,
): Promise<AppUserCreated> {
  const response = await fetch("/api/apps-users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new CreateAppUserApiError(await readErrorMessage(response));
  }

  const body: { data: AppUserCreated } = await response.json();
  return body.data;
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
