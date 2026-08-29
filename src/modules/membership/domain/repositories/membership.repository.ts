import type { Membership } from '../entities/membership.entity';

export abstract class MembershipRepository {
  abstract save(membership: Membership): Promise<Membership>;

  abstract findById(id: string): Promise<Membership | null>;

  abstract findActiveByPersonId(personId: string): Promise<Membership[]>;

  abstract findActiveByPersonAndResidentialComplex(
    personId: string,
    residentialComplexId: string,
  ): Promise<Membership | null>;

  abstract findActiveByAccessAccountAndResidentialComplex(
    accessAccountId: string,
    residentialComplexId: string,
  ): Promise<Membership | null>;
}
