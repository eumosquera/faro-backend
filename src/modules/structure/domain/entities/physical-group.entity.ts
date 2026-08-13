export type PhysicalGroupType = 'TOWER' | 'BLOCK';

export interface PhysicalGroupProps {
  id: string;
  residentialComplexId: string;
  name: string;
  type: PhysicalGroupType;
}

export class PhysicalGroup {
  private constructor(private readonly props: PhysicalGroupProps) {}

  static create(props: PhysicalGroupProps): PhysicalGroup {
    return new PhysicalGroup(props);
  }

  get id(): string {
    return this.props.id;
  }

  get residentialComplexId(): string {
    return this.props.residentialComplexId;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): PhysicalGroupType {
    return this.props.type;
  }
}
