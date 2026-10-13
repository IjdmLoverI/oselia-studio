# Deployment

Production runs on three managed services:

- **Vercel** hosts the Next.js app, including the admin and the API.
- **Neon** provides Postgres.
- **Vercel Blob** stores uploaded images.

All three have free tiers that cover a site of this size.

## 1. Database (Neon)

1. Create a Neon project in `aws-eu-central-1` (Frankfurt), close to the visitors and to
   Vercel's `fra1` region.
2. Copy two connection strings:
   - the **pooled** one (its host contains `-pooler`) for `DATABASE_URL` on Vercel;
   - the **direct** one for running migrations and the seed from your machine.

   Both need `sslmode=require`.

## 2. Schema and content

Seed the database before the first deploy. The build prerenders pages from whatever is in the
database at that moment, so an empty database means an empty first deploy.

Run from your machine with production values. The values below are placeholders:

```bash
DATABASE_URL="postgres://…direct…?sslmode=require" \
BLOB_READ_WRITE_TOKEN="…" \
PAYLOAD_SECRET="…same secret as in Vercel…" \
npm run migrate
```

Then run `npm run seed` with the same variables. With `BLOB_READ_WRITE_TOKEN` set, the seed
uploads the photos straight to Blob, so production never reads from a local `media` folder.

Leave `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` empty for production. Create the first admin
in the browser instead (step 5), so the password never sits in a file or shell history.

## 3. File storage (Vercel Blob)

In the Vercel dashboard, open **Storage**, create a Blob store and connect it to the project.
Vercel then adds `BLOB_READ_WRITE_TOKEN` to the project's environment.

- Files are served from the public Blob URL. `next.config.ts` already allows
  `*.public.blob.vercel-storage.com` for `next/image`.
- Vercel caps a function request body at 4.5 MB, and uploads in the admin pass through a
  function. Resize larger photos before uploading. Payload converts them to WebP anyway.

## 4. Vercel project

Import the GitHub repository and set:

| Setting          | Value                              |
| ---------------- | ---------------------------------- |
| Framework preset | Next.js                            |
| Build command    | `npm run migrate && npm run build` |
| Node.js version  | 22.x                               |
| Function region  | `fra1`                             |

The build command applies pending migrations before building. A deploy with a schema change
then cannot meet an old database.

Environment variables (Production, and Preview if previews should work):

| Variable                | Value                                                    |
| ----------------------- | -------------------------------------------------------- |
| `DATABASE_URL`          | Neon pooled connection string                            |
| `PAYLOAD_SECRET`        | `openssl rand -hex 32`, never reused from development    |
| `NEXT_PUBLIC_SITE_URL`  | `https://` plus the production domain, no trailing slash |
| `BLOB_READ_WRITE_TOKEN` | added by the Blob store                                  |
| `TELEGRAM_BOT_TOKEN`    | see below                                                |
| `TELEGRAM_CHAT_ID`      | see below                                                |
| `SITE_INDEXING`         | `false` for the concept site; `true` for a real business |

`NEXT_PUBLIC_SITE_URL` is inlined at build time. Redeploy after changing it or adding a domain.

When pasting values, make sure no trailing newline comes along. A secret with an invisible
`\n` at the end breaks sign-in and Telegram in ways that are hard to spot. The dashboard form
and the REST API are both safe; piping a value into `vercel env add` with `echo` is not.

## 5. First admin

Open `https://<domain>/admin`. With an empty `users` table, Payload shows a form to create the
first user. Create the account there. Add more accounts later in the admin's **Users**
section.

## 6. Telegram notifications

1. Create a bot with [@BotFather](https://t.me/BotFather). Its token goes into
   `TELEGRAM_BOT_TOKEN`.
2. Add the bot to the chat, group or channel that should receive leads. In a channel, the bot
   needs to be an admin.
3. Send any message there and open `https://api.telegram.org/bot<token>/getUpdates`. The
   `chat.id` is the value for `TELEGRAM_CHAT_ID`. Group and channel IDs are negative.
4. Redeploy and send a test request from the site.

Without these two variables the form still works: leads are saved in the admin only.

## Rate limiting behind a proxy

The form limits requests per client IP, read from the first entry of `x-forwarded-for`. Vercel
sets that header itself and overwrites whatever the client sent. If the app is ever hosted
behind another proxy, make sure that proxy does the same. Otherwise the limit can be
sidestepped.

## Checks after a deploy

- `/uk` and `/en` load. `/` redirects by browser language.
- A project page opens, and its slider works.
- The calculator shows the production prices.
- A test request appears in **Leads** and in Telegram.
- `/admin` signs in, and editing a service shows on the site after a reload.
- `/robots.txt` matches the intended `SITE_INDEXING`.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests:

1. **Check.**
   - Prettier;
   - ESLint;
   - type checking;
   - unit tests.
2. **End-to-end.**
   - A Postgres 17 service container is started.
   - Migrations and the seed are applied.
   - The app is built, and the Playwright suite runs on desktop and mobile viewports.
   - The HTML report is uploaded when something fails.

Vercel's Git integration deploys independently. To make production wait for CI, turn on
branch protection for `main` with the CI checks required, and merge through pull requests.

Dependabot opens weekly grouped updates: Payload packages together, Next and React together,
and the remaining minor and patch updates in one pull request.
