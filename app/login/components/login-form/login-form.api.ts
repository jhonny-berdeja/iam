const GENERIC_ERROR_MESSAGE = "No se pudo iniciar sesión. Intentá de nuevo.";

interface LoginPayload {
  email: string;
  password: string;
}

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback). */
export class LoginApiError extends Error {}

/** Logs in against /api/login. Rejects with LoginApiError on a non-ok response; any other rejection means a network failure. */
export async function login(payload: LoginPayload): Promise<void> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new LoginApiError(await readErrorMessage(response));
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
