import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePhysicalGroupRequest {
  @IsUUID()
  @IsNotEmpty()
  residentialComplexId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsIn(['TOWER', 'BLOCK'])
  type!: 'TOWER' | 'BLOCK';
}
