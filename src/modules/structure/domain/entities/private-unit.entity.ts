export type PrivateUnitType = 'APARTMENT' | 'HOUSE' | 'LOCAL' | 'OFFICE';

export type PrivateUnitStatus = 'ACTIVE' | 'INACTIVE';

export interface PrivateUnitProps {
  id: string;
  residentialComplexId: string;
  physicalGroupId: string | null;
  identifier: string;
  type: PrivateUnitType;
  status: PrivateUnitStatus;
}

export class PrivateUnit {
  private constructor(private readonly props: PrivateUnitProps) {}

  static create(props: PrivateUnitProps): PrivateUnit {
    return new PrivateUnit(props);
  }

  get id(): string {
    return this.props.id;
  }

  get residentialComplexId(): string {
    return this.props.residentialComplexId;
  }

  get physicalGroupId(): string | null {
    return this.props.physicalGroupId;
  }

  get identifier(): string {
    return this.props.identifier;
  }

  get type(): PrivateUnitType {
    return this.props.type;
  }

  get status(): PrivateUnitStatus {
    return this.props.status;
  }
}
