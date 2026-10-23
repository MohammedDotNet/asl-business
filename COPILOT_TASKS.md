# ASL Business — Phase 1 Implementation Plan

## 1. Project Mission

Build Phase 1 of ASL Business: the secure system foundation.

Phase 1 includes:
- Authentication and session management.
- User management.
- Roles and permissions.
- System/company settings.
- Main dashboard and navigation.
- Integration between the frontend and backend.
- Security, testing, and operational readiness.

Do not start Phase 2 business modules until Phase 1 is complete and verified.

## 2. Existing Architecture and Constraints

This is an existing npm-workspaces monorepo, not a new project.

- Frontend: Next.js.
- Backend: NestJS.
- Database: PostgreSQL.
- ORM: Prisma 7.10.1.
- Backend Prisma schema: `apps/api/prisma/schema.prisma`.
- Prisma configuration: `apps/api/prisma7.config.ts`.
- Environment variables: `apps/api/.env`.
- Database name: `asl_business`.
- Repository: `https://github.com/MohammedDotNet/asl-business.git`.

Existing database models:
- User
- Role
- Permission
- UserRole
- RolePermission

The Company model was removed because each customer will use a separate PostgreSQL database.

The current repository and schema may contain additional implementation details. Inspect the actual files before making assumptions.

### Mandatory rules

1. Inspect existing code and configuration before editing.
2. Preserve the existing architecture and compatible dependency versions.
3. Do not recreate the project or replace configuration unnecessarily.
4. Do not upgrade, downgrade, or replace dependencies without approval.
5. Never expose, print, commit, or hardcode secrets or passwords.
6. Do not use destructive database commands.
7. Never apply a migration before reviewing its proposed SQL and confirming that it is appropriate.
8. Use minimal, focused changes and reuse existing components and services.
9. Follow established project naming, formatting, and coding conventions.
10. Do not implement features belonging to Phase 2 or later.
11. Do not claim a task is complete unless its acceptance criteria have been verified.
12. Do not silently change business requirements or database relationships.
13. Report blockers and ask for clarification only when an unresolved decision materially affects correctness or security.

## 3. Google Stitch Design Handoff — Mandatory Frontend Workflow

Google Stitch will be used to create the required UI designs. I will provide the designs, screenshots, exported code, or relevant assets to Copilot as they become available.

Copilot's responsibility is to IMPLEMENT and INTEGRATE the supplied designs into the existing Next.js application.

Do not independently redesign a supplied screen, replace its visual style, or generate a different layout without approval.

For every supplied design:

1. Inspect the supplied screenshot, files, code, and assets.
2. Identify the intended page, reusable components, interactions, responsive behavior, and API requirements.
3. Inspect the existing frontend architecture before integrating it.
4. Implement the design using the project's existing stack and conventions.
5. Preserve the design's layout, spacing, colors, typography, hierarchy, icons, and interaction patterns as closely as practical.
6. Reuse common elements such as the application shell, sidebar, header, forms, tables, dialogs, and feedback components.
7. Replace mock data with real API integration when the corresponding backend endpoint is ready.
8. Preserve useful existing functionality and avoid duplicating components.
9. Implement loading, empty, error, validation, unauthorized, and success states where applicable.
10. Test desktop, tablet, and mobile layouts.
11. Report any missing design assets, ambiguous interactions, or conflicts with existing architecture before making significant deviations.

If a design has not yet been supplied, implement only the approved underlying infrastructure or backend task. Do not invent the final UI design.

Never use frontend visibility as the sole authorization mechanism. The backend must enforce all protected operations.

## 4. Task Execution Protocol

Work through tasks in dependency order.

For each task:
1. Inspect relevant files.
2. State the intended changes briefly.
3. Implement only that task and its necessary dependencies.
4. Run relevant validation and tests.
5. Report changed files, commands run, results, remaining issues, and acceptance criteria.
6. Stop before starting the next independent task unless explicitly authorized to continue.

Avoid repeatedly dumping large files or explaining the entire codebase. Prefer targeted diffs and concise reports.

---

# T01 — Database and Prisma Verification

Type: Backend / Infrastructure

### Tasks

