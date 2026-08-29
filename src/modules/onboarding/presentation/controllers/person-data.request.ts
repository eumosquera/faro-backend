import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const IDENTIFICATION_TYPES = ['CC', 'TI', 'CE', 'PA', 'NIT', 'PPT', 'PEP'] as const;

export class PersonDataRequest {
  @IsEnum(IDENTIFICATION_TYPES)
  identificationType!: (typeof IDENTIFICATION_TYPES)[number];

  @IsString()
  @IsNotEmpty()
  identificationNumber!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
