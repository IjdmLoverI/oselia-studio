# Content model

Everything visitors read can be changed in the admin at `/admin`. Code holds only the
interface strings in `messages/*.json`. The schema is defined in `src/collections` and
`src/globals`. Types for it are generated into `src/payload-types.ts` by
`npm run generate:types`.

**Localized** fields below store a separate value for Ukrainian and English. Everything else
(numbers, images, relations, slugs) is shared between the languages.

## Collections

### Projects

The case studies. They appear in the home page grid and on their own page.

| Field                                         | Type                 | Notes                                                                   |
| --------------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| `title`                                       | text, localized      |                                                                         |
| `slug`                                        | text                 | generated from the Ukrainian title, can be unlocked                     |
| `summary`                                     | textarea, localized  | card text and meta description                                          |
| `cover`                                       | upload               | the finished room                                                       |
| `sketch`                                      | upload               | same view as the cover; feeds the sketch-to-result slider               |
| `gallery`                                     | uploads              |                                                                         |
| `category`                                    | select               | apartment, house, kitchen, bathroom, commercial; drives the grid filter |
| `area`, `durationWeeks`, `budgetFrom`, `year` | number               |                                                                         |
| `district`                                    | text, localized      |                                                                         |
| `services`                                    | relation to Services | "work done" list on the project page                                    |
| `featured`                                    | checkbox             | featured projects are listed first                                      |
| `body`                                        | rich text, localized | the project story                                                       |

Projects have **drafts**. Visitors only see published versions. Signed-in editors can read
drafts through the API.

### Services

The six service cards: `title` and `summary` (localized), `slug`, `image`, `priceFrom`
(UAH per m²) and `order`.

### Testimonials

`author` and `text` (localized), `rating` from 1 to 5, and an optional `project`. A project page
quotes the first review linked to it.

### Faqs

`question` and `answer` (localized) and `order`. The answer is plain text, kept short on
purpose.

### Media

Every image used by the content.

- `alt` is required and localized, so both languages get proper alternative text.
- `credit.author` and `credit.url` feed the public credits page.
- `blurDataURL` is hidden. It is filled on upload with a tiny WebP preview.
- Uploads are converted to WebP and resized to `thumb` (480), `card` (960) and `wide` (1920).
  A focal point can be set in the admin.

### Leads

Requests from the contact form:

- what the visitor entered: name, phone, message;
- the calculator choices: area, renovation type, extras and the estimate;
- the site language;
- `status`: new, in progress or closed.

`ipHash` is hidden and used only for rate limiting.

### Users

Admin accounts. Only signed-in users exist in the system; there are no visitor accounts. Five
failed sign-ins lock the account for ten minutes.

## Globals

### Site settings

- Phone, email and social links.
- Address and opening hours, localized.
- The three counters in the hero: years of work, finished projects, warranty years.

### Pricing

The calculator's rates:

- **Renovation types.** `cosmetic`, `capital` and `designer`, each with a price per m² and a
  localized description.
- **Extras.** A key, a localized label, a price, and whether that price is per m² or fixed.

The estimate shown to the visitor is a range: 90 % to 115 % of the computed sum, rounded to a
thousand (`src/lib/pricing.ts`).

## Access

| Collection or global                | Read                                   | Create                                                                     | Update, delete |
| ----------------------------------- | -------------------------------------- | -------------------------------------------------------------------------- | -------------- |
| Projects                            | published for everyone, all for admins | admins                                                                     | admins         |
| Services, Testimonials, Faqs, Media | everyone                               | admins                                                                     | admins         |
| Leads                               | admins                                 | nobody through the API; the form's server action writes with the Local API | admins         |
| Users                               | admins                                 | admins                                                                     | admins         |
| Site settings, Pricing              | everyone                               | —                                                                          | admins         |

The shared access functions live in `src/access.ts`.

## Changing the schema

1. Edit the collection or global.
2. Run `npm run generate:types` and `npm run migrate:create <name>`.
3. Review the generated migration in `src/migrations` and commit it together with the schema
   change.
4. Run `npm run migrate` locally. Deployments apply pending migrations before the build. See
   [deployment](deployment.md).

Payload's development "push" mode is turned off (`push: false`), so every database, local ones
included, gets its schema only from migrations. A push would also leave a `dev` marker that
makes later `payload migrate` runs stop and ask for confirmation.

The storage adapter runs with `alwaysInsertFields`. Its fields (`prefix`, `_objectKey`) then
exist whether or not Vercel Blob is configured, and local and production schemas match.
