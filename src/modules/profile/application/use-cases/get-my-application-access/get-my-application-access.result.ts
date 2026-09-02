export interface GetMyApplicationAccessResult {
  hasApplicationAccess: boolean;

  memberships: {
    membershipId: string;
    residentialComplexId: string;
    accessRoleId: string;
  }[];
}
