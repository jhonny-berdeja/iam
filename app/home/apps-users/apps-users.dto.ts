/**
 * View of an application user returned by GET /api/apps-users, shared by
 * every selector in this family (assign-application, assign-role) --
 * promoted here (ancestor common of app/home/apps-users) instead of
 * common/, per "misma familia de rutas" in frontend-structure.md.
 */
export interface AppUser {
  id: number;
  clienteId: string;
  name: string;
  description: string;
}

/** View of an application returned by GET /api/applications, shared by every selector in this family. */
export interface Application {
  id: number;
  name: string;
  description: string;
}
