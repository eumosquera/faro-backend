import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class HealthCheckDto {
  @ApiProperty({
    description: 'Application name used to validate the global request pipeline.',
    example: 'Project Faro',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Contact email used to validate request data.',
    example: 'admin@faro.local',
  })
  @IsEmail()
  email: string;
}
