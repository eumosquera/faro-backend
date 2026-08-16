export type PermissionStatus = 'ACTIVE' | 'INACTIVE';

export interface PermissionProps {
  id: string;
  code: string;
  name: string;
  description: string;
  status: PermissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Permission {
  private constructor(private readonly props: PermissionProps) {}

  static create(props: PermissionProps): Permission {
    return new Permission(props);
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

  get status(): PermissionStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
