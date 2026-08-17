export type AccessAccountStatus = 'ACTIVE' | 'INACTIVE';

export interface AccessAccountProps {
  id: string;
  personId: string;
  externalAuthId: string;
  status: AccessAccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class AccessAccount {
  private constructor(private readonly props: AccessAccountProps) {}

  static create(props: AccessAccountProps): AccessAccount {
    return new AccessAccount(props);
  }

  get id(): string {
    return this.props.id;
  }

  get personId(): string {
    return this.props.personId;
  }

  get externalAuthId(): string {
    return this.props.externalAuthId;
  }

  get status(): AccessAccountStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateStatus(status: AccessAccountStatus): AccessAccount {
    return AccessAccount.create({
      ...this.props,
      status,
      updatedAt: new Date(),
    });
  }
}
