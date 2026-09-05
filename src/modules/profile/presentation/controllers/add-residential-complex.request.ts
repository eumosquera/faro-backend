import { IsNotEmpty, IsString } from 'class-validator';

export class AddResidentialComplexRequest {
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