- Verify PostgreSQL connectivity using the existing configuration.
- Verify `DATABASE_URL` is loaded correctly without exposing its value.
- Validate the current Prisma schema and configuration.
- Check migration status and identify unapplied migrations.
- Verify that the applied database structure matches the Prisma schema.
- Review model relationships, foreign keys, unique constraints, indexes, and deletion behavior.
- Confirm that the `Company` model and `companyId` relationship are absent if the removal migration has been applied.
- Check uniqueness of usernames within the customer-specific database.
- Identify potential data-integrity issues without modifying production or existing data.
- Establish a repeatable database verification procedure.

### Restrictions

- Do not reset the database.
- Do not drop or recreate tables.
- Do not run destructive migration commands.
- Do not apply new migrations without approval.
- Do not modify the schema merely to eliminate a warning.

### Acceptance criteria

- Prisma schema validation passes.
- Migration status is understood and consistent with the intended schema.
- Database connectivity is verified.
- Any discrepancies are documented with proposed, minimal fixes.

# T02 — Backend Configuration and API Standards

Type: Backend / Infrastructure

### Tasks

- Review the existing NestJS application structure.
- Review existing environment variables and configuration loading.
- Implement typed and validated environment configuration using a suitable existing or approved NestJS solution.
- Fail fast with clear, secret-safe errors when required configuration is missing.
- Separate development and production configuration appropriately.
- Verify port configuration and existing frontend/backend communication.
- Establish consistent request validation using DTOs and validation pipes.
- Establish a consistent API error-handling approach.
- Add appropriate logging for errors and important operational events.
- Avoid logging passwords, tokens, secrets, or sensitive authentication data.
- Establish consistent HTTP status codes and API response conventions.
- Configure CORS for explicitly approved frontend origins.
- Configure safe production defaults.
- Document required environment variables without including actual secrets.

### Acceptance criteria

- Invalid configuration fails safely.
- Request validation rejects malformed input.
- Errors are consistent and do not reveal internal secrets or stack traces in production.
- Existing development and production builds remain compatible.

# T03 — PrismaService and Database Access

Type: Backend

### Tasks

- Inspect existing Prisma integration before creating any new service.
- Implement or complete a reusable PrismaService compatible with Prisma 7.10.1 and the existing configuration.
- Configure the Prisma client and database adapter according to the installed Prisma version and existing architecture.
- Integrate PrismaService with NestJS dependency injection.
- Implement appropriate application startup and shutdown handling.
- Ensure database connections are managed correctly and not unnecessarily duplicated.
- Define consistent database error handling.
- Use transactions for operations that require multiple related writes.
- Avoid unnecessary repository abstractions or boilerplate.
- Verify database access through an appropriate health or verification mechanism without exposing credentials.

### Acceptance criteria

- NestJS can connect to PostgreSQL.
- PrismaService is injectable where required.
- Connection lifecycle and errors are handled correctly.
- Existing schema and migration behavior remain intact.
- Relevant builds and tests pass.

# T04 — Permission Catalog and Initial Administrator Setup

Type: Backend

### Dependencies

T01, T02, T03, and the approved permission design from T05.

### Tasks

- Implement a repeatable, idempotent seed mechanism compatible with the installed Prisma version.
- Seed the approved permission catalog.
- Seed the protected system-administrator role.
- Assign the approved initial permissions to the system-administrator role.
- Provide a secure process for creating the initial administrator account.
- Never commit real initial credentials.
- Never use a hardcoded production password.
- Use environment-provided bootstrap credentials or a documented secure setup process.
- Hash passwords with a suitable secure password-hashing algorithm.
- Ensure rerunning the seed does not create duplicate permissions, roles, or administrator accounts.
- Define how bootstrap credentials are handled after initial setup.
- Protect against unintentionally overwriting an existing administrator password or account.
- Verify the resulting role and permission relationships.

### Restrictions

- Do not create a publicly accessible endpoint that automatically grants administrator privileges.
- Do not expose bootstrap secrets in logs or command output.
- Do not silently reset existing user credentials.
- Do not invent or seed permissions for future modules unless explicitly approved.

### Acceptance criteria

- Initial data can be created safely and repeatably.
- The initial administrator has the intended permissions.
- Passwords are stored only as secure hashes.
- Existing accounts are not unintentionally modified.

### Implementation status

- The `OWNER` role template has been removed; the existing
  `SYSTEM_ADMIN` template remains the protected administrator role.
- Read-only inspection of the configured local database found no role rows
  and all three migrations applied. No role data migration was required.
