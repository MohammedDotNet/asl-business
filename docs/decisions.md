# Architecture Decision Log

## Purpose

Record important technical and architectural decisions, their status, rationale, and consequences.

A proposal is not an approved decision until the project owner explicitly approves it.

## Decision Statuses

- **Approved:** Explicitly accepted by the project owner.
- **Provisional:** Preferred option that still requires validation or final confirmation.
- **Proposed:** Under consideration; not approved.
- **Superseded:** Replaced by a later decision.

## ADR-001: Project Ownership and Development Workflow

**Status:** Approved

**Decision:**

The project owner retains final authority over business requirements, priorities, and important technical decisions.

AI agents may propose plans and implement approved tasks, but must not silently expand scope or make significant decisions independently.

**Consequences:**

- Implementation is divided into small reviewable tasks.
- Plans are reviewed before code changes.
- Tests and explanations accompany meaningful changes.
- The owner reviews the result before the next task begins.

## ADR-002: Web Frontend

**Status:** Approved

**Decision:**

Use Next.js with TypeScript for the web frontend.

**Rationale:**

Provide a modern, maintainable web interface that can run on desktop and mobile browsers and be hosted on the project's own server.

**Consequences:**

The frontend must communicate with the backend through defined application interfaces and must not connect directly to PostgreSQL.

## ADR-003: Independent Backend API

**Status:** Approved

**Decision:**

Use NestJS on Node.js with TypeScript for an independently deployable backend API.

**Rationale:**

Keep business rules under project ownership and reduce dependence on hosting-provider-specific backend services.

**Consequences:**

The backend will own request validation, authorization enforcement, business operations, and coordination with the database.

## ADR-004: Database

**Status:** Approved

**Decision:**

Use PostgreSQL hosted on the project's VPS.

**Rationale:**

Maintain direct control over the database deployment and simplify portability between compatible servers.

**Consequences:**

The project owner is responsible for database security, updates, monitoring, backups, and recovery procedures.

## ADR-005: Database Access and Migrations

**Status:** Provisional

**Decision:**

Use Prisma for database access and schema migrations, subject to validation against the system's data integrity, transaction, and portability requirements.

**Rationale:**

Provide a structured development workflow and version-controlled schema changes.

**Validation required:**

- Verify transaction support for critical operations.
- Verify migration review and production deployment practices.
- Confirm compatibility with required PostgreSQL features.
- Test backup, restore, and schema migration procedures.

## ADR-006: Initial Backend Architecture

**Status:** Approved

**Decision:**

Start with a Modular Monolith rather than microservices.

**Rationale:**

Reduce deployment and operational complexity while preserving clear internal module boundaries.

**Consequences:**

Modules should have explicit responsibilities and controlled dependencies. Splitting services may be considered later only when supported by concrete needs.

## ADR-007: User Interface Styling

**Status:** Approved

**Decision:**

Use Tailwind CSS and shadcn/ui for styling and UI components.

**Rationale:**

Provide a reusable, maintainable interface development workflow.

**Consequences:**

The design system must be applied consistently, with responsive behavior and Arabic RTL support where required.

## ADR-008: Deployment and Hosting

**Status:** Approved

**Decision:**

Use Docker Compose and one VPS for the initial deployment, with HTTPS for public application access.

**Rationale:**

Keep initial infrastructure manageable and portable while minimizing recurring costs.

**Consequences:**

A single VPS remains a single point of failure. Off-server backups, monitoring, health checks, and restore testing are required before production reliance.

## ADR-009: Initial Mobile Strategy

**Status:** Approved

**Decision:**

Start with a responsive web application and evaluate PWA capabilities before committing to a separate native mobile application.

**Rationale:**

Avoid maintaining separate mobile and web implementations before a clear need has been established.

**Consequences:**

Required mobile capabilities, offline behavior, notifications, and device integrations must be assessed before choosing a native application.

## ADR-010: Project Structure

**Status:** Approved

**Decision:**

Use the following initial repository structure:

- `apps/web/`
- `apps/api/`
- `packages/`
- `infra/`
- `docs/`
- `tests/`

The repository root also contains `AGENTS.md` and `README.md`.

**Consequences:**

