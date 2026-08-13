import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePrivateUnitRequest {
  @IsUUID()
  residentialComplexId!: string;

  @IsOptional()
  @IsUUID()
  physicalGroupId?: string;

  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @IsIn(['APARTMENT', 'HOUSE', 'LOCAL', 'OFFICE'])
  type!: 'APARTMENT' | 'HOUSE' | 'LOCAL' | 'OFFICE';
}
