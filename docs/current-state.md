# Project Current State

## Last Updated

2026-10-18

## 1. Project Status

**Stage:** Initial project documentation and development preparation.

**Overall status:** Planning and setup. Functional implementation has not started.

## 2. Confirmed Project Direction

The project is a new business management system intended to integrate sales, distribution, inventory, purchasing, customer credit, collections, accounting, access control, auditability, and reporting.

The system should be professional, maintainable, secure, affordable to operate, and portable between compatible hosting environments.

## 3. Approved Technology Direction

- Frontend: Next.js + TypeScript.
- Backend: NestJS + Node.js + TypeScript.
- Database: PostgreSQL on the project's VPS.
- Database ORM and migrations: Prisma, provisionally.
- UI styling: Tailwind CSS.
- UI components: shadcn/ui.
- Service orchestration: Docker Compose.
- Initial hosting: one VPS.
- Public application access: HTTPS.
- Initial mobile strategy: responsive web application and PWA evaluation.
- Source control: Git.
- Remote repository: GitHub repository not yet created.

## 4. Approved Initial Repository Structure

```text
asl-business/
├── AGENTS.md
├── README.md
├── apps/
│   ├── web/
│   └── api/
├── packages/
├── infra/
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── decisions.md
│   ├── glossary.md
│   └── current-state.md
└── tests/
```

The structure has been approved conceptually. Its directories and files have not yet been verified as created on the user's computer.

## 5. Development Workflow

The project will use an approval-based AI-assisted workflow:

1. Define and approve requirements.
2. Prepare a plan without changing code.
3. Review the plan and expected files.
4. Approve a small implementation task.
5. Implement the task.
6. Run relevant tests and checks.
7. Explain the changes and technical concepts.
8. Review and verify the result.
9. Commit the approved work.
10. Proceed to the next task only after review.

The coding agent is expected to run inside VS Code. Its exact identity and configuration have not yet been confirmed.

## 6. Documentation Status

The initial documentation content is intended for these files:

- `AGENTS.md`
- `README.md`
- `docs/requirements.md`
- `docs/architecture.md`
- `docs/decisions.md`
- `docs/glossary.md`
- `docs/current-state.md`

Do not claim these files exist in the repository until their creation has been verified.

## 7. Completed Decisions

- The initial technology direction is approved.
- The initial repository structure is approved.
- The project owner retains final authority over business and architectural decisions.
- Implementation must proceed in small, reviewable tasks.
- Core business logic should remain independent of hosting-provider-specific services.
- The initial deployment should use one VPS.
- Backups must be stored outside the primary VPS.

## 8. Outstanding Decisions and Work

### Documentation

- Copy the drafted documents into the repository.
- Review consistency across all documents.
- Refine business requirements into explicit workflows and acceptance criteria.

### Development Environment

- Confirm the installed Node.js and package-manager versions.
- Confirm Git configuration.
- Create the GitHub repository.
- Prepare the local project workspace in VS Code.
- Decide the package manager and workspace configuration.

### Architecture

- Validate Prisma against the database and transaction requirements.
- Specify authentication, sessions, and account recovery.
- Define API conventions and error responses.
- Define logging, monitoring, backup, and recovery procedures.
- Select a VPS provider and suitable initial server resources.

### Business Analysis

- Define the required sales, distribution, and inventory workflows.
- Define purchasing, customer credit, and collection rules.
- Define the accounting model and financial controls.
- Define user roles and permissions.
- Define required reports and regulatory integrations.

## 9. Current Task

**Task:** Create the initial project directory structure and documentation files.

**Expected outcome:** The project owner has verified that the documentation exists in the intended paths and reviewed its content.

## 10. Next Action

After the documentation is created and reviewed, verify the local development environment and Git setup. Then create the repository and establish a documented, reproducible project initialization procedure.

Do not begin functional implementation until the documentation and initial setup are reviewed and approved.
