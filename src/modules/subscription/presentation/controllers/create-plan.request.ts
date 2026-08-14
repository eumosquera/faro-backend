import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePlanRequest {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(1)
  maxComplexes!: number;

  @IsNumber()
  @Min(1)
  maxUnits!: number;

  @IsNumber()
  @Min(0)
  monthlyPrice!: number;

  @IsNumber()
  @Min(0)
  quarterlyPrice!: number;

  @IsNumber()
  @Min(0)
  yearlyPrice!: number;
}
