export interface CreatePersonDto {
  identificationType: 'CC' | 'TI' | 'CE' | 'PA' | 'NIT' | 'PPT' | 'PEP';
  identificationNumber: string;
  fullName: string;
  email?: string;
  phone?: string;
}
