export interface CreateMembershipDto {
  personId: string;
  accessAccountId?: string | null;
  residentialComplexId: string;
  accessRoleId: string;
  startDate: Date;
  endDate?: Date | null;
}
