# ASL Business

## Project Overview

ASL Business is a new, integrated business management system intended to support company operations through a consistent, secure, auditable, and maintainable application.

The project aims to connect business operations, reduce repetitive manual work, improve data accuracy, establish clear responsibilities, and provide reliable operational and financial information.

The system will be developed incrementally, with explicit approval of requirements and architecture decisions.

## Project Goals

- Integrate sales, distribution, inventory, purchasing, customer credit, collections, and accounting.
- Reduce avoidable manual data entry and duplicated work.
- Maintain consistent customer balances and inventory records.
- Establish role-based access control and clear operational responsibilities.
- Preserve an auditable history of important actions.
- Provide dependable operational and financial reports.
- Provide a professional web experience on desktop and mobile browsers.
- Keep the codebase maintainable, testable, and portable across hosting providers.

## Technology Stack

| Area | Technology |
|---|---|
| Web frontend | Next.js + TypeScript |
| Backend API | NestJS + Node.js + TypeScript |
| Database | PostgreSQL |
| Database access and migrations | Prisma, provisionally |
| UI styling | Tailwind CSS |
| UI components | shadcn/ui |
| Service orchestration | Docker Compose |
| Initial deployment | A VPS managed by the project owner |
| Secure public access | HTTPS |
| Initial mobile approach | Responsive web application and PWA evaluation |
| Version control | Git; GitHub repository to be created |

Prisma and other choices explicitly marked provisional must be validated before they become irreversible implementation dependencies.

## Architecture Principles

- Use a Modular Monolith for the initial backend.
- Keep the web frontend, backend API, and database logically separated.
- Route application operations through the backend API.
- Keep core business rules independent of hosting-provider-specific services.
- Prefer portable technologies and standard PostgreSQL capabilities.
- Keep schema changes and configuration templates version-controlled.
- Never commit secrets or production credentials.
- Maintain backups outside the primary VPS and test recovery procedures.

## Project Structure

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

This is the approved initial structure. Additional folders may be introduced when a concrete requirement justifies them.

## Development Workflow

1. Define and clarify the requirement.
2. Agree on acceptance criteria.
3. Review the architecture and implementation plan.
4. Approve the expected changes.
5. Implement a small, reviewable task.
6. Run tests and relevant checks.
7. Review the code and understand the implementation.
8. Update documentation and verify the result.
9. Commit the approved changes.
10. Continue to the next task only after review.

## Project Status

The initial technology direction and repository structure have been approved. Detailed requirements, implementation decisions, environment setup, and functional development remain to be completed or verified.

See `docs/current-state.md` for the current stage and next action.

## Security Notice

This project may eventually handle sensitive business, customer, inventory, and financial data. Security, access control, backups, auditability, and recovery must be designed and tested before production use.

## License

No license has been selected yet. Do not assume the project is open source or authorize redistribution without an explicit decision.
