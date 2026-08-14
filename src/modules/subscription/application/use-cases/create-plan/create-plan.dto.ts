export interface CreatePlanDto {
  code: string;
  name: string;
  maxComplexes: number;
  maxUnits: number;
  monthlyPrice: number;
  yearlyPrice: number;
  quarterlyPrice: number;
}
