/** View of an application, used to populate this family's application selector. */
export interface Application {
  id: number;
  name: string;
  description: string;
}

/** View of a role returned by GET /api/roles?applicationId=<id>. */
export interface Role {
  id: number;
  applicationId: number;
  name: string;
  description: string;
}
