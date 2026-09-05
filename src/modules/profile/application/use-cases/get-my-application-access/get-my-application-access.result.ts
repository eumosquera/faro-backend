export interface GetMyApplicationAccessResult {
  hasApplicationAccess: boolean;
  memberships: ApplicationAccessMembership[];
}

export interface ApplicationAccessMembership {
  membershipId: string;

  residentialComplex: {
    id: string;
    name: string;
  };

  accessRole: {
    id: string;
    code: string;
    name: string;
  };
}
