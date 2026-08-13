import type { PrivateUnit } from '../../domain/entities/private-unit.entity';
import type { PrivateUnitStatus, PrivateUnitType } from '../../domain/entities/private-unit.entity';

export class PrivateUnitResponse {
  id!: string;
  residentialComplexId!: string;
  physicalGroupId!: string | null;
  identifier!: string;
  type!: PrivateUnitType;
  status!: PrivateUnitStatus;

  static fromDomain(privateUnit: PrivateUnit): PrivateUnitResponse {
    const response = new PrivateUnitResponse();

    response.id = privateUnit.id;
    response.residentialComplexId = privateUnit.residentialComplexId;
    response.physicalGroupId = privateUnit.physicalGroupId;
    response.identifier = privateUnit.identifier;
    response.type = privateUnit.type;
    response.status = privateUnit.status;

    return response;
  }
}
