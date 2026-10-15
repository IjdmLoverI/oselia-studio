# Decisions

Short notes on the main choices and what they cost.

## Payload CMS inside the Next.js app

**Chosen because**

- The admin, the API and the site deploy as one Vercel project.
- Pages read content with a function call (the Local API) instead of HTTP.
- The schema is TypeScript in the repository, so content types and migrations are reviewed
  like any other code.
- Payload's built-in field localization, drafts, upload resizing and a translated admin covered
  everything this project needed without plugins.

**Considered**

- **Sanity and Contentful.** These are hosted and easy to start with. But content would live
  outside the project's database, and localization per field is either a paid feature or a
  convention to maintain.
- **Strapi.** It needs a second server to deploy and keep in sync.

**Cost**

- Payload pins a narrow range of Next.js versions, so Next upgrades wait for Payload.
- The admin bundle is large, but it never ships to visitors of the public pages.

## Postgres, with migrations

**Chosen because**

- Postgres works well on serverless hosting through Neon's pooled connections.
- The data here is relational: projects reference services, media and reviews.

**Migrations**

- Migrations are generated and committed, and the production build applies them.
- Payload's development push mode is off, so local databases follow the same migrations as
  production and a deploy always knows exactly which schema it expects.
- The Vercel Blob adapter inserts its fields even when it is disabled (`alwaysInsertFields`).
  Without that, the first production build failed: the migration had been generated locally
  without Blob, so the `_objectKey` column was missing.

## next-intl for interface text

**Chosen because**

- Payload localizes content, but buttons, headings and errors belong to the code.
- next-intl handles locale routing in the proxy and offers the same API in Server and Client
  Components.
- The ICU format gives correct plurals and number formatting in both languages.
- The message types are checked against the Ukrainian file, so a missing key fails the
  typecheck.

**URL prefix**

- Every URL carries its language (`/uk`, `/en`), including the default one.
- This keeps caching, canonical links and `hreflang` simple, at the price of a redirect on `/`.

## Motion, Lenis and plain CSS

**What uses what**

- **CSS** does the intro, the reveals, the review strip and the FAQ. It needs no
  JavaScript and survives a slow hydration.
- **Motion** handles what CSS cannot express yet: scroll velocity, scroll-linked progress,
  springs following the pointer, and presence animations.
- **Lenis** adds inertia to wheel scrolling, which suits the editorial style. It runs on fine
  pointers only, because touch scrolling is already smooth and should stay native.

**Lazy features.** Motion's animation, gesture and layout features load after hydration.

- **Measured.** Lighthouse with devtools network throttling on the mobile profile compared the
  page with and without lazy features, interleaving the runs so that machine load hit both
  equally. Over four pairs the median total blocking time fell from about 520 ms to 400 ms.
  LCP and FCP stayed the same.
- **The catch.** Exit animations through `AnimatePresence` can stall if an element mounts in
  the same render that delivers the features. The project filter therefore does without
  them: cards that no longer match simply leave, and the rest move with layout animations.
- **Scroll reveals stay in CSS.** In production, `whileInView` on the project covers never
  fired with lazy features, so the covers stayed clipped. Every scroll reveal now uses `InView`
  plus a CSS transition, and an end-to-end test checks that the covers open.
- **Where `AnimatePresence` stays.**
  - The contact form cannot change until at least three seconds after the first focus, long
    after the features have arrived.
  - The cursor label could only stall with a hover in the first moments after load, and the
    worst case is a label left on screen.

**Considered: GSAP with ScrollTrigger.** It is more capable for complex timelines, but heavier
than this page needs, and Motion's React API fits the component model better.

## Tailwind CSS 4

**Chosen because**

- The design tokens (colours, fonts, radii, easing) are CSS variables in `@theme`.
- The three colour moods are just a different set of `--color-accent-*` values under a
  `data-mood` attribute. No JavaScript styling is involved.

## Server actions for the form

**Chosen because**

- No API route, no client-side fetch code and no separate validation for client and server.
- One zod schema validates the submission.
- `useActionState` handles the pending state and the response.

**Spam protection without CAPTCHA**

- A honeypot, a time trap and a per-IP limit stored in the leads table.
- This is enough for a small business site and keeps the form free of third-party scripts and
  cookie banners. For a site that attracts targeted spam, a challenge such as Cloudflare
  Turnstile is the next step.

## Not indexed by default

The studio is fictional, so the site should not compete with real businesses in search
results.

- `SITE_INDEXING=false` sets `noindex` on every page.
- `robots.txt` disallows everything.
- The sitemap and structured data stay in place, so switching the flag is all a real business
  would need.

## Pre-rendered material textures

The hero spheres were first drawn with SVG `feTurbulence` filters. On a mid-range phone
those filters took about three seconds of main thread. They are now rendered once to
320 × 320 WebP files with `npm run materials`. The source SVGs stay in the repository, so the
textures can be tuned and rendered again.

## AI SDK and a free Groq model for the assistant

The assistant calls the model through the Vercel AI SDK rather than one provider's client.
The provider and model are two environment variables. Switching between Groq and Gemini is a
setting; adding Claude or OpenAI is one package and a few lines in
`src/lib/assistant/model.ts`, and the prompt, tools and widget stay as they are.

The demo runs on Groq's free tier with `openai/gpt-oss-120b`: it handles tool calls
well and answers fast, and Groq does not keep prompts or train on API data.
Gemini's free tier is the fallback only, because its terms allow using prompts to improve
Google's products and visitors type phone numbers into the chat.

The chat streams plain text from a route handler instead of using the AI SDK's chat UI
protocol. Tools run on the server and the browser only needs text, so the widget stays a few
kilobytes and does not depend on a chat client library.
