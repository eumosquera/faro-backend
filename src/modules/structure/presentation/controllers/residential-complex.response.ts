import type { ResidentialComplex } from '../../domain/entities/residential-complex.entity';
import { type ResidentialComplexStatus } from '../../domain/entities/residential-complex.entity';

export class ResidentialComplexResponse {
  id!: string;
  name!: string;
  address!: string;
  city!: string;
  status!: ResidentialComplexStatus;

  static fromDomain(residentialComplex: ResidentialComplex): ResidentialComplexResponse {
    const response = new ResidentialComplexResponse();

    response.id = residentialComplex.id;
    response.name = residentialComplex.name;
    response.address = residentialComplex.address;
    response.city = residentialComplex.city;
    response.status = residentialComplex.status;

    return response;
  }
}
