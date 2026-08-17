/** View of an application returned by GET /api/applications, used to populate the role's application selector. */
export interface Application {
  id: number;
  name: string;
  description: string;
}
