import type { Application } from "@/app/home/applications/applications.dto";

/** Fetches every application, to list it in this family's "Ver aplicaciones" table. Throws on a non-ok response or network failure. */
export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch("/api/applications");
  if (!response.ok) {
    throw new Error("Failed to load applications");
  }
  const body: { data: Application[] } = await response.json();
  return body.data;
}
