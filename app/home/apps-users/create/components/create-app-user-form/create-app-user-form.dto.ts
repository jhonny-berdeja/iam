/**
 * Response shape for POST /api/apps-users -- `clienteSecret` only ever
 * appears here, in plaintext, right after creation (see
 * auth-api/src/modules/apps-users/dto/app-user-created-response.dto.ts).
 */
export interface AppUserCreated {
  id: number;
  clienteId: string;
  clienteSecret: string;
  name: string;
  description: string;
}
