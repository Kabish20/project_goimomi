# Design sources and browser verification

Keep destination image originals and generation notes here. Website images belong
in `public/images/` or `src/assets/`. Generated screenshots and verification reports
are written to the workspace `output/design/` directory and are ignored by Git.
Design sources and verification output are excluded from deployment archives.

## Run the existing page checks

Install frontend dependencies with `npm ci` and start the frontend with `npm run dev`.
With Microsoft Edge installed, run these commands from `goimomifrontend`:

```sh
npm run test:browser
```

This also checks cab rendering, admin edit forms, and visa country filtering with
mocked API responses. To run only an individual destination check:

```sh
node design/trending/verify-pages.mjs
node design/manali/verify-page.mjs
node design/azerbaijan/verify-page.mjs
```

The scripts use `http://localhost:5174` by default. Set `VERIFY_BASE_URL` to use a
different local port, or `VERIFY_BROWSER_CHANNEL=chrome` to use installed Chrome.
Use a local development server: these scripts interact with page controls and forms.
