import type { Membership } from '../../domain/entities/membership.entity';

export class DeactivateMembershipResponse {
  readonly id: string;
  readonly personId: string;
  readonly accessAccountId: string | null;
  readonly residentialComplexId: string;
  readonly accessRoleId: string;
  readonly status: string;
  readonly startDate: Date;
  readonly endDate: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

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
