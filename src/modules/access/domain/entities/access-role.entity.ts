export type AccessRoleStatus = 'ACTIVE' | 'INACTIVE';

export interface AccessRoleProps {
  id: string;
  code: string;
  name: string;
  description: string;
  status: AccessRoleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class AccessRole {
  private constructor(private readonly props: AccessRoleProps) {}

  static create(props: AccessRoleProps): AccessRole {
    return new AccessRole(props);
  }

  get id(): string {
    return this.props.id;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): AccessRoleStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
