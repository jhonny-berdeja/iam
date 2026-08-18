/** Response shape for POST /api/internal-users -- never carries the password or its hash, see InternalUserCreatedResponse on the backend. */
export interface InternalUserCreated {
  id: number;
  name: string;
  lastname: string;
  email: string;
}