- Seed execution is pending review of the grant set and secure provision of
  bootstrap credentials. No seed or migration was run during this work.

# T05 — Permission Catalog and Authorization Rules

Type: Backend / Security / Shared Contract

### Tasks

- Define a consistent permission naming convention.
- Organize permissions by module and action.
- Define standard actions such as read, create, update, delete, and manage where applicable.
- Distinguish UI navigation visibility from authorization to execute an operation.
- Define how users receive permissions through one or more assigned roles.
- Define how effective permissions are calculated.
- Define behavior when a user has multiple roles.
- Define how permission changes take effect during active sessions.
- Define protected system roles and rules for maintaining at least one usable system administrator.
- Create a centralized permission catalog that can be reused by seed scripts, guards, and frontend navigation.
- Document the catalog and its stable identifiers.
- Ensure that permissions for future business modules are not invented prematurely.

### Initial Phase 1 permission scope

- Dashboard access.
- User list and user details.
- User creation.
- User profile updates.
- User activation and deactivation.
- User role assignment.
- Role listing and details.
- Role creation and updates.
- Role permission assignment.
- Profile access and profile updates.
- Password change.
- System settings access and modification.

Split these into granular permissions when necessary. Avoid giving all operations to a single broad permission unless the security design explicitly calls for it.

### Acceptance criteria

- Permission identifiers are stable and documented.
- Seed scripts, backend authorization, and frontend navigation use the same identifiers.
- No protected operation depends solely on a frontend check.

---

# T06 — Authentication and Session Management

Type: Backend

### Dependencies

T01, T02, T03.

### Tasks

- Implement or complete AuthModule.
- Implement login using the approved username/password contract.
- Verify password hashes securely.
- Choose and implement a suitable secure session strategy compatible with the existing architecture.
- Prefer secure, HttpOnly cookies when using browser-based sessions or cookie-based authentication.
- Apply appropriate Secure and SameSite cookie settings for the deployment environment.
- Implement session expiration and invalidation.
- Implement logout.
- Implement a current-user endpoint such as `GET /auth/me`.
- Reject invalid credentials without revealing whether a username exists.
- Reject disabled accounts.
- Add reasonable rate limiting or brute-force protections.
- Protect private backend routes.
- Ensure secrets and tokens are never exposed to client-side code or logs.
- Ensure session and authentication behavior is consistent across the frontend and backend.

### Acceptance criteria

- Valid users can log in.
- Invalid credentials are rejected safely.
- Disabled users cannot authenticate.
- Logout invalidates the relevant session.
- Expired or invalid sessions cannot access protected APIs.

# T07 — Backend User Management

Type: Backend

### Dependencies

T02, T03, T05, T06.

### Tasks

- Implement or complete UsersModule.
- Define validated request and response DTOs.
- List users with pagination, searching, filtering, and sorting where appropriate.
- Retrieve user details.
- Create users with unique username validation.
- Update permitted user fields.
- Activate and deactivate accounts.
- Assign and remove roles through UserRole.
- Return role information without exposing sensitive data.
- Implement current-user profile retrieval and updates.
- Implement secure password change with verification of the current password where appropriate.
- Implement administrator password reset without exposing the resulting password.
- Prevent unauthorized privilege escalation through user update endpoints.
- Prevent unsafe deletion, deactivation, or demotion of the last usable administrator.
- Use transactions for multi-step user and role operations.
- Define safe behavior for duplicate submissions and conflicting updates.

### Acceptance criteria

- User CRUD and status operations work as specified.
- Role assignments remain consistent.
- Password hashes and secrets are never returned.
- Unauthorized users cannot change accounts or grant privileges.

# T08 — Backend Role and Permission Management

Type: Backend

### Dependencies

T03, T05, T06.

### Tasks

- Implement or complete RolesModule and PermissionsModule.
- List roles and retrieve role details.
- Create and update roles.
- Implement safe deletion of eligible custom roles, if deletion is supported.
- List permissions grouped by module and action.
- Assign and remove permissions through RolePermission.
- Calculate effective permissions for the current user.
- Implement reusable authorization guards and decorators.
- Protect each endpoint with the appropriate permissions.
- Protect reserved system roles from unsafe modification or deletion.
- Prevent accidental removal of all administrator capabilities.
- Handle multiple roles consistently.
- Ensure permission changes are reflected according to the approved session policy.
- Use transactions for multi-step role-permission updates.

