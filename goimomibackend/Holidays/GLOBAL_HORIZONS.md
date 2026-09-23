# Global Horizons - Srilanka

- Participant form: `/globalhorizonssrilanka` (old `/global-horizons-srilanka` links redirect here)
- React admin section: `/admin/global-horizons-srilanka`
- Django admin section: `/management/Holidays/globalhorizonsprofile/`
- API: `/api/global-horizons-srilanka/`

The participant form accepts public multipart POST submissions. Listing, retrieving,
updating and deleting profiles require a staff account. Admins can also add profiles
and edit saved details using the React admin section.

The admin list includes Download Excel (.xlsx) and Download PDF buttons. Exports
include all profile fields, flight details and a photo URL, and follow the current
search filter. The staff-only endpoint is `/api/global-horizons-srilanka/export/`
with `file_type=xlsx` or `file_type=pdf` and an optional `search` parameter.
Install updated backend requirements before deployment (adds openpyxl).

Website and organization logo are optional. All other profile fields, including organization and photo,
are required. Participants must select a ticket status. Selecting Booked requires arrival
and return dates, flight numbers and local times. Return date cannot precede arrival.
Changing back to Not Booked clears stored flight details. Migration 0160 adds these fields.
Photos must be valid JPEG, PNG or WebP images up to 5 MB. Experience
accepts whole years from 0 to 100. Photos use the existing media storage under
`global_horizons/srilanka/`; retain that directory alongside database backups.

Migration 0162 adds the optional organization logo. Migration 0163 adds generated
attending poster and individual profile booklet PDF files. Public submissions and
staff edits automatically prepare both documents using the uploaded photo, optional
organization logo, and the bundled Global Horizons, Goimomi and Chithirai logos.
Download links appear on the submission success screen and admin profile view.
Generated files use UUID filenames under `global_horizons/documents/`; retain this
directory with media backups. If generation fails, the profile remains saved and
the UI reports unavailable downloads; staff can edit/save the profile to retry.
Existing profiles can also be edited/saved to prepare their documents.

The staff-only `export/?file_type=booklet` endpoint creates a branded combined PDF
from the current profiles, including every new submission and respecting `search`.
Each participant begins on a new page; long introductions continue onto more pages.
Booklets include professional/contact details, photos and logos. Flight information
remains in the existing staff Excel/PDF exports. The shareable attending poster
includes name, profession, organization and location, with no contact or flight details.

The redesigned poster also generates a 1080 x 1350 PNG for social uploads, stored in
`attending_poster_image` (migration 0164). Install the updated requirements, including
the pinned pypdfium2 renderer. The success page previews this image and provides PNG,
poster PDF and booklet PDF downloads. Existing profiles need an edit/save to regenerate
their assets in the new design. Combined booklets with multiple profiles include a cover.

For deployment, ship the frontend build and backend code, run `python manage.py migrate`
from `goimomibackend`, and restart the backend. Migration `0159_globalhorizonsprofile`
adds the participant table without changing existing registrations. Production must
serve uploaded media using the project's existing media configuration.

Checks:

```text
# From goimomibackend
python manage.py test Holidays.test_global_horizons Holidays.test_regressions --settings=backend.test_settings

# From goimomifrontend
npm test
npm run build
node scripts/verify-global-horizons.mjs
```

The browser check requires the frontend dev server on port 5174 (or `VERIFY_BASE_URL`)
and uses mocked API responses. Backend tests verify real persistence and permissions
in an isolated test database with temporary media storage. Browser screenshots are
written to `output/global-horizons/`.

## Automatic full Excel emails

Set `GLOBAL_HORIZONS_EXPORT_RECIPIENTS` in the production backend `.env` to a comma-separated list of organiser email addresses. An empty value disables new notifications. Restart `goimomi` and `goimomi-enquiries` after changing recipients. Only explicitly approved organiser addresses should be configured.

Every committed participant creation, edit or deletion creates a delivery record. Changes from the public API, React admin and Django admin are covered; internal document-only saves do not send duplicates. The attachment contains all current participants, all profile/flight fields, and absolute photo, logo and document links. Each event retains its recipient list. The workbook is generated when the worker processes the email, so it reflects the latest saved list rather than a historical snapshot. Recipients are BCC'd.

`goimomi-enquiries` sends asynchronously. `goimomi-profile-exports.timer` republishes due pending records every minute, including after a queue outage. SMTP failures retry with increasing delays, up to five attempts; exhausted deliveries remain visible as Failed. Django admin > Global horizons export emails shows status and offers a retry action for failed deliveries. Reprocessing an already-sent event does not resend it; a process crash after SMTP acceptance but before the database acknowledgement can still duplicate mail.

Database and media backups remain necessary. A successful send means the configured SMTP provider accepted the email; mailbox placement and inbox receipt are not guaranteed by that status.

CC update: `GLOBAL_HORIZONS_EXPORT_CC` accepts comma-separated visible CC recipients. The first main recipient is placed in To; any additional main recipients remain BCC. CC addresses already in the main recipient list are excluded to avoid duplicates. CC settings are read when a pending email is delivered. Production CC is support@goimomi.com.
