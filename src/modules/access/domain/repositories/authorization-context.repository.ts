export interface AuthorizationContextRepository {
  findContext(personId: string, residentialComplexId: string): Promise<AuthorizationContext | null>;
}
import type { AuthorizationContext } from './../../application/authorization/authorization-context';

export interface AuthorizationContextRepository {
  findContext(personId: string, residentialComplexId: string): Promise<AuthorizationContext | null>;
}