### Acceptance criteria

- Role-permission relationships remain correct.
- Protected API operations are enforced server-side.
- Unauthorized direct API calls are rejected.
- Multiple-role behavior is tested and documented.

# T09 — Backend System Settings

Type: Backend

### Dependencies

T01, T02, T03, T05.

### Tasks

- Determine the exact Phase 1 settings required for the system.
- Distinguish global application settings from customer-specific company data.
- Do not reintroduce the removed Company model without explicit approval.
- Define which settings require database persistence.
- Propose a settings model and migration only after the requirements and data ownership are approved.
- Implement validated settings retrieval and updates.
- Protect settings endpoints with appropriate permissions.
- Avoid storing secrets as ordinary readable settings.
- Define safe defaults and behavior for missing settings.

### Acceptance criteria

- Settings ownership and persistence are clearly defined.
- Authorized users can retrieve and update approved settings.
- Unauthorized users cannot modify protected settings.
- Any new migration is reviewed and approved before application.

# T10 — Frontend Foundation and Application Shell

Type: Frontend

### Dependencies

Existing Next.js architecture and supplied Stitch designs.

### Tasks

- Inspect the existing frontend structure and routing conventions.
- Establish or reuse shared layout and reusable UI components.
- Implement the approved authenticated application shell.
- Implement the supplied header, sidebar, user menu, breadcrumbs, and responsive navigation designs.
- Establish reusable loading, error, empty, confirmation, and feedback patterns.
- Establish a consistent API client and safe session handling.
- Avoid duplicating components or introducing unnecessary UI libraries.
- Ensure frontend environment variables expose no server secrets.
- Implement appropriate route protection and authentication-aware loading states.
- Do not invent final visual designs where Stitch designs have not been supplied.

### Acceptance criteria

- Existing frontend builds successfully.
- The application shell matches the supplied design.
- Shared components are reusable.
- Protected pages handle authentication state correctly.

# T11 — Stitch Login Page Integration

Type: Frontend

### Dependencies

T06 and the supplied login design.

### Tasks

- Integrate the supplied Stitch login design.
- Implement username and password inputs.
- Implement client-side validation consistent with backend requirements.
- Connect the form to the login API.
- Display safe authentication errors.
- Implement loading and duplicate-submission prevention.
- Handle successful login and navigation to the dashboard.
- Handle already-authenticated users appropriately.
- Ensure responsive layout and keyboard accessibility.

### Acceptance criteria

- The page matches the supplied design.
- Login works against the actual API.
- Invalid credentials and loading states behave correctly.

# T12 — Stitch Dashboard and Navigation Integration

Type: Frontend

### Dependencies

T06, T08, T10, and supplied Stitch designs.

### Tasks

- Integrate the supplied dashboard design.
- Load the authenticated user's profile, roles, and effective permissions.
- Render only permitted navigation items.
- Implement the initial Phase 1 dashboard content.
- Implement responsive sidebar behavior and user menu.
- Implement logout.
- Implement loading, empty, error, forbidden, and not-found states.
- Ensure hiding a menu item is never treated as security enforcement.

### Acceptance criteria

- The dashboard works with real authentication data.
- Navigation reflects effective permissions.
- Direct unauthorized API access remains blocked by the backend.

# T13 — Stitch User Management Integration

Type: Frontend

### Dependencies

T07, T08, T10, and supplied Stitch designs.

### Tasks

- Integrate the supplied users list design.
- Implement search, filtering, pagination, and sorting supported by the API.
- Integrate create and edit user forms.
- Integrate user details.
- Integrate role assignment.
- Integrate activate/deactivate controls.
- Integrate password-change and administrator-reset flows where included in the approved designs.
- Add confirmation dialogs for consequential actions.
- Display field validation and API errors.
- Implement loading, empty, success, and failure states.
- Respect the current user's permissions.

### Acceptance criteria

- User management operates through real APIs.
- Forms and tables match the supplied Stitch designs.
- Unauthorized operations are hidden where appropriate and rejected by the backend.

# T14 — Stitch Roles and Permissions Integration

Type: Frontend

### Dependencies

T08, T10, and supplied Stitch designs.

### Tasks

