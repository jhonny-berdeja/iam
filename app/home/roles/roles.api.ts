import type { Application, Role } from "@/app/home/roles/roles.dto";

/** Fetches every application, to populate this family's application selector. Throws on a non-ok response or network failure. */
export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch("/api/applications");
  if (!response.ok) {
    throw new Error("Failed to load applications");
  }
  const body: { data: Application[] } = await response.json();
  return body.data;
}

/** Fetches every role for the given application, to list it in "Ver roles de aplicaciones". Throws on a non-ok response or network failure. */
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
