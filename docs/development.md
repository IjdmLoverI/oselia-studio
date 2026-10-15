# Development

## Requirements

- Node.js 22 or newer. The version CI uses is in `.nvmrc`.
- Docker, for the local Postgres.

## First run

```bash
npm install
cp .env.example .env
npm run db:up
npm run migrate
npm run seed
npm run dev
```

`npm run db:up` starts Postgres 17 from `docker-compose.yml`. It listens on
`127.0.0.1:5434`, so it stays off the network and does not clash with a Postgres already
running on 5432. Data persists in the `pgdata` volume. `docker compose down -v` gives you a
clean database.

## Environment

| Variable                                  | Required | Purpose                                                                                       |
| ----------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                            | yes      | Postgres connection string                                                                    |
| `PAYLOAD_SECRET`                          | yes      | at least 32 characters; signs admin sessions and salts IP hashes                              |
| `NEXT_PUBLIC_SITE_URL`                    | no       | absolute URL for canonical links, sitemap and Open Graph; defaults to `http://localhost:3000` |
| `TELEGRAM_BOT_TOKEN`                      | no       | bot that posts new leads                                                                      |
| `TELEGRAM_CHAT_ID`                        | no       | chat, group or channel that receives them                                                     |
| `BLOB_READ_WRITE_TOKEN`                   | no       | stores uploads in Vercel Blob instead of `./media`                                            |
| `SITE_INDEXING`                           | no       | `true` lets search engines index the site; anything else keeps it hidden                      |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | no       | the seed creates this admin if it does not exist yet                                          |

`src/env.ts` validates these with zod when the server starts. A missing or malformed value
fails loudly instead of surfacing later as a confusing runtime error.

## Seed data

`npm run seed` runs `scripts/seed.ts` through `payload run`. It loads:

- 31 photos;
- 6 services, 6 projects, 6 reviews and 8 FAQ entries;
- the site settings and the price list.

Everything is in both languages. The script upserts by slug or file name, so running it again
refreshes the demo content instead of duplicating it. The texts live in
`scripts/seed/content.ts`, and the images in `scripts/seed/media`.

When uploads go to Vercel Blob, the seed also checks that every stored image still exists. A
media record whose file is missing gets its file uploaded again under the same name.

Every Local API call gets its own `context` object. The storage plugin keeps per-request upload
state in `req.context`. A shared object would carry the first image's state into every later
upload, and only the first file would reach Blob.

Each project's sketch image is derived from its cover photo: grayscale, an edge filter, then a
warm tint over paper colour. Because of that, the slider compares exactly the same view.

## Checks

| Command                | Runs                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `npm run lint`         | ESLint with the Next.js core-web-vitals and TypeScript rules |
| `npm run typecheck`    | `next typegen` for route types, then `tsc --noEmit`          |
| `npm run format:check` | Prettier, including Tailwind class ordering                  |
| `npm test`             | Vitest unit tests in `tests/unit`                            |
| `npm run e2e`          | Playwright tests in `tests/e2e`                              |

A pre-commit hook runs ESLint and Prettier on staged files through lint-staged.

### Unit tests

The unit tests cover the logic that is easy to get subtly wrong:

- the price estimate;
- phone normalization and lead validation;
- the Telegram message format and HTML escaping;
- Ukrainian transliteration for slugs, including apostrophes.

### End-to-end tests

`npm run e2e` starts `next start` on port 3100 and runs every test on two projects: Desktop
Chrome and Pixel 7. Build first and have the database seeded. If a server is already running on
3100, it is reused outside CI.

```bash
npm run build
npm run e2e
```

The suite covers:

- landing in the right language;
- the language switcher, navigation and the mobile menu;
- the FAQ;
- the project filter and project pages, including the slider from the keyboard;
- the calculator estimate travelling into the form;
- form validation and the time trap;
- the `noindex` setup;
- an axe scan (WCAG 2.1 A and AA) of the home page in both languages, a project page and the
  credits page.

The fixture in `tests/e2e/fixtures.ts` marks the intro as already seen, so tests do not wait
for it. The lead tests send a random `x-forwarded-for` address so the rate limit does not
interfere. A successful submission stores a lead whose name starts with `E2E`. Clear these from
the admin, or with SQL, when you no longer want them.

## Conventions

- **Server Components by default.**
  - `'use client'` appears only where there is state, an effect or a browser API: motion,
    the calculator, the form, the menus and the switchers.
  - Data is fetched in pages and passed down as props.
- **Content queries** live in `src/lib/content.ts` and are marked `server-only`.
- **Styling** uses Tailwind utilities on top of the design tokens in `globals.css` (`@theme`).
  - Animations that do not depend on scroll or the pointer are plain CSS.
  - Anything that moves has a reduced-motion fallback.
- **Text.** No user-facing string is hard-coded in a component. Interface text goes into both
  `messages` files; content goes into the CMS.
- **Comments.** Code explains itself through names. The reasoning behind decisions lives in
  `docs/`.
- **Commits.** Small commits with short messages in the imperative.

## Regenerated files

- `src/payload-types.ts`, after any schema change (`npm run generate:types`).
- `src/app/(payload)/admin/importMap.js`, after adding custom admin components
  (`npm run generate:importmap`).
- `src/assets/materials/*.webp`, after editing `scripts/materials/textures.ts`
  (`npm run materials`; needs Playwright's Chromium).

## Troubleshooting

- **The build fails with `Expected workStore to be initialized` or a `useContext` of null on
  Windows.** The shell's working directory differs in letter case from the real folder name,
  and Next resolves some modules twice. `cd` into the folder with its exact casing.
- **The admin opens slowly the first time in `npm run dev`.** The admin is a large bundle
  compiled on first request. It is fast after that, and in production builds.
