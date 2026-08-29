import { IsNotEmpty, IsString } from 'class-validator';

export class ResidentialComplexDataRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;
}
