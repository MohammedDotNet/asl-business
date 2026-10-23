<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## API configuration

The API validates configuration before listening. Supply `DATABASE_URL` as a
valid PostgreSQL connection URL. `PORT` is optional and defaults to `3001`; if
set, it must be an integer from `1` through `65535`. `NODE_ENV` may be
`development`, `test`, or `production` and defaults to `development`.

For local development, the API allows the documented frontend origin
`http://localhost:3000`. In production, set `CORS_ORIGINS` to a comma-separated
allowlist of exact HTTPS origins, for example:

```text
CORS_ORIGINS=https://app.example.com,https://admin.example.com
```

Origins must not contain paths, credentials, or wildcards. The API loads an
optional `apps/api/.env` file when present; environment variables already set
by the process take precedence. Never commit `.env` files or include their
values in logs or support reports.

Request validation is applied globally: DTOs must declare accepted fields,
unknown fields are rejected, and values are transformed to declared types.
Error responses retain HTTP status codes and use generic messages. Unexpected
server errors are logged without exception details, request data, or secrets.

## Prisma database access

The API uses Prisma 7.10.1 with the PostgreSQL driver adapter. After installing
workspace dependencies, generate the client from the existing schema:

```bash
npm exec --workspace @asl-business/api -- prisma generate --config prisma7.config.ts
```

The generated client is written to the ignored `apps/api/generated/prisma`
directory. Generation does not connect to or change the database. Regenerate
the client after an approved schema change.

Import `PrismaModule` into a NestJS module that needs database access, then
inject `PrismaService` into its provider. The service extends the generated
Prisma client and connects during Nest module initialization. Nest application
shutdown hooks disconnect the client gracefully. Initialization verifies
database reachability with a read-only `SELECT 1`. Connection failures are
logged with a generic diagnostic and a sanitized driver error code when
available; the connection string and underlying driver error are not logged.

The API startup validates and loads `DATABASE_URL` before NestJS creates the
Prisma provider. The Prisma CLI reads the same API `.env` through
`prisma7.config.ts`. Never print or include the connection URL in logs,
diagnostics, or support reports.

## Authorization foundation

The permission catalog and role templates are defined in
`src/authorization/permission-catalog.ts` and
`src/authorization/role-templates.ts`. Permission keys use the stable
`resource.action` convention. Phase 1 keys are distinct from proposed
permissions for business modules that do not yet exist; only Phase 1 keys can
be attached to current route policies. The catalog is the API-side source of
identifiers for guards and future seed/navigation consumers. Frontend
visibility is only a presentation decision and never authorizes an API
operation. Catalog entries do not create endpoints or automatically grant
permissions.

To add a permission, choose a stable unique key, add its resource, action,
label, description, and scope to the catalog, and add focused integrity tests.
Keep it proposed until the corresponding server operation exists. Then add an
explicit route policy and include the permission in reviewed seed mappings;
never infer create, post, export, or other sensitive capabilities from a
different permission.

`AuthorizationGuard` is registered globally. Routes must either declare
`@RequirePermissions(...)` or explicitly use `@Public()`. Routes without a
policy are denied by default. When several permissions are declared, the user
must have all of them. The guard reads only the authenticated principal's
`request.user.userId`, verifies that the user is active, and calculates the
union of permissions across assigned roles from Prisma on every request.
There is no permission cache, so database changes are reflected on the next
request. Request body and query values are never treated as identity or
permission evidence.

Authentication has not been implemented and no current route uses the
permission decorator. A future authentication module must attach a validated
principal to `request.user` before protected routes can succeed. The existing
root endpoint is explicitly public. `SYSTEM_ADMIN` is the only protected role
template; non-administrator role templates have no grants. The protected
marker is catalog metadata only until role-management operations exist.
Composite primary keys on `UserRole` and `RolePermission` prevent duplicate
assignments. The schema migration adds nullable unique role codes and indexes
for reverse relationship lookups; review and apply migrations through the
approved database workflow, never as part of client generation.

## Initial administrator seed

The idempotent seed is wired to Prisma 7 through `prisma7.config.ts`. It creates
the `SYSTEM_ADMIN` role, only Phase 1 permission rows, the template's listed
role-permission links, and one bootstrap user. The current proposed
`SYSTEM_ADMIN` mapping includes all 16 Phase 1 permissions (dashboard, user
management, role management, profile, and settings); it does not include
proposed future-module permissions. Other role templates receive no
permissions. Review this grant set before running the seed.

The seed requires `BOOTSTRAP_ADMIN_USERNAME` (up to 100 characters, without
leading/trailing whitespace) and `BOOTSTRAP_ADMIN_PASSWORD` (16–1024
characters). It hashes the password with Node.js scrypt and a random salt.
Credentials are never printed and the seed removes both bootstrap variables
from its process environment after the attempt. The seed creates an
administrator only if no user already has the `SYSTEM_ADMIN` role. A rerun
with the same username and only the `SYSTEM_ADMIN` assignment preserves the
account and password hash. It refuses to promote an unrelated existing
username, preserve an administrator with additional roles, create a second
administrator, or continue if the role's existing grants differ from the
template. The role, permissions, assignments, and account are handled in a
serializable transaction. Serialization conflicts and concurrent unique-key
collisions receive at most two retries; constraints remain the final duplicate
protection.

Before seeding, review the migration status and every pending migration. In
particular, older migrations in this repository remove the legacy `companies`
table and `company_id` column; do not deploy pending migrations to a database
with valuable data without reviewing their effects and preparing a verified
backup/recovery plan. The seed requires the schema migration adding `Role.code`
to have been applied. Do not treat seed execution as a migration step.

After the migration and grant-set review is approved, the API can be built and
seeded using process environment variables. In PowerShell, enter the password
at the masked prompt rather than placing it in command history:

```powershell
$env:BOOTSTRAP_ADMIN_USERNAME = Read-Host "Bootstrap administrator username"
$secureBootstrapPassword = Read-Host "Bootstrap administrator password" -AsSecureString
$env:BOOTSTRAP_ADMIN_PASSWORD = [System.Net.NetworkCredential]::new("", $secureBootstrapPassword).Password
npm exec --workspace @asl-business/api -- prisma db seed --config prisma7.config.ts
Remove-Item Env:BOOTSTRAP_ADMIN_USERNAME
Remove-Item Env:BOOTSTRAP_ADMIN_PASSWORD
Remove-Variable secureBootstrapPassword
```

Run this only in a trusted administrative environment after explicit approval.
Remove the temporary variables and secret-store entry immediately afterward;
keep the account password in an approved password manager. The current
application does not yet provide login or password-change functionality, so
the password must be protected until those flows are implemented. Re-running
the seed does not rotate or reset it.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

To add it to this project:

```bash
$ npm install @nestjs/observe
```

Then follow the [setup guide](https://docs.nestjs.com/observability/overview) - it takes a single import and an app key.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
