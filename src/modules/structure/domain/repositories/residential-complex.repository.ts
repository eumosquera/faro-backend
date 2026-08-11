import type { ResidentialComplex } from '../entities/residential-complex.entity';

export abstract class ResidentialComplexRepository {
  abstract findById(id: string): Promise<ResidentialComplex | null>;

  abstract save(residentialComplex: ResidentialComplex): Promise<void>;
}
