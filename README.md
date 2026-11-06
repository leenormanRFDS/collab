# COLLAB / RFDS SA/NT — Campaign Creative Studio (v4)

**COLLAB** is an AI-free, prototype-only creative briefing application for the Royal Flying Doctor Service SA/NT. It helps colleagues express campaign ideas to Lee in a structured, visual way without publishing a website or sending an ad to any platform.

## What is included

- **Immersive introduction:** Oversized brutalist `COL` (black) + `LAB` (RFDS blue) identity, opening animation, skippable intro, animated grid, particle sphere and continuous ambient motion. Reduced-motion settings supported.
- **Name welcome:** Colleagues introduce themselves by name, and the app greets them personally. **This is not authentication.**
- **Fundraising concept briefs:** Appeal/acquisition/regular giving type, objectives, motivations, audiences, copy ideas, creative direction, target KPIs, reusable attachments and local comments.
- **RFDS creative board:** Image uploads (JPG/PNG/WebP), reference links, visual moodboard, colour selections, custom hex and font preferences.
- **Campaign Studio:** Six integrated, editable concept tools:
  1. **Meta Ads** — Feed, Instagram Feed and Story/vertical mockups; primary text, headline, description, CTA, optional image overlay, crop/position and uploaded images.
  2. **Google Search** — Three responsive headline concepts (30 characters each), two descriptions (90 characters each), display path, sample query, counters and a live preview. These are planning fields; a real campaign can supply up to 15 headlines and 4 descriptions.
  3. **Google Display** — Landscape/square responsive banner concept, headline, long headline, description, CTA, uploaded image and position.
  4. **Email Studio** — Subject, preheader, hero imagery, opened-message and inbox previews, CTA and copy.
  5. **Web UX concept** — Simplified mobile/desktop landing-page hierarchy preview; not a page builder.
  6. **KPI sandbox** — Clearly labelled illustrative calculator for budget, CPC, estimated conversion rate, once-off gifts and regular donors. Not a forecast.
- **Journey mapper:** Draggable, snapping campaign touchpoint nodes and annotations.
- **Pitch to Lee:** Nine animated presentation scenes with next/back controls and keyboard arrows; downloadable, self-contained HTML presentation suitable for saving to PDF.
- **Review and submit:** Statuses, comments, fully downloadable HTML creative brief with actual visual previews and uploaded images, JSON export, print/PDF options, and optional email integration.
- **RFDS SA/NT logo:** The supplied SVG is included at `assets/rfds-sant-logo.svg` and embedded in the app's code for self-contained previews, including social profile icons and email mockups.

## Open and use

**Quickest:** Open `index.html` in a browser (or use the standalone `COLLAB-v4-demo.html` supplied separately). Enter your name, go to Workspace, create a concept, select **Campaign studio**, and switch between tools. Use **Pitch to Lee** to show the combined idea.

**Serve locally (recommended):**

```bash
cd COLLAB-v4
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to Vercel

Upload the project folder or connect its repository and select **Other** (static) with no build command. `vercel.json` provides security-response headers; no frontend environment variables are necessary. The source contains an optional `/api/submit` Node function for automated email, which is **disabled by default**.

### Optional email delivery

By default, pressing **Send to Lee + download** downloads a self-contained HTML brief and opens a **draft email**, addressed to `lee.norman@flyingdoctor.net`. The colleague must attach the downloaded brief and press **Send**. Opening the draft is not the same as sending an email.

For automatic email delivery via Vercel/Resend, first get RFDS approval for the provider and sending domain, then configure:

- `RESEND_API_KEY` — secret server-side key
- `COLLAB_FROM_EMAIL` — verified, organisation-approved sender
- `COLLAB_ALLOWED_ORIGIN` — exact production site origin (for example `https://collab.example.org`)
- `COLLAB_SUBMISSIONS_ENABLED=true` — enable the API

The server sends a structured written brief and small approved-reference JPEG attachments to Lee. The frontend still downloads a fuller HTML brief containing imagery and visual previews. The API does not automatically send the HTML visual mockups as pixel-perfect screenshots.

**SECURITY:** The name-only panel is not authentication. The optional sample email endpoint has a basic Origin check, but this is not real security. Do **not** publicly enable the API for RFDS until you have staff single sign-on (preferably Entra ID), server-side authentication, rate limiting, upload safeguards, content/privacy rules and organisational approval. There is no shared backend database in this version. Colleagues' concepts and reviews are only browser-local. If browser storage is blocked, the prototype works in memory but edits may be lost when the tab is closed; download the brief.

Never upload patient, supporter or donor records or unapproved sensitive imagery into an unapproved prototype. Any campaign copy or impact statement must go through normal RFDS approvals before being published.

## Design and ad-format guidance

- Google responsive Search ad: min. 3 distinct headlines, min. 2 descriptions, headline max. 30 chars, description max. 90. This studio shows 3/2 for briefing; it does not interface with Google Ads.
- Google responsive Display: planning formats 1.91:1 (1200×628) and 1:1 (1200×1200), with actual delivery cropping and dynamic composition.
- Meta: placement previews are illustrations, and final crops/text treatment can differ by device/placement.

Official references:
- https://support.google.com/google-ads/answer/7684791
- https://support.google.com/google-ads/answer/9823397

## Not included

No AI or AI image generation, no advertising-platform connection, no production page builder, no shared server-side records, no real staff login and no live Google/Meta performance data.
