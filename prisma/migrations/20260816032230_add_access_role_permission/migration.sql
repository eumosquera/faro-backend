-- CreateTable
CREATE TABLE "access_role_permissions" (
    "id" TEXT NOT NULL,
    "accessRoleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_role_permissions_accessRoleId_permissionId_key" ON "access_role_permissions"("accessRoleId", "permissionId");

-- AddForeignKey
ALTER TABLE "access_role_permissions" ADD CONSTRAINT "access_role_permissions_accessRoleId_fkey" FOREIGN KEY ("accessRoleId") REFERENCES "access_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_role_permissions" ADD CONSTRAINT "access_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
