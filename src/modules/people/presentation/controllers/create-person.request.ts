import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePersonRequest {
  @IsIn(['CC', 'TI', 'CE', 'PA', 'NIT', 'PPT', 'PEP'])
  identificationType!: 'CC' | 'TI' | 'CE' | 'PA' | 'NIT' | 'PPT' | 'PEP';

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
