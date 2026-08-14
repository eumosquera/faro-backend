export type IdentificationType = 'CC' | 'TI' | 'CE' | 'PA' | 'NIT' | 'PPT' | 'PEP';

export type PersonStatus = 'ACTIVE' | 'INACTIVE';

export interface PersonProps {
  id: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: PersonStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Person {
  private constructor(private readonly props: PersonProps) {}

  static create(props: PersonProps): Person {
    return new Person(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identificationType(): IdentificationType {
    return this.props.identificationType;
  }

  get identificationNumber(): string {
    return this.props.identificationNumber;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): string | null {
    return this.props.email;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get status(): PersonStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
