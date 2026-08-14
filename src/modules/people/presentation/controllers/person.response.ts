import type { Person } from '../../domain/entities/person.entity';

export interface PersonResponse {
  id: string;
  identificationType: Person['identificationType'];
  identificationNumber: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: Person['status'];
  createdAt: Date;
  updatedAt: Date;
}

export function toPersonResponse(person: Person): PersonResponse {
  return {
    id: person.id,
    identificationType: person.identificationType,
    identificationNumber: person.identificationNumber,
    fullName: person.fullName,
    email: person.email,
    phone: person.phone,
    status: person.status,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
  };
}
