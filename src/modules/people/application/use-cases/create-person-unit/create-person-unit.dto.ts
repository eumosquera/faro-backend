export interface CreatePersonUnitDto {
  personId: string;
  privateUnitId: string;
  rolePersonaId: string;
  startDate: Date;
  endDate?: Date | null;
  observations?: string | null;
}
