import { Injectable } from '@nestjs/common';

import type { AuthenticatedUserRepository } from '../../../domain/repositories/authenticated-user.repository';
import { PrismaService } from '../../../../../core/database/prisma.service';

@Injectable()
export class PrismaAuthenticatedUserRepository implements AuthenticatedUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPersonIdByExternalAuthId(externalAuthId: string): Promise<string | null> {
    const accessAccount = await this.prisma.accessAccount.findUnique({
      where: {
        externalAuthId,
        status: 'ACTIVE',
      },
      select: {
        personId: true,
      },
    });

    return accessAccount?.personId ?? null;
  }
}
