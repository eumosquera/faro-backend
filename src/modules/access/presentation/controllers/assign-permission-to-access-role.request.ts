import { IsNotEmpty, IsString } from 'class-validator';

export class AssignPermissionToAccessRoleRequest {
  @IsString()
  @IsNotEmpty()
  permissionId!: string;
}
