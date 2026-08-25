export type MembershipStatus = 'ACTIVE' | 'INACTIVE';

export interface MembershipProps {
  id: string;
  personId: string;
  accessAccountId: string | null;
  residentialComplexId: string;
  accessRoleId: string;
  status: MembershipStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Membership {
  private constructor(private readonly props: MembershipProps) {}

  static create(props: MembershipProps): Membership {
    return new Membership(props);
  }

  get id(): string {
    return this.props.id;
  }

  get personId(): string {
    return this.props.personId;
  }

  get accessAccountId(): string | null {
    return this.props.accessAccountId;
  }

  get residentialComplexId(): string {
    return this.props.residentialComplexId;
  }

  get accessRoleId(): string {
    return this.props.accessRoleId;
  }

  get status(): MembershipStatus {
    return this.props.status;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date | null {
    return this.props.endDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateStatus(status: MembershipStatus): Membership {
    return Membership.create({
      ...this.props,
      status,
      updatedAt: new Date(),
    });
  }

  deactivate(endDate: Date): Membership {
    return Membership.create({
      ...this.props,
      status: 'INACTIVE',
      endDate,
      updatedAt: new Date(),
    });
  }
}
