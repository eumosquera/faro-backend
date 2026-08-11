export type ResidentialComplexStatus = 'ACTIVE' | 'INACTIVE';

export interface ResidentialComplexProps {
  id: string;
  name: string;
  address: string;
  city: string;
  status: ResidentialComplexStatus;
}

export class ResidentialComplex {
  private constructor(private readonly props: ResidentialComplexProps) {}

  static create(props: ResidentialComplexProps): ResidentialComplex {
    return new ResidentialComplex(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get address(): string {
    return this.props.address;
  }

  get city(): string {
    return this.props.city;
  }

  get status(): ResidentialComplexStatus {
    return this.props.status;
  }
}
