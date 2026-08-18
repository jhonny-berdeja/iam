/** View of a role returned by GET /api/roles?applicationId=<id>, used to populate this form's cascading role selector. */
export interface Role {
  id: number;
  applicationId: number;
  name: string;
  description: string;
}
