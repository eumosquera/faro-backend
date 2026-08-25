export interface AuthenticatedUserRepository {
  findPersonIdByExternalAuthId(externalAuthId: string): Promise<string | null>;
}
