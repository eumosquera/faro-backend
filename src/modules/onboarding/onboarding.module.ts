import { Module } from '@nestjs/common';

import { PeopleModule } from '../people/people.module';
import { StructureModule } from '../structure/structure.module';
import { AccessModule } from '../access/access.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { MembershipModule } from '../membership/membership.module';

import { RegisterTenantUseCase } from './application/use-cases/register-tenant/register-tenant.use-case';
import { OnboardingController } from './presentation/controllers/onboarding.controller';

/**
 * IMPORTANTE — limitación conocida:
 * RegisterTenantUseCase encadena 5 escrituras (Person, ResidentialComplex,
 * AccessAccount, Subscription, Membership) como llamadas independientes,
 * NO dentro de una transacción de Prisma. Si un paso falla a la mitad,
 * los anteriores quedan creados (sin rollback automático).
 *
 * Es una limitación aceptada por ahora porque los repositorios actuales
 * no soportan recibir un cliente de transacción compartido. Si esto
 * empieza a causar registros huérfanos en producción, la solución real
 * es propagar un PrismaService transaccional (ej. con AsyncLocalStorage/
 * nestjs-cls) a través de todos los repositorios involucrados.
 */
@Module({
  imports: [PeopleModule, StructureModule, AccessModule, SubscriptionModule, MembershipModule],
  controllers: [OnboardingController],
  providers: [RegisterTenantUseCase],
})
export class OnboardingModule {}
