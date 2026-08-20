import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMembershipRequest {
  @IsString()
  @IsNotEmpty()
  personId!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  accessAccountId?: string | null;

  @IsString()
  @IsNotEmpty()
  residentialComplexId!: string;

  @IsString()
  @IsNotEmpty()
  accessRoleId!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
