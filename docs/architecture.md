# System Architecture

## 1. Architectural Goal

Build a portable, secure, maintainable business application whose core business logic and data remain under the project owner's control.

The initial deployment will use one VPS to reduce operational complexity and cost. The architecture must permit migration to another compatible server without redesigning the business application.

## 2. Approved Architectural Direction

- Web frontend: Next.js + TypeScript.
- Backend API: NestJS + Node.js + TypeScript.
- Database: PostgreSQL hosted on the project's VPS.
- Database access and migrations: Prisma, provisionally.
- Styling: Tailwind CSS.
- UI components: shadcn/ui.
- Deployment orchestration: Docker Compose.
- Public traffic: HTTPS through a reverse proxy or equivalent.
- Initial backend architecture: Modular Monolith.
- Initial mobile strategy: responsive web and evaluation of PWA capabilities.

## 3. Logical Architecture

```text
Desktop and Mobile Browsers
            |
          HTTPS
            |
     Reverse Proxy
            |
       +----+----+
       |         |
   Web App    Backend API
   Next.js     NestJS
                  |
            Application Modules
                  |
            Data Access Layer
                  |
              PostgreSQL
```

All application components initially run on the same VPS, with separate service boundaries and configuration.

Backups must be stored outside the primary VPS.

## 4. Application Responsibilities

### 4.1 Web Frontend

Responsibilities:

- Render application pages and user interfaces.
- Collect user input and provide appropriate feedback.
- Display authorized business information.
- Call backend endpoints through defined interfaces.
- Provide responsive layouts and Arabic RTL support where required.

The frontend must not connect directly to PostgreSQL or contain privileged server credentials.

The frontend must not be the sole enforcement point for authorization or business rules.

### 4.2 Backend API

Responsibilities:

- Authenticate users and enforce authorization.
- Validate incoming requests.
- Implement approved business rules.
- Coordinate operations across application modules.
- Apply database transactions where necessary.
- Produce consistent, useful error responses.
- Record required audit events.
- Expose documented API contracts to the frontend.

The backend is the primary enforcement point for business rules and protected operations.

### 4.3 Database

PostgreSQL stores persistent application data.

Responsibilities include:

- Enforcing appropriate relational constraints.
- Preserving transaction consistency.
- Supporting queries and reporting.
- Providing a recoverable and version-controlled schema lifecycle.

The database should not be publicly exposed to the internet. Access should be limited to authorized application services and administrative connections.

### 4.4 Database Access

Prisma is the provisional ORM and migration tool.

Before committing deeply to it, validate:

- Compatibility with the required PostgreSQL features.
- Migration review and deployment workflow.
- Transaction handling for business-critical operations.
- Portability and recovery procedures.
- Generated types and developer workflow.

Use parameterized queries or safe ORM operations. Avoid constructing unsafe SQL from untrusted input.

## 5. Backend Module Boundaries

The backend should be organized as a Modular Monolith.

Potential business modules include:

- Identity and Access
- Customers and Suppliers
- Products and Units
- Sales
- Distribution
- Inventory
- Purchasing
- Credit and Collections
- Accounting
- Reporting
- Audit

These are candidate boundaries, not a final domain model. Their dependencies, data ownership, and exact scope must be established during requirements and domain design.

Avoid circular dependencies and unrestricted cross-module access to internal implementation details.

## 6. Deployment

Docker Compose will orchestrate the initial services.

The production environment is expected to contain:

- Web application
- Backend API
- PostgreSQL database
- Reverse proxy and HTTPS configuration
- Supporting monitoring and backup mechanisms

Exact container images, resource limits, ports, health checks, deployment commands, and production configuration remain to be defined.

Secrets must be supplied through protected runtime configuration, not committed to Git.

## 7. Environments

Keep development, testing, and production configuration separate.

- Development: local machine and test data.
- Testing: automated checks and controlled integration tests.
- Production: real business data with restricted access and recovery controls.

Never use production data in development or testing without an approved protection and anonymization process.

## 8. Portability Requirements

- Store source code in Git.
- Store database schema changes in migrations.
- Keep deployment configuration under version control without secrets.
- Document environment variables and their purpose.
- Keep core business logic independent of hosting-provider APIs.
- Use standard PostgreSQL features wherever practical.
- Keep persistent files outside disposable application containers.
- Document database backup, restore, and server migration procedures.
- Test restoration and migration before relying on them.

## 9. Reliability and Recovery

A single VPS is a single point of failure.

The initial design should include:

- Automatic service restart where appropriate.
- Health checks.
- Monitoring and actionable alerts.
- Disk-space and resource monitoring.
- Scheduled database backups stored off-server.
- Backup retention rules.
- Periodic restore tests.
- A documented recovery procedure.

High availability and a second live server are not initial requirements unless future business needs justify the added cost.

## 10. Security Boundaries

- Use HTTPS for external application traffic.
- Keep PostgreSQL inaccessible from the public internet unless a narrowly controlled administrative requirement is approved.
- Apply least-privilege database credentials.
- Enforce authentication and authorization in the backend.
- Protect session credentials and secrets.
- Maintain appropriate audit records.
- Apply updates and monitor security advisories.
- Review upload handling, input validation, and rate limiting where applicable.

## 11. Decisions Still Required

- Exact authentication and session strategy.
- API versioning and error-response conventions.
- Database migration and production release procedure.
- Logging, monitoring, and alerting tools.
- Backup provider, retention, and recovery objectives.
- File storage requirements.
- Email and notification requirements.
- VPS provider and sizing.
- Automated deployment strategy.
- Whether and when a native mobile application is justified.
