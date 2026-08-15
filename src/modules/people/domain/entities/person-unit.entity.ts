export type PersonUnitStatus = 'ACTIVE' | 'FINISHED';

export interface PersonUnitProps {
  id: string;
  personId: string;
  privateUnitId: string;
  rolePersonaId: string;
  startDate: Date;
  endDate: Date | null;
  status: PersonUnitStatus;
  observations: string | null;
}

export class PersonUnit {
  private constructor(private readonly props: PersonUnitProps) {}

  static create(props: PersonUnitProps): PersonUnit {
    return new PersonUnit(props);
  }

  get id(): string {
    return this.props.id;
  }

  get personId(): string {
    return this.props.personId;
  }

  get privateUnitId(): string {
    return this.props.privateUnitId;
  }

  get rolePersonaId(): string {
    return this.props.rolePersonaId;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date | null {
    return this.props.endDate;
  }

  get status(): PersonUnitStatus {
    return this.props.status;
  }

  get observations(): string | null {
    return this.props.observations;
  }
}
