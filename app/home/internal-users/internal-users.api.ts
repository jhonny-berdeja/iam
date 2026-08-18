import type {
  InternalUser,
  Application,
} from "@/app/home/internal-users/internal-users.dto";

/** Fetches every internal user, to populate the "usuario interno" selectors in this family. GET /api/internal-users returns a plain array (unwrapped), unlike apps-users/applications. Throws on a non-ok response or network failure. */
export async function fetchInternalUsers(): Promise<InternalUser[]> {
  const response = await fetch("/api/internal-users");
  if (!response.ok) {
    throw new Error("Failed to load internal users");
  }
  return response.json();
}

/** Fetches every application, to populate the "aplicación" selectors in this family. Throws on a non-ok response or network failure. */
export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch("/api/applications");
  if (!response.ok) {
    throw new Error("Failed to load applications");
  }
  const body: { data: Application[] } = await response.json();
  return body.data;
}
