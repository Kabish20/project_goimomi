# Project audit — 5 September 2026

The reproducible issues below were fixed in the working tree. No production deployment or live database migration was performed.

## Fixes

- **Admin API access:** credentials are retained when reading enquiries and creating, editing, or deleting geographic master data. Public form submissions still work without authentication.
- **Login sessions:** simultaneous failed requests share one token refresh; public requests cannot inherit stale credentials; an old refresh response cannot replace or clear a newer login. Logout clears access and refresh tokens as well as the displayed user.
- **Private enquiries:** access to existing enquiries and business registrations requires staff permissions; public creation remains available.
- **Cab pricing:** checkout requires a matching rate valid for the requested date and route. It no longer accepts browser prices, expired rates, or a fallback fare of 1. Invalid and non-finite rate values are ignored.
- **Cab search and vehicle management:** malformed rate-card rows no longer crash search; vehicles with no brand have a valid display name; the missing FileText icon import is restored.
- **Visa applications:** applicant and document data are validated before saving the application in a transaction. Both JSON arrays and multipart JSON strings are accepted. CRM lead preparation now uses fields that exist on the models.
- **Catalogue management:** nested edits retain child IDs and update existing children. Children from another catalogue are rejected, and malformed bulk payloads return validation errors.
- **Pagination and search:** invalid page values return HTTP 400; empty results report at least one page. Country-management and visa-result requests cancel obsolete searches so old responses cannot replace newer results.
- **Product orders:** manual creation requires staff access. Invalid quantities, prices, and statuses are rejected. Confirmed, shipped, and delivered manual orders use transactional stock deduction. PUT and PATCH enforce the same inventory protections, and failed shipping cannot mark an order as shipped or send a shipping email.
- **Deployment packaging:** newly generated archives exclude local environment files, credentials, databases, logs, and virtual environments while retaining `.env.example`. The pre-existing `update_package.zip` was not regenerated.
- **Checks:** ESLint now detects undefined JSX components. Portable frontend, backend, and packaging test commands are available at the workspace root.

## Verification

| Check | Result |
| --- | --- |
| Frontend production build and SEO generation | Passed |
| ESLint, including JSX references and build scripts | 0 errors; 135 warnings |
| Django system checks | Passed |
| Model/migration consistency | No changes detected |
| Backend regression tests | 24 passed, including reads of every registered resource type |
| Frontend API regression tests | 7 passed |
| Deployment archive regression test | 1 passed |
| Headless Edge smoke test | 83 public/admin pages loaded without uncaught JavaScript errors using mock API responses |

Run the automated checks from the workspace root:

```shell
npm run test:backend
npm run test:frontend
npm run test:packaging
npm run check:backend
npm run lint:frontend
npm run build:frontend
```

The backend test command uses `backend.test_settings`, an isolated in-memory SQLite database and an in-memory email backend. The test runner successfully applied the migration history to the temporary database.

## Limits

The remaining lint warnings mainly concern unused code and React effect dependencies. Live Zoho payments, CRM, email delivery, WhatsApp, deployment services, and PostgreSQL-specific concurrency were not exercised. Browser checks used fixture data and did not submit real bookings or payments. These checks cover the issues found during this audit; they do not establish that every possible production flow is bug-free.
