# Project Glossary

## Purpose

Define common technical and business terms used throughout ASL Business.

Business definitions are provisional until the relevant workflows and policies are approved. Do not treat an illustrative definition as an approved business rule.

## Technical Terms

| Term | Definition |
|---|---|
| Frontend | The user-facing application running in the browser. |
| Backend | Server-side application logic that validates requests, enforces permissions, and performs business operations. |
| API | A defined interface through which application components communicate. |
| Database | The persistent storage system for structured application data. |
| PostgreSQL | The relational database technology selected for the project. |
| ORM | A tool that maps application-level data operations to database operations. |
| Migration | A version-controlled change to the database schema or structure. |
| Modular Monolith | One deployable backend application organized into modules with explicit responsibilities. |
| VPS | A virtual private server used to host the application and database. |
| Docker | A technology for packaging and running applications in containers. |
| Docker Compose | A tool for defining and operating a set of related services. |
| PWA | A web application that can provide selected app-like capabilities through supported browsers and platforms. |
| Authentication | Verifying the identity of a user or service. |
| Authorization | Determining which actions an authenticated identity is allowed to perform. |
| Audit Log | A record of specified actions and events used for traceability and review. |
| Acceptance Criteria | Conditions that must be satisfied for a requirement or task to be accepted. |
| Source Control | Versioned tracking of changes to project files, using Git in this project. |
| Environment Variable | A runtime configuration value supplied outside the application source code. |
| Backup | A recoverable copy of data or configuration. |
| Restore | Recovering data or a system from a backup. |

## Business Terms

| Term | Initial Meaning |
|---|---|
| Customer | A party that purchases goods or services from the company. |
| Supplier | A party from which the company purchases goods or services. |
| Product | An item or service managed by the system. |
| Inventory | The recorded quantities and relevant status of goods held or controlled by the business. |
| Warehouse | A defined place or logical location used to manage inventory. The exact model remains to be specified. |
| Stock Movement | A recorded event that changes the quantity or location of inventory. |
| Sales Transaction | An approved business transaction representing a sale under the rules defined for the system. |
| Purchase Transaction | An approved transaction representing a purchase under the rules defined for the system. |
| Distribution | The process of moving and delivering goods through the company's approved workflow. |
| Collection | Recording money received from a customer or another authorized payer. |
| Customer Balance | The calculated amount owed by or otherwise due from a customer, according to approved accounting rules. |
| Credit Policy | Rules governing whether and under what conditions a customer may receive goods or services on credit. |
| Reconciliation | Comparing related records or balances to identify and resolve differences. |
| Stock Count | A process of counting physical inventory and comparing the result with recorded quantities. |
| Business Rule | An approved rule governing how the company operates or how a transaction must behave. |
| Transaction Integrity | Ensuring that a business operation does not leave related data in an invalid or inconsistent state. |

## Naming Conventions

- Use English identifiers in source code, database objects, API routes, and filenames unless a documented exception is approved.
- Use clear, descriptive names instead of unexplained abbreviations.
- Use consistent terminology across requirements, UI labels, APIs, database schema, and tests.
- Keep user-facing Arabic terminology separate from internal identifiers where appropriate.
- Record business-specific meanings when a term has more than one plausible interpretation.

## Open Definitions

The following require explicit business definitions:

- Product variants, units, and packaging.
- Warehouse and storage-location structure.
- Stock ownership and responsibility.
- Sales, delivery, and return states.
- Customer balance calculation and payment allocation.
- Credit limits and payment terms.
- Accounting periods, accounts, and posting rules.
- Cancellation, reversal, correction, and approval semantics.
- Audit-event categories and retention.
