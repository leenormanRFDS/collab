# COLLAB · RFDS SA/NT creative briefing studio (v3)

A self-contained, **AI-free** frontend prototype for colleagues to brief Lee on fundraising appeals, acquisition campaigns and web experiences. Uses the visual energy of Optimus and a separately designed, Möbius-inspired monumental brutalist opening. Neither template's source code or proprietary assets are bundled.

## What's included

- **Immersive opening**: full-viewport black `COL` / RFDS blue `LAB` typography, editorial grid, animated geometric shutters, progress line, skip control and reduced-motion fallback.
- **Name-only welcome panel**, saved per browser. Greets colleagues throughout the interface. **This is not authentication.**
- Persistent lightweight ambient glyph/particle motion in the application, rotating particle sphere on the homepage, animated UI blocks and a concept-opening particle burst.
- Briefs with campaigns, audiences, proposed copy, KPIs, creative notes, colour swatches, custom hex colour, font preference, style words, reference links and images.
- Snap-to-grid visual UX journey and review dashboard.
- Submit downloads a **self-contained HTML brief** with uploaded images. If the optional Vercel email endpoint is correctly configured, the app emails the brief and attached JPEG references to **lee.norman@flyingdoctor.net**. Otherwise it opens a **mailto draft** that the user must send manually and asks them to attach the downloaded HTML report. **It never claims that opening a draft is the same as sending.**
- Browser-local autosave, JSON export and print/save PDF.

## Run locally

```bash
cd COLLAB-v3
python3 -m http.server 8000
```

Open http://localhost:8000. Opening `index.html` directly also works for most features.

## Deploy

On Vercel, deploy the project root using the **Other** framework preset, with no build command. The static site works without a backend; email will fall back to a draft until configured.

### Optional automatic email (Vercel + Resend)

1. Verify an RFDS-approved sending domain in Resend and obtain approval to use the service.
2. Configure environment variables in Vercel:
   - `RESEND_API_KEY` – server-side provider key, never exposed to browser code
   - `COLLAB_FROM_EMAIL` – an approved sender on the verified domain, e.g. `COLLAB <hello@verified-domain.example>`
   - `COLLAB_ALLOWED_ORIGIN` – exact deployed origin, e.g. `https://collab.example.org` (no trailing slash)
   - `COLLAB_SUBMISSIONS_ENABLED=true` – enables endpoint
3. Deploy and test email with a non-sensitive example before use. API endpoint is `/api/submit`; destination is fixed in code to `lee.norman@flyingdoctor.net`.

**Important: do not enable automatic email on a public RFDS production site without real staff authentication, abuse protection/rate limiting, data retention policy, secure uploads, and organisational security approval. An Origin check is NOT authentication.** The provided endpoint is an integration example, not a production-secure email service.

## Current limits

- Name entry is a personal greeting, not a secure staff login.
- Drafts, sample concepts, comments and uploaded creative are saved only in this browser's `localStorage`. They are not shared across colleagues, devices, or Lee's account.
- Example content and illustrative KPIs are demonstration data, not RFDS reporting.
- Email requires configured provider + approved sender. If missing, user's own mail app opens a draft; they must attach their download and click **Send**.
- The fully downloadable HTML brief includes uploaded reference images. Email service attachments may skip oversized references to keep under provider limits; the email indicates how many were included.
- No AI generation or real page builder. This is a UX / campaign-briefing workspace.
- Do not upload confidential patient, supporter, or donation records into this demo.

