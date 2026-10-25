# Outreach CRM

An internal customer-acquisition workspace for the Mandate API, at `/outreach` on the site.

- **Unlisted.** No navigation link anywhere, and the page sets `noindex, nofollow`. Share the URL directly.
- **Password-protected.** It has its own password (`OUTREACH_PASSWORD_HASH`), separate from the admin
  password, so outreach access can be shared without giving admin. A logged-in admin can also open it.
  Developer-account (API customer) sessions never can.
- **Private data.** Only `/api/v1/outreach/*` (behind the password) reads the `Outreach*` tables; no public
  route exposes them. When the quarterly data-release system ships, these tables must stay on its
  excluded list so they are never copied into a public release.

## Tabs

| Tab | What it's for |
|---|---|
| Overview | Accounts by city, contacted count, reply rate, meetings in the last 30 days, follow-ups due, open pipeline value, funnel by stage, active conversations |
| Pipeline | Board of accounts by stage; change a stage from the card |
| Accounts | Every firm with filters (city, segment, stage, has a published inbox), search, add account, CSV export |
| Follow-ups | Overdue, due today and upcoming next steps, plus contacted firms with no reply after 10 days |
| Activity | Timeline of every email, reply, call, meeting, note and stage change across all accounts |
| Templates | Reusable first-touch, follow-up, reply and meeting-recap emails |
| Do not contact | Firms that asked not to be contacted |

Clicking any firm opens its panel:
- **Overview fields:** stage, priority and fit.
- **Contact:** the published inbox, with copy and source, plus the people you add yourself.
- **Plan:** next step and due date, likely plan and expected annual value.
- **Log activity** and the account's own timeline.
- **The draft email** and your notes.
- **The original research:** evidence, sources, why Mandate fits, caveats.

## Rules the system enforces

- Logging an email, reply, meeting or trial moves an account's stage forward automatically. It never
  moves it backward, and never out of won, lost or not a fit. Manual stage changes are logged as activity.
- Logging "Asked not to be contacted" marks the firm do-not-contact. After that, logging a new email to
  it is rejected (HTTP 409 `do_not_contact`).
- Firm inboxes come from research: generic addresses the firm publishes, with the page where each appears.
  Individual people are added only by the team, once they reply or are introduced.

## Setup

Set the password locally:

```bash
npm run outreach:set-password -w server -- "<a password of 12+ characters>"
```

For production, copy the printed `OUTREACH_PASSWORD_HASH` value into the Railway server service's
variables. `SESSION_SECRET` must already be set; it signs outreach sessions, which last 12 hours.

Import researched prospects (the data stays out of git; pass its location):

```bash
cd server && npx tsx src/scripts/importOutreachAccounts.ts <dir of JSON files | file.json> --city "Chicago"
```

The import upserts by slug. Re-running it refreshes research fields only. It never overwrites stage,
notes, next steps, deal fields or logged activity. The first import also adds two starter templates.

## API

All routes live under `/api/v1/outreach` and need `Authorization: Bearer <outreach or admin token>`.
The exceptions are `POST /login` and `GET /me`.

| Method | Path | Purpose |
|---|---|---|
| POST | /login | `{password}` returns a 12-hour token (rate-limited per IP) |
| GET | /summary | Overview numbers |
| GET, POST | /accounts | List; create (`name`, `city` required) |
| GET, PATCH, DELETE | /accounts/:id | Detail with contacts and activity; update; delete |
| POST | /accounts/:id/contacts | Add a person |
| PATCH, DELETE | /contacts/:id | |
| POST | /accounts/:id/activities | Log `email_sent`, `email_received`, `call`, `meeting`, `trial`, `note`, `bounce` or `opt_out` |
| DELETE | /activities/:id | |
| GET | /activities | Timeline across all accounts |
| GET, POST | /templates | |
| PATCH, DELETE | /templates/:id | |
| GET | /export.csv | All accounts as CSV |

An email-sending assistant session can log its sends here instead of in a separate file. It logs in
with the outreach password, then calls `POST /accounts/:id/activities` with `type: "email_sent"`.
