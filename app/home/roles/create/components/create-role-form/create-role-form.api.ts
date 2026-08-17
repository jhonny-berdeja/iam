import type { Application } from "@/app/home/roles/create/components/create-role-form/create-role-form.dto";

const GENERIC_ERROR_MESSAGE = "No se pudo crear el rol. Intentá de nuevo.";

interface CreateRolePayload {
  applicationId: number;
  name: string;
  description: string;
}

/** Fetches every application, to populate the role's application selector. Throws on a non-ok response or network failure. */
export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch("/api/applications");
  if (!response.ok) {
    throw new Error("Failed to load applications");
  }
  const body: { data: Application[] } = await response.json();
  return body.data;
}

/** Thrown for a non-ok response, carrying the server's message (or the generic fallback) -- e.g. the "application not found" 404. */
export class CreateRoleApiError extends Error {}

/** Creates a role. Rejects with CreateRoleApiError on a non-ok response; any other rejection means a network failure. */
export async function createRole(payload: CreateRolePayload): Promise<void> {
  const response = await fetch("/api/roles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new CreateRoleApiError(await readErrorMessage(response));
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
