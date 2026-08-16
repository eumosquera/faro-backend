import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionRequest {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
