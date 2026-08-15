export type RolePersonaStatus = 'ACTIVE' | 'INACTIVE';

export interface RolePersonaProps {
  id: string;
  code: string;
  name: string;
  description: string;
  status: RolePersonaStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class RolePersona {
  private constructor(private readonly props: RolePersonaProps) {}

  static create(props: RolePersonaProps): RolePersona {
    return new RolePersona(props);
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

  get status(): RolePersonaStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
