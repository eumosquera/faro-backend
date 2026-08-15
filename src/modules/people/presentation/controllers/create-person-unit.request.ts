import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePersonUnitRequest {
  @IsUUID()
  @IsNotEmpty()
  personId!: string;

  @IsUUID()
  @IsNotEmpty()
  privateUnitId!: string;

  @IsUUID()
  @IsNotEmpty()
  rolePersonaId!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsString()
  observations?: string | null;
}
