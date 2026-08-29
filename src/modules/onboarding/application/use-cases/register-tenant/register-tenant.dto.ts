import type { BillingCycle } from '../../../../subscription/domain/entities/subscription.entity';

export interface RegisterTenantDto {
  externalAuthId: string; // UUID del usuario ya creado en Supabase Auth

  person: {
    identificationType: 'CC' | 'TI' | 'CE' | 'PA' | 'NIT' | 'PPT' | 'PEP';
    identificationNumber: string;
    fullName: string;
    email?: string;
    phone?: string;
  };

  residentialComplex: {
    name: string;
    address: string;
    city: string;
  };

  planCode: string;
  billingCycle: BillingCycle;
}
