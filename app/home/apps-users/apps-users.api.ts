import type {
  AppUser,
  Application,
} from "@/app/home/apps-users/apps-users.dto";

/** Fetches every application user, to populate the "usuario de aplicación" selectors in this family. Throws on a non-ok response or network failure. */
export async function fetchAppUsers(): Promise<AppUser[]> {
  const response = await fetch("/api/apps-users");
  if (!response.ok) {
    throw new Error("Failed to load application users");
  }
  const body: { data: AppUser[] } = await response.json();
  return body.data;
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
