import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const PLANS = [
  {
    code: 'STARTER',
    name: 'Starter',
    maxComplexes: 1,
    maxUnits: 100,
    monthlyPrice: 89000,
    quarterlyPrice: 240000,
    yearlyPrice: 890000,
  },
  {
    code: 'PROFESIONAL',
    name: 'Profesional',
    maxComplexes: 5,
    maxUnits: 400,
    monthlyPrice: 249000,
    quarterlyPrice: 670000,
    yearlyPrice: 2490000,
  },
  {
    code: 'AVANZADO',
    name: 'Avanzado',
    maxComplexes: 10,
    maxUnits: 800,
    monthlyPrice: 449000,
    quarterlyPrice: 1210000,
    yearlyPrice: 4490000,
  },
] as const;

async function seedPlans() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        maxComplexes: plan.maxComplexes,
        maxUnits: plan.maxUnits,
        monthlyPrice: plan.monthlyPrice,
        quarterlyPrice: plan.quarterlyPrice,
        yearlyPrice: plan.yearlyPrice,
      },
      create: {
        code: plan.code,
        name: plan.name,
        maxComplexes: plan.maxComplexes,
        maxUnits: plan.maxUnits,
        monthlyPrice: plan.monthlyPrice,
        quarterlyPrice: plan.quarterlyPrice,
        yearlyPrice: plan.yearlyPrice,
        status: 'ACTIVE',
      },
    });
    console.log(`✓ Plan sembrado: ${plan.name} (${plan.code})`);
  }
}

const ACCESS_ROLES = [
  {
    code: 'ADMINISTRADOR',
    name: 'Administrador',
    description: 'Control total sobre la copropiedad: estructura, personas, accesos y finanzas.',
  },
  {
    code: 'PORTERO',
    name: 'Portero',
    description: 'Control de acceso, visitantes y correspondencia.',
  },
  {
    code: 'CONSEJO',
    name: 'Consejo',
    description: 'Miembro del consejo de administración, con visibilidad de gestión y finanzas.',
  },
  {
    code: 'RESIDENTE',
    name: 'Residente',
    description: 'Propietario, arrendatario o residente de una unidad privada.',
  },
  {
    code: 'AUXILIAR',
    name: 'Auxiliar',
    description: 'Personal de apoyo operativo (mantenimiento, aseo, servicios generales).',
  },
] as const;

async function seedAccessRoles() {
  for (const role of ACCESS_ROLES) {
    await prisma.accessRole.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
        status: 'ACTIVE',
      },
    });
    console.log(`✓ AccessRole sembrado: ${role.name} (${role.code})`);
  }
}

async function main() {
  await seedPlans();
  await seedAccessRoles();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
