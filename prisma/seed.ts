import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, PermissionStatus } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const PLANS = [
  {
    code: 'STARTER',
    name: 'Starter',
    maxComplexes: 1,
    maxUnits: 150,
    monthlyPrice: 89000,
    quarterlyPrice: 240000,
    yearlyPrice: 890000,
  },
  {
    code: 'PROFESIONAL',
    name: 'Profesional',
    maxComplexes: 5,
    maxUnits: 480,
    monthlyPrice: 249000,
    quarterlyPrice: 670000,
    yearlyPrice: 2490000,
  },
  {
    code: 'AVANZADO',
    name: 'Avanzado',
    maxComplexes: 10,
    maxUnits: 950,
    monthlyPrice: 449000,
    quarterlyPrice: 1210000,
    yearlyPrice: 4490000,
  },
  {
    code: 'PREMIUM',
    name: 'Premium',
    maxComplexes: 100,
    maxUnits: 10000,
    monthlyPrice: 1210000,
    quarterlyPrice: 12100000,
    yearlyPrice: 44900000,
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

type PermissionSeed = {
  code: string;
  name: string;
  description: string;
};

const permissions: PermissionSeed[] = [
  // Dashboard
  {
    code: 'VIEW_DASHBOARD',
    name: 'Ver dashboard',
    description: 'Permite visualizar el dashboard de la copropiedad.',
  },

  // Personas
  {
    code: 'VIEW_PEOPLE',
    name: 'Ver personas',
    description: 'Permite consultar la información de las personas registradas.',
  },
  {
    code: 'CREATE_PEOPLE',
    name: 'Crear personas',
    description: 'Permite registrar nuevas personas.',
  },
  {
    code: 'UPDATE_PEOPLE',
    name: 'Actualizar personas',
    description: 'Permite modificar la información de las personas registradas.',
  },

  // Unidades privadas
  {
    code: 'VIEW_PRIVATE_UNITS',
    name: 'Ver unidades privadas',
    description: 'Permite consultar las unidades privadas de la copropiedad.',
  },
  {
    code: 'CREATE_PRIVATE_UNITS',
    name: 'Crear unidades privadas',
    description: 'Permite registrar nuevas unidades privadas.',
  },
  {
    code: 'UPDATE_PRIVATE_UNITS',
    name: 'Actualizar unidades privadas',
    description: 'Permite modificar la información de las unidades privadas.',
  },

  // Persona - Unidad
  {
    code: 'VIEW_PERSON_UNITS',
    name: 'Ver relaciones persona-unidad',
    description: 'Permite consultar las relaciones entre personas y unidades privadas.',
  },
  {
    code: 'CREATE_PERSON_UNIT',
    name: 'Crear relación persona-unidad',
    description: 'Permite asignar una persona a una unidad privada.',
  },
  {
    code: 'UPDATE_PERSON_UNIT',
    name: 'Actualizar relación persona-unidad',
    description: 'Permite modificar una relación entre una persona y una unidad privada.',
  },

  // Portería
  {
    code: 'VIEW_ACCESS_LOGS',
    name: 'Ver registros de acceso',
    description: 'Permite consultar los registros de entradas y salidas.',
  },
  {
    code: 'REGISTER_ENTRY',
    name: 'Registrar entrada',
    description: 'Permite registrar la entrada de una persona o visitante.',
  },
  {
    code: 'REGISTER_EXIT',
    name: 'Registrar salida',
    description: 'Permite registrar la salida de una persona o visitante.',
  },
  {
    code: 'REGISTER_VISITOR',
    name: 'Registrar visitante',
    description: 'Permite registrar visitantes en la copropiedad.',
  },
  {
    code: 'VIEW_VISITORS',
    name: 'Ver visitantes',
    description: 'Permite consultar la información de visitantes registrados.',
  },

  // Cartera
  {
    code: 'VIEW_ACCOUNTS_RECEIVABLE',
    name: 'Ver cartera',
    description: 'Permite consultar la información de cuentas por cobrar.',
  },
  {
    code: 'CREATE_CHARGE',
    name: 'Crear cobro',
    description: 'Permite generar cargos y obligaciones económicas.',
  },
  {
    code: 'UPDATE_CHARGE',
    name: 'Actualizar cobro',
    description: 'Permite modificar cargos y obligaciones económicas.',
  },
  {
    code: 'REGISTER_PAYMENT',
    name: 'Registrar pago',
    description: 'Permite registrar pagos realizados por las unidades privadas.',
  },
  {
    code: 'VIEW_PAYMENT_HISTORY',
    name: 'Ver historial de pagos',
    description: 'Permite consultar el historial de pagos registrados.',
  },

  // PQRS
  {
    code: 'CREATE_PQRS',
    name: 'Crear PQRS',
    description: 'Permite crear peticiones, quejas, reclamos y sugerencias.',
  },
  {
    code: 'VIEW_PQRS',
    name: 'Ver PQRS',
    description: 'Permite consultar las PQRS según el alcance autorizado.',
  },
  {
    code: 'MANAGE_PQRS',
    name: 'Gestionar PQRS',
    description: 'Permite gestionar, responder y actualizar el estado de las PQRS.',
  },

  // Comunicaciones
  {
    code: 'VIEW_COMMUNICATIONS',
    name: 'Ver comunicaciones',
    description: 'Permite consultar las comunicaciones publicadas.',
  },
  {
    code: 'CREATE_COMMUNICATION',
    name: 'Crear comunicación',
    description: 'Permite crear nuevas comunicaciones.',
  },
  {
    code: 'UPDATE_COMMUNICATION',
    name: 'Actualizar comunicación',
    description: 'Permite modificar comunicaciones existentes.',
  },
  {
    code: 'PUBLISH_COMMUNICATION',
    name: 'Publicar comunicación',
    description: 'Permite publicar comunicaciones para los residentes.',
  },

  // Zonas comunes
  {
    code: 'VIEW_COMMON_AREAS',
    name: 'Ver zonas comunes',
    description: 'Permite consultar las zonas comunes de la copropiedad.',
  },
  {
    code: 'CREATE_COMMON_AREA',
    name: 'Crear zona común',
    description: 'Permite registrar nuevas zonas comunes.',
  },
  {
    code: 'UPDATE_COMMON_AREA',
    name: 'Actualizar zona común',
    description: 'Permite modificar la información de las zonas comunes.',
  },
  {
    code: 'MANAGE_COMMON_AREA_RESERVATIONS',
    name: 'Gestionar reservas de zonas comunes',
    description: 'Permite gestionar las reservas de zonas comunes.',
  },

  // Configuración
  {
    code: 'VIEW_CONFIGURATION',
    name: 'Ver configuración',
    description: 'Permite consultar la configuración de la copropiedad.',
  },
  {
    code: 'UPDATE_CONFIGURATION',
    name: 'Actualizar configuración',
    description: 'Permite modificar la configuración de la copropiedad.',
  },
  {
    code: 'MANAGE_ACCESS_ROLES',
    name: 'Gestionar roles de acceso',
    description: 'Permite crear y administrar los roles de acceso.',
  },
  {
    code: 'MANAGE_PERMISSIONS',
    name: 'Gestionar permisos',
    description: 'Permite administrar los permisos del sistema.',
  },
  {
    code: 'MANAGE_MEMBERSHIPS',
    name: 'Gestionar membresías',
    description: 'Permite administrar las membresías de la copropiedad.',
  },
  {
    code: 'MANAGE_USERS',
    name: 'Gestionar usuarios',
    description: 'Permite administrar los usuarios asociados a la copropiedad.',
  },
];

const rolePermissions: Record<string, string[]> = {
  ADMINISTRADOR: permissions.map((permission) => permission.code),

  CONSEJO: [
    'VIEW_DASHBOARD',

    'VIEW_PEOPLE',
    'VIEW_PRIVATE_UNITS',
    'VIEW_PERSON_UNITS',

    'VIEW_ACCESS_LOGS',
    'VIEW_VISITORS',

    'VIEW_ACCOUNTS_RECEIVABLE',
    'VIEW_PAYMENT_HISTORY',

    'VIEW_PQRS',
    'MANAGE_PQRS',

    'VIEW_COMMUNICATIONS',
    'CREATE_COMMUNICATION',
    'UPDATE_COMMUNICATION',
    'PUBLISH_COMMUNICATION',

    'VIEW_COMMON_AREAS',
    'MANAGE_COMMON_AREA_RESERVATIONS',

    'VIEW_CONFIGURATION',
  ],

  CONSULTA: [
    'VIEW_DASHBOARD',

    'VIEW_PEOPLE',
    'VIEW_PRIVATE_UNITS',
    'VIEW_PERSON_UNITS',

    'VIEW_ACCESS_LOGS',
    'VIEW_VISITORS',

    'VIEW_ACCOUNTS_RECEIVABLE',
    'VIEW_PAYMENT_HISTORY',

    'VIEW_PQRS',

    'VIEW_COMMUNICATIONS',

    'VIEW_COMMON_AREAS',

    'VIEW_CONFIGURATION',
  ],

  PORTERO: [
    'VIEW_DASHBOARD',

    'VIEW_ACCESS_LOGS',
    'REGISTER_ENTRY',
    'REGISTER_EXIT',
    'REGISTER_VISITOR',
    'VIEW_VISITORS',
  ],

  RESIDENTE: [
    'VIEW_DASHBOARD',

    'CREATE_PQRS',
    'VIEW_PQRS',

    'VIEW_COMMUNICATIONS',

    'VIEW_COMMON_AREAS',
    'MANAGE_COMMON_AREA_RESERVATIONS',
  ],

  AUXILIAR: ['VIEW_DASHBOARD', 'VIEW_COMMON_AREAS'],
};

async function seedPermissions() {
  console.log('🌱 Seeding permissions...');

  const permissionMap = new Map<string, string>();

  for (const permission of permissions) {
    const createdPermission = await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {
        name: permission.name,
        description: permission.description,
        status: PermissionStatus.ACTIVE,
      },
      create: {
        code: permission.code,
        name: permission.name,
        description: permission.description,
        status: PermissionStatus.ACTIVE,
      },
    });

    permissionMap.set(createdPermission.code, createdPermission.id);
  }

  console.log(`✅ ${permissions.length} permissions seeded.`);

  console.log('🔐 Assigning permissions to roles...');

  for (const [roleCode, permissionCodes] of Object.entries(rolePermissions)) {
    const accessRole = await prisma.accessRole.findUnique({
      where: {
        code: roleCode,
      },
      select: {
        id: true,
        code: true,
      },
    });

    if (!accessRole) {
      throw new Error(`AccessRole with code "${roleCode}" was not found.`);
    }

    for (const permissionCode of permissionCodes) {
      const permissionId = permissionMap.get(permissionCode);

      if (!permissionId) {
        throw new Error(`Permission "${permissionCode}" was not found in the seed map.`);
      }

      await prisma.accessRolePermission.upsert({
        where: {
          accessRoleId_permissionId: {
            accessRoleId: accessRole.id,
            permissionId,
          },
        },
        update: {},
        create: {
          accessRoleId: accessRole.id,
          permissionId,
        },
      });
    }

    console.log(`✅ Permissions assigned to role ${accessRole.code}.`);
  }

  console.log('🎉 Permission seed completed successfully.');
}

seedPermissions()
  .catch((error) => {
    console.error('❌ Permission seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
