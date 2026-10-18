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
