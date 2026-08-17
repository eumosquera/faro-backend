import type { AccessAccount } from '../entities/access-account.entity';

export abstract class AccessAccountRepository {
  abstract findById(id: string): Promise<AccessAccount | null>;

  abstract findByPersonId(personId: string): Promise<AccessAccount | null>;

  abstract findByExternalAuthId(externalAuthId: string): Promise<AccessAccount | null>;

  abstract save(accessAccount: AccessAccount): Promise<void>;
}
