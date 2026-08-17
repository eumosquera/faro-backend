import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccessAccountRequest {
  @IsString()
  @IsNotEmpty()
  personId!: string;

  @IsString()
  @IsNotEmpty()
  externalAuthId!: string;
}
