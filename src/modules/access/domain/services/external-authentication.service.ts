export interface ExternalAuthenticationService {
  getAuthenticatedUser(authorizationHeader: string | undefined): Promise<{
    externalAuthId: string;
  }>;
}