- Integrate the supplied roles list and role details designs.
- Implement create and edit role forms.
- Implement the permission matrix grouped by module and action.
- Implement grouped selection and select-all behavior where included in the design.
- Display assigned permissions clearly.
- Save changes through the role-permission API.
- Handle validation, loading, errors, success feedback, and confirmation dialogs.
- Respect protected system roles.
- Respect the current user's permissions.

### Acceptance criteria

- Role and permission management operates through real APIs.
- The permission matrix reflects persisted data.
- Unauthorized changes are rejected server-side.

# T15 — Stitch Profile and Settings Integration

Type: Frontend

### Dependencies

T07, T09, and supplied Stitch designs.

### Tasks

- Integrate the supplied profile page.
- Implement profile retrieval and editing.
- Integrate the password-change form.
- Integrate the approved system settings page.
- Connect settings forms to actual APIs.
- Implement validation, loading, success, and error states.
- Ensure secret settings are not unnecessarily returned or exposed.
- Respect settings permissions.

### Acceptance criteria

- Profile and approved settings changes persist correctly.
- Forms match supplied designs.
- Unauthorized updates are rejected.

# T16 — Authorization and Security Testing

Type: Backend / Frontend / Integration

### Tasks

- Test unauthenticated access to protected endpoints.
- Test invalid credentials and disabled accounts.
- Test session expiry and logout.
- Test each relevant permission independently.
- Test users with multiple roles.
- Test unauthorized direct API calls even when the frontend hides the controls.
- Test attempts to assign unauthorized roles or permissions.
- Test administrator protection rules.
- Test duplicate usernames and invalid DTOs.
- Test safe error handling and secret redaction.
- Test session behavior after permission changes.
- Test relevant transaction and database-integrity scenarios.
- Fix confirmed issues without weakening security controls.

### Acceptance criteria

- Protected operations enforce authorization server-side.
- Security tests pass or remaining blockers are explicitly documented.
- No critical secrets or credentials are exposed.

# T17 — End-to-End Verification and Release Readiness

Type: Integration / Operations

### Tasks

- Test the full flow: login, dashboard, users, roles, permissions, profile, and settings.
- Verify API and frontend error handling.
- Verify responsive layouts on desktop, tablet, and mobile.
- Verify production frontend and backend builds.
- Verify required environment configuration and safe startup behavior.
- Document initial administrator setup.
- Document migration and database verification procedures.
- Establish and test database backup and restore procedures.
- Document known limitations and unresolved decisions.
- Confirm all Phase 1 acceptance criteria before starting Phase 2.

### Acceptance criteria

- The Phase 1 user journeys work end-to-end.
- Builds and relevant tests pass.
- Initial administrator setup and recovery procedures are documented.
- No unresolved critical security or data-integrity issues remain.

---

# Recommended Execution Order

1. T01 — Database and Prisma verification.
2. T02 — Backend configuration and API standards.
3. T03 — PrismaService and database access.
4. T05 — Permission catalog and authorization rules.
5. T04 — Initial permission and administrator seed.
6. T06 — Authentication and sessions.
7. T07 — Backend user management.
8. T08 — Backend role and permission management.
9. T09 — Backend system settings.
10. T10 — Frontend foundation and application shell.
11. T11 — Login page integration.
12. T12 — Dashboard and navigation integration.
13. T13 — User management integration.
14. T14 — Roles and permissions integration.
15. T15 — Profile and settings integration.
16. T16 — Authorization and security testing.
17. T17 — End-to-end verification and release readiness.

Tasks may be prepared in parallel when their dependencies are satisfied, but changes to shared architecture, database schema, authentication, and authorization must be coordinated.

# Copilot Operating Instructions

- Start with T01 only.
- Inspect relevant files before proposing or making changes.
- Do not implement all tasks in one pass.
- Ask for the supplied Stitch design when a frontend task requires it and the design is unavailable.
- Keep reports concise.
- Do not claim completion without evidence from validation or tests.
- Stop after the current task and wait for approval before proceeding to the next independent task.
- At every task boundary, report:
  1. Summary of changes.
  2. Files modified.
  3. Commands and tests executed.
  4. Results and remaining risks.
  5. Any decision or approval needed.

Phase 1 is complete only when T01–T17 satisfy their acceptance criteria. Do not begin Phase 2 before that release gate is approved.