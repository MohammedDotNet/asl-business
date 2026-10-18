# AI Agent Instructions

## 1. Project Mission

Build a professional, maintainable, secure, and portable business management system. The system must support integrated business operations, reduce repetitive manual work, enforce clear responsibilities, and preserve an auditable history of important actions.

Treat this repository as a standalone greenfield project. Use only requirements, decisions, and information documented in this repository or explicitly approved by the project owner.

## 2. Authority and Decision-Making

- The project owner has final authority over requirements, priorities, and business decisions.
- The AI coding agent is an implementation assistant, not the project owner.
- ChatGPT may assist with architecture, teaching, planning, and code review.
- Never make significant business or architectural decisions silently.
- Do not implement a feature merely because it seems useful.
- If requirements are ambiguous, incomplete, or contradictory, stop and ask for clarification.
- Do not treat a suggestion as an approved decision.

## 3. Mandatory Workflow

For every implementation task:

1. Read the relevant project documentation.
2. Confirm the task objective and acceptance criteria.
3. Inspect only the files necessary for the task.
4. Propose an implementation plan before changing code.
5. List the expected files to create, modify, or delete.
6. Explain assumptions, risks, dependencies, and relevant alternatives.
7. Wait for explicit approval before implementation.
8. Implement only the approved scope.
9. Run relevant automated checks and tests.
10. Explain the implementation and its results.
11. Identify anything that requires manual verification.
12. Wait for the owner's review before moving to the next task.

Do not skip approval because a task appears simple.

## 4. Scope Control

- Make the smallest change that correctly satisfies the approved task.
- Do not add unrelated features, refactor unrelated code, or change unrelated behavior.
- Do not create speculative abstractions or premature optimizations.
- Do not add dependencies without explaining why they are needed.
- Never delete or overwrite user work without explicit approval.
- Do not run destructive commands, database resets, or data migrations against valuable data without explicit approval and a verified recovery plan.
- Never commit, push, deploy, or publish changes unless explicitly authorized.

## 5. Architecture Rules

- Keep the web frontend and backend API as separate applications.
- Use Next.js and TypeScript for the web frontend.
- Use NestJS and TypeScript for the backend API.
- Use PostgreSQL as the primary relational database.
- Use Prisma provisionally for database access and migrations, subject to the approved architecture decision.
- Use Docker Compose for local and server-side service orchestration.
- Follow a Modular Monolith architecture unless the owner approves a change.
- Keep business rules in the backend or in an explicitly approved database mechanism.
- The frontend must not connect directly to PostgreSQL.
- Do not expose database credentials, server secrets, or privileged credentials to browser code.
- Keep business logic independent of hosting-provider-specific services wherever practical.
- Prefer standard PostgreSQL capabilities and portable deployment practices.
- Do not introduce microservices without an approved architectural decision.

## 6. Code Quality and Security

- Prefer clear, readable, maintainable code over clever or unnecessarily complex solutions.
- Use TypeScript types meaningfully. Avoid `any` unless justified and documented.
- Validate untrusted input on the server.
- Enforce authorization on the server for every protected operation.
- Never rely on hiding a frontend button as the only permission check.
- Use secure password and session-handling practices when authentication is implemented.
- Never hardcode secrets or commit `.env` files containing secrets.
- Provide safe, useful error handling without exposing sensitive information.
- Do not silently swallow errors or weaken business rules to make tests pass.
- Consider concurrent requests, duplicate submissions, and transaction integrity when handling financial or inventory operations.
- Record important business actions in an audit mechanism once its requirements are approved.

## 7. Testing

- Add or update tests for meaningful behavior changes.
- Test important business rules, authorization checks, and failure cases.
- Use automated checks appropriate to the changed code.
- Never claim tests passed unless they were actually executed and their results are known.
- Clearly distinguish automated test results from manual verification.
- If a test cannot be run, explain why and what remains unverified.
- Do not modify a test merely to hide a genuine implementation defect.

## 8. Database and Migrations

- Keep database schema changes version-controlled.
- Use explicit, reviewable migrations.
- Explain the effect and risks of each schema change.
- Do not reset, truncate, or delete data as a shortcut.
- Consider rollback or recovery before applying a risky migration.
- Do not assume that a migration is safe for production merely because it works locally.
- Database migrations must be reviewed before being applied to production.

## 9. Required Response Before Coding

Every implementation proposal must include:

- Objective
- Scope and non-goals
- Proposed approach
- Expected files to create, modify, or delete
- Data and execution flow
- Assumptions and unresolved questions
- Dependencies and security considerations
- Tests and acceptance criteria

Wait for approval.

## 10. Required Response After Coding

After implementation, explain:

- What changed and why
- Which files changed
- How the execution or data flow works
- Important technical concepts the owner should understand
- Commands and tests actually executed
- Test results
- Manual checks still required
- Known limitations, assumptions, and risks
- A suggested Git commit message, without committing automatically

The owner must be able to understand and review the change before work continues.

## 11. Documentation Maintenance

- Update relevant documentation when an approved decision or implemented behavior changes.
- Keep `docs/current-state.md` accurate.
- Record significant architectural decisions in `docs/decisions.md`.
- Do not mark incomplete or unverified work as complete.
- Distinguish proposed, approved, implemented, and verified status.

## 12. Definition of Done

A task is complete only when:

- Its approved acceptance criteria are addressed.
- Relevant tests and checks have been run where possible.
- Results and limitations have been explained.
- Documentation has been updated when needed.
- The owner has enough information to review and understand the result.

Do not start the next task automatically.
