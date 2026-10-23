ALTER TABLE "roles" ADD COLUMN "code" VARCHAR(100);

CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");
