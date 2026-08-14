export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface PlanProps {
  id: string;
  code: string;
  name: string;
  maxComplexes: number;
  maxUnits: number;
  monthlyPrice: number;
  yearlyPrice: number;
  quarterlyPrice: number;
  status: PlanStatus;
}

export class Plan {
  private constructor(private readonly props: PlanProps) {}

  static create(props: PlanProps): Plan {
    return new Plan(props);
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

  get maxComplexes(): number {
    return this.props.maxComplexes;
  }

  get maxUnits(): number {
    return this.props.maxUnits;
  }

  get monthlyPrice(): number {
    return this.props.monthlyPrice;
  }

  get yearlyPrice(): number {
    return this.props.yearlyPrice;
  }

  get quarterlyPrice(): number {
    return this.props.quarterlyPrice;
  }

  get status(): PlanStatus {
    return this.props.status;
  }
}
