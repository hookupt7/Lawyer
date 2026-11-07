# Oakstone Legal Group

Nationwide law firm platform. 26 practice areas, 236 defined services, all 51 US
jurisdictions, a four-step booking wizard with calendar-invite email, a fee
estimator, a cyber-emergency intake, and a full admin panel.

**Zero runtime dependencies.** Node core modules only. No npm install.

## Run

```
node lib/server.js
```

Serves on `http://localhost:3000` (override with `PORT`).

## Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | Listen port (default 3000) |
| `ADMIN_PASS` | Admin panel password (default `OANKS123456789` — change before deploy) |
| `SMTP_HOST` / `SMTP_PORT` | Mail relay. Unset = mail is skipped, not lost |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials (AUTH LOGIN over STARTTLS or implicit TLS) |
| `SMTP_FROM` | Envelope sender (defaults to the public intake email) |

## Admin panel

`/admin` — session cookie auth (HttpOnly, 8-hour TTL). Manage firm contact
details, social URLs, bookable time slots, announcement bar, lead status
(new / contacted / consulted / retained / declined / closed), CSV export of
every inquiry with IP and user agent, a one-click full JSON backup, a
"send test email" button, and a tamper-evident audit log.

Where enquiries land: every form submission is written to
`data/runtime/*.json` and appears immediately in the admin table. Email
delivery is a second channel on top of that — it only starts once the five
`SMTP_*` variables are set. Nothing is lost while mail is unconfigured.

## Email behaviour

Every submission triggers two mails: an internal alert to the firm inbox
(with the sender's IP and user agent) and a client confirmation. Appointments
attach an RFC 5545 `.ics` invitation built by `lib/mailer.js`. With no SMTP
configured the MIME is built and recorded but not sent, so nothing is lost
while you set the relay up.

## Tests

```
node tools/test-mailer.js        # 12 assertions on MIME, ICS, SMTP behaviour
node tools/validate-content.js   # anti-AI-slop copy lint across all data
```

## Structure

```
lib/server.js     HTTP server, router, form endpoints, admin, auth
lib/mailer.js     SMTP client + MIME + iCalendar builder (no deps)
lib/store.js      JSON file persistence, atomic writes, audit log
lib/layout.js     Document shell: header, mega menu, drawer, footer
lib/pages*.js     Page builders (home, practice, attorneys, coverage,
                  pricing, booking, cyber, contact, legal, 404)
data/*.js         Practice areas, attorneys, states, copy (source of truth)
data/runtime/     Live JSON store (leads, appointments, settings) - gitignored
public/assets/    Hand-authored CSS design system + client JS + SVG assets
tools/            Generators and tests
```

## Legal notes

The site carries attorney-advertising disclaimers consistent with ABA Model
Rules 7.1-7.3. All fees shown are illustrative placeholders, all testimonials
and statistics are sample content, and all attorney names are fictional until
replaced with real counsel. Replace them before this site goes live.
