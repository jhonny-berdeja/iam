/**
 * View of an internal user returned by GET /api/internal-users, shared by
 * every selector in this family (assign-application, assign-role) --
 * promoted here (ancestor common of app/home/internal-users) instead of
 * common/, per "misma familia de rutas" in frontend-structure.md.
 */
export interface InternalUser {
  id: number;
  name: string;
  lastname: string;
  email: string;
}

/** View of an application returned by GET /api/applications, shared by every selector in this family. */
export interface Application {
  id: number;
  name: string;
  description: string;
}
