import { Injectable } from '@nestjs/common';

import { AuthorizationContext } from '../../../application/authorization/authorization-context';
import { AuthorizationContextRepository } from '../../../domain/repositories/authorization-context.repository';
import { PrismaService } from '../../../../../core/database/prisma.service';

@Injectable()
export class PrismaAuthorizationContextRepository implements AuthorizationContextRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findContext(
    personId: string,
    residentialComplexId: string,
  ): Promise<AuthorizationContext | null> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        personId,
        residentialComplexId,
        status: 'ACTIVE',
        person: {
          status: 'ACTIVE',
        },
        accessRole: {
          status: 'ACTIVE',
        },
      },
      include: {
        accessRole: {
          include: {
            accessRolePermissions: {
              where: {
                permission: {
                  status: 'ACTIVE',
                },
              },
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return null;
    }

    return {
      personId: membership.personId,
      membershipId: membership.id,
      residentialComplexId: membership.residentialComplexId,
      roleId: membership.accessRoleId,
      permissions: membership.accessRole.accessRolePermissions.map(
        ({ permission }) => permission.code,
      ),
    };
  }
}
