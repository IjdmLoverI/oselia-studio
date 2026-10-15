# AI assistant

The assistant answers visitors in the chat on the site and in Telegram. It explains services
and prices, estimates the labour cost of a renovation and books a free site visit. Bookings
land in the admin and the studio gets a Telegram message.

```
site chat ── POST /api/assistant/chat ──┐
                                         ├─► reply() ─► model (AI SDK) ◄─► tools ─► Payload
Telegram  ── POST /api/assistant/telegram┘        │
                                                   └─► Conversations, Site visits, Telegram notice
```

## One turn

`reply()` in `src/lib/assistant/run.ts` handles a message from either channel:

1. Load the assistant settings and the knowledge from the CMS. Without a provider key, or with
   the assistant switched off, it answers with a fixed note that points to the form and the
   phone.
2. Check the limits: messages from this visitor in the last ten minutes, and from the whole
   site since midnight in Kyiv.
3. Find or create the conversation. A web conversation is keyed by a random ID the browser
   keeps for the session; a Telegram conversation by the chat ID.
4. Call the model with the instructions, the last 20 messages and the tools. Text streams
   back as it is generated; the model may call up to five tools in a turn.
5. Save the visitor's message, the reply and the token count to the conversation.

If the model fails or the provider rate-limits the free tier, the visitor gets a short apology
with the studio's phone instead of an error.

## What the model knows

`buildInstructions()` in `src/lib/assistant/prompt.ts` builds the instructions on every turn
from the CMS: contacts, services, labour rates, extras, finished projects, FAQ and the
**What happens at the visit** text from the assistant settings. A change in the admin reaches
the next reply without a deploy.

The instructions keep the model to renovation and this studio, tell it to use only these facts
and the tool results, and to answer in the visitor's language (Ukrainian or English; a visitor
who writes in Russian is answered in Ukrainian). They are kept short because the free tier
counts tokens per minute.

## Tools

| Tool             | Does                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `estimate_price` | Runs the calculator's `estimatePrice` with the CMS rates. Returns a labour-only range.              |
| `find_slots`     | Lists free visit times in Kyiv time for the nearest three days, or for a requested date.            |
| `book_visit`     | Books a visit. The model is told to call it only after the visitor confirmed the details read back. |

The server does not trust the model's input for a booking. `book_visit` checks the name and
address length, normalizes the phone like the lead form does, refuses a second booking from the
same conversation, and recomputes the free slots before saving. The **Site visits** collection
then guards the time once more: a validator shows a readable error in the admin, and a unique
`slot` key, cleared when a visit is cancelled, stops two parallel bookings of the same time.

Each tool's logic is a plain function in `createActions()` so it can be unit-tested without a
model.

## Free slots

`src/lib/assistant/slots.ts` turns the schedule into times. All times are wall-clock times in
`Europe/Kyiv` (`YYYY-MM-DDTHH:mm`), converted to UTC only when stored, so the switch to winter
time and the date line between Kyiv and UTC do not shift a visit. A slot is free when no
active visit starts within one visit length of it, so a visit typed into the admin at 11:00
blocks both the 10:00 and the 12:00 slot.

## Settings in the admin

**Assistant → Assistant settings**:

- on or off;
- the greeting shown at the top of the chat and in reply to `/start`;
- what happens at the visit;
- working days, the first visit hour, the end of the day and the visit length;
- how many days ahead visits can be booked and the minimum notice in hours;
- messages per visitor per ten minutes, and per day for the whole site.

**Assistant → Conversations** shows every chat with its channel, the visit it produced and the
tokens it used. **Sales → Site visits** lists the bookings; a visit can also be added there by
hand, for example after a phone call.

## Model provider

The code talks to the model through the [AI SDK](https://ai-sdk.dev), so the provider is a
setting:

| Variable                       | Default                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| `AI_PROVIDER`                  | `groq`; `google` is the other option                             |
| `AI_MODEL`                     | `openai/gpt-oss-120b` on Groq, `gemini-2.5-flash` on Google      |
| `GROQ_API_KEY`                 | key from [console.groq.com](https://console.groq.com)            |
| `GOOGLE_GENERATIVE_AI_API_KEY` | key from [Google AI Studio](https://aistudio.google.com) if used |

The demo runs on Groq's free tier. Groq does not keep prompts by default and does not train on
API data, which matters because visitors type their phone numbers. Google's free tier may use
prompts to improve its products, so it is only a fallback. Moving to another provider the AI SDK
supports means adding its package and a branch in `src/lib/assistant/model.ts`.

The free tier of `openai/gpt-oss-120b` allows about 8 000 tokens per minute. With the demo
content the instructions are about 1 200 tokens in English and 1 700 in Ukrainian, so a model
call with tools and history costs 2 000–2 500 tokens, and a turn with a tool call makes two.
A few people can chat at once; past the limit visitors get the "too many requests" reply.

## The chat widget

`src/components/assistant/` holds a small launcher that is part of every page and a panel that
loads only after the first click (`next/dynamic`), so the chat adds almost nothing to the page
weight that PageSpeed measures.

- The browser sends one message at a time with the conversation ID. The history stays on the
  server, so a page cannot slip earlier "assistant" messages into the prompt.
- The reply is a plain text stream read with `fetch`. No chat client library is needed.
- The chat survives navigation and reloads for the browser session and can be restarted.
- The panel is a labelled dialog. Escape closes it and returns focus to the launcher, the
  input is focused on open, and finished replies are announced to screen readers through a
  polite live region instead of every streamed word.
- A note under the input says the studio is fictional and the admin can read the chat.

## Telegram

The same bot sends lead notifications and talks to visitors. `/api/assistant/telegram`:

- rejects requests without Telegram's `X-Telegram-Bot-Api-Secret-Token` header;
- answers private chats only, so the bot can also sit in the studio's group for notifications;
- replies after the HTTP response (`after()` from `next/server`), so Telegram does not retry a
  slow answer;
- picks the language from the user's Telegram language: Ukrainian for `uk`, `ru`, `be` or none,
  English otherwise.

Setup is in [deployment](deployment.md#7-telegram-assistant). To try the bot on a local server,
run `npm run telegram:poll` next to `npm run dev`: it reads updates with `getUpdates` and posts
them to the local webhook with the secret header. It refuses to run while a webhook is set,
because it would take the production bot's messages.

## Abuse and privacy

- The chat endpoint refuses requests whose `Origin` is another site.
- Messages are limited to 600 characters, and only the last 20 messages go to the model.
- Visitors are limited per IP hash on the site and per chat in Telegram; the whole site has a
  daily cap, which protects the free tier.
- The raw IP is never stored, only a salted hash, as with leads.
- Keys stay on the server. The tools can read public content and create one booking per
  conversation, nothing else, so a prompt injection has little to reach.

## Tests

- **Unit** (`tests/unit/slots.test.ts`, `assistant.test.ts`, `telegram-update.test.ts`): slots
  across working days, notice, overlaps, the Kyiv date and the time change; the instructions;
  each tool with fake storage; limits; the booking notice; parsing Telegram updates.
- **End to end** (`tests/e2e/assistant.spec.ts`): the widget with the chat response mocked in
  the browser (a suggested question, reload and restart, retry after an error, Escape, an axe
  check of the open panel), plus the endpoints' refusals. CI sets placeholder keys only so the
  launcher renders and the webhook is enabled; no real model is called.
