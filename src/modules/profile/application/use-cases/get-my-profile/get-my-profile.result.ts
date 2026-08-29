export interface GetMyProfileResult {
  person: {
    id: string;
    fullName: string;
    email: string | null;
  };
  primaryMembership: {
    residentialComplex: {
      id: string;
      name: string;
    };
    role: {
      code: string;
      name: string;
    };
  } | null;
}
