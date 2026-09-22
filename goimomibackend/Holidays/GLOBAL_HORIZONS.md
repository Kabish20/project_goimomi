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

Only website is optional. All other profile fields, including organization and photo,
are required. Participants must select a ticket status. Selecting Booked requires arrival
and return dates, flight numbers and local times. Return date cannot precede arrival.
Changing back to Not Booked clears stored flight details. Migration 0160 adds these fields.
Photos must be valid JPEG, PNG or WebP images up to 5 MB. Experience
accepts whole years from 0 to 100. Photos use the existing media storage under
`global_horizons/srilanka/`; retain that directory alongside database backups.

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
