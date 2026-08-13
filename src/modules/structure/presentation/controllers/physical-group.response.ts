import type { PhysicalGroup } from '../../domain/entities/physical-group.entity';
import type { PhysicalGroupType } from '../../domain/entities/physical-group.entity';

export class PhysicalGroupResponse {
  id!: string;
  residentialComplexId!: string;
  name!: string;
  type!: PhysicalGroupType;

  static fromDomain(physicalGroup: PhysicalGroup): PhysicalGroupResponse {
    const response = new PhysicalGroupResponse();

    response.id = physicalGroup.id;
    response.residentialComplexId = physicalGroup.residentialComplexId;
    response.name = physicalGroup.name;
    response.type = physicalGroup.type;

    return response;
  }
}
