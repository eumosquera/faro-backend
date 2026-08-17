import type { AccessAccount } from '../../domain/entities/access-account.entity';

export class AccessAccountResponse {
  id: string;
  personId: string;
  externalAuthId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(accessAccount: AccessAccount) {
    this.id = accessAccount.id;
    this.personId = accessAccount.personId;
    this.externalAuthId = accessAccount.externalAuthId;
    this.status = accessAccount.status;
    this.createdAt = accessAccount.createdAt;
    this.updatedAt = accessAccount.updatedAt;
  }
}
