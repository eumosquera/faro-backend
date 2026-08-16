export interface AccessRolePermissionProps {
  id: string;
  accessRoleId: string;
  permissionId: string;
  createdAt: Date;
}

export class AccessRolePermission {
  private constructor(private readonly props: AccessRolePermissionProps) {}

  static create(props: AccessRolePermissionProps): AccessRolePermission {
    return new AccessRolePermission(props);
  }

  get id(): string {
    return this.props.id;
  }

  get accessRoleId(): string {
    return this.props.accessRoleId;
  }

  get permissionId(): string {
    return this.props.permissionId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
