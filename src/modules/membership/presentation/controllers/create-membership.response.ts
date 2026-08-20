import type { Membership } from '../../domain/entities/membership.entity';

export class MembershipResponse {
  id: string;
  personId: string;
  accessAccountId: string | null;
  residentialComplexId: string;
  accessRoleId: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(membership: Membership) {
    this.id = membership.id;
    this.personId = membership.personId;
    this.accessAccountId = membership.accessAccountId;
    this.residentialComplexId = membership.residentialComplexId;
    this.accessRoleId = membership.accessRoleId;
    this.status = membership.status;
    this.startDate = membership.startDate;
    this.endDate = membership.endDate;
    this.createdAt = membership.createdAt;
    this.updatedAt = membership.updatedAt;
  }
}
