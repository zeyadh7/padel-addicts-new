# The Padel Addicts: new website

React + Vite + Tailwind CSS + Framer Motion, reading the same Supabase project as the current `index.html`.
Deploys to GitHub Pages with GitHub Actions.

## Run it on your computer

1. Install Node.js 20 or newer (https://nodejs.org).
2. In this folder: `npm install`
3. `npm run dev` and open the address it prints.

## Deploy to GitHub Pages

1. Put this folder's contents in a GitHub repository (a new branch such as `rebuild` is safest, so your live `index.html` stays untouched).
2. In the repository: Settings, Pages, set **Source** to **GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site.
4. The site is served at `https://<org>.github.io/<repo>/`. The workflow sets the base path from the repository name.

If the repository is named `<org>.github.io` (served at the root), change `VITE_BASE` in the workflow to `/`
and set `segmentCount` to `0` in `public/404.html`.

## Why `public/404.html` exists

GitHub Pages only serves real files, so a refresh on `/tournaments/123` would show a 404. That file bounces the visitor
back into the app, which restores the clean URL. It is what lets you share direct links on WhatsApp.

## What is done / next

Done: layout, navigation (with phone bottom tab bar), Home, Tournaments, Tournament detail (facts + teams), Rankings.
Next: groups / matches / bracket tabs, accounts and registration, admin area, Row Level Security fixes in Supabase.

Only public columns are read (no phone numbers or emails).
