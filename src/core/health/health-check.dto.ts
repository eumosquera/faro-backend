import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class HealthCheckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