Keep application boundaries clear and add shared packages only when there is a real need.

## ADR-011: Permission Evaluation Foundation

**Status:** Approved

**Decision:**

Use stable `resource.action` permission keys from a centralized catalog. Keep
Phase 1 capabilities separate from proposed future-module permissions. Require
an explicit permission policy for every non-public route through a global
NestJS guard; explicitly public routes opt out with `@Public()`.

The guard accepts identity only from a validated authentication principal on
`request.user`, checks that the database user is active, and evaluates the
union of permission codes granted through all assigned roles. Every protected
request reads current role-permission relationships from PostgreSQL; no
authorization cache is used. All permissions declared on a route are required.

Role templates use stable codes separate from display names. The obsolete
`OWNER` role template is removed; `SYSTEM_ADMIN` is the protected template.
System administration does not imply financial approval. No initial
administrator or permission assignments are created until the proposed T04
grant set is reviewed and the seed is explicitly approved.

**Rationale:**

The schema already models users, roles, permissions, and their unique
many-to-many assignments. Authentication and business endpoints do not yet
exist, so a reusable fail-closed policy mechanism can be prepared without
inventing an identity system or claiming that unsupported operations are
protected.

**Consequences:**

- The existing root endpoint must remain explicitly public.
- Missing route policy is denied; missing authenticated identity returns 401;
  insufficient permission returns 403.
- Authentication must populate a verified `request.user.userId` before any
  private endpoint can operate.
- Role templates currently have empty permission mappings. T04 owns seeding;
  this decision does not authorize a seed or administrator creation.
- The protected marker for the system-administrator template is descriptive
  metadata only; enforcement must be added with authorized role-management
  operations.
- `Role.code` is nullable and unique to preserve existing rows during rollout;
  the migration also adds indexes for relationship lookups and must be
  reviewed before application.
- Branch, warehouse, ownership, financial approval, separation-of-duties,
  and custom-role rules remain future requirements.

## ADR-012: Initial System Administrator Bootstrap

**Status:** Proposed pending owner review

**Decision:**

The T04 seed proposal creates the `SYSTEM_ADMIN` role and grants it exactly
the existing Phase 1 permission catalog entries. It does not seed proposed
future-module permissions or grant permissions to other role templates. The
initial administrator account is created only from process-provided
`BOOTSTRAP_ADMIN_USERNAME` and `BOOTSTRAP_ADMIN_PASSWORD` values; passwords
are stored as salted scrypt hashes. Existing accounts and password hashes are
never overwritten, unrelated existing users are not promoted, and the seed
refuses a second initial administrator under a different username.

The seed transaction is serializable and upserts permission codes, the
system-administrator role code, and role-permission links. It verifies that
the stored role grants exactly match the template. An existing bootstrap user
is preserved only if it has exactly the `SYSTEM_ADMIN` role. Serialization
conflicts and unique-key collisions receive a bounded number of retries.
Bootstrap variables are removed from the seed process environment after the
attempt.

**Rationale:**

T04 requires a repeatable initial administrator setup but the application does
not yet have authentication, role-management endpoints, or a secure public
bootstrap flow. A one-time operator-run seed avoids creating a publicly
accessible privilege-granting endpoint and avoids committed credentials.

**Consequences:**

- The proposed Phase 1 grant set is reviewable and does not include future
  sales, accounting, inventory, treasury, customer, or supplier permissions.
- The seed depends on the `Role.code` migration and must not run before the
  owner reviews all pending migration effects, particularly legacy migrations
  that remove the former company table and user column.
- The seed command is configured but has not been run; neither migrations nor
  database rows have been changed for T04.
- The configured local database was inspected read-only: no role rows exist
  and all three migrations are applied, so no `OWNER` row migration is needed
  for that database. Seed execution remains pending review of the grant set
  and provision of one-time bootstrap credentials.
- The bootstrap password remains the account password until an approved
  authentication/password-change flow exists; it must be retained securely
  outside the application environment.

## Future Decision Records

New architectural decisions should record:

- Decision identifier
- Status
- Context and problem
- Considered options
- Decision and rationale
- Consequences and trade-offs
- Validation or review date, where relevant

When a decision changes, update this log and any affected documentation.
