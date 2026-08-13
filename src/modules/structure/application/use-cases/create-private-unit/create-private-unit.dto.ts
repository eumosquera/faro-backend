export interface CreatePrivateUnitInput {
  residentialComplexId: string;
  physicalGroupId?: string;
  identifier: string;
  type: 'APARTMENT' | 'HOUSE' | 'LOCAL' | 'OFFICE';
}
