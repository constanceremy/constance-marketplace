---
name: New Event
description: Checklist for creating a new bookable event/experience on NV & more — Notion, Stripe, and sessions.
tags: [notion, stripe, events, checklist]
category: Content
---
Follow these steps every time you create a new bookable experience on NV & more.

---

## Step 1: Create the Experience in Notion

Open the **Experiences DB** (`320375efa2cc809ca2dae69a1aa15423`) and create a new page with:

| Field | Notes |
|-------|-------|
| Name | The experience title shown on the site |
| Short description | One-liner used in cards and meta tags |
| Description | Full description shown on the booking page |
| Cover image | Upload or paste URL |
| Price | Number (e.g. 150) |
| Currency | e.g. DKK |
| Max spots | Leave blank to hide availability counter |
| Language | Multi-select (e.g. English, Danish) |
| Tags | Multi-select (e.g. walk, food, culture) |
| Meeting point | Where people should show up |
| Duration | e.g. "2 hours" |
| What's included | Optional — shown in a dedicated box |
| What to bring | Optional — shown in a dedicated box |
| Booking policy | Link to a row in Booking Policies DB |

---

## Step 2: Create a Stripe Product

1. Go to Stripe Dashboard → Products (stay in **Test mode** until going live)
2. Click **Add product**
3. Name it the same as the experience
4. Set the price (one-time, correct currency)
5. After saving, copy the **Product ID** — it starts with `prod_...`

---

## Step 3: Add Stripe Product ID to Notion Experience

Back in the Notion Experience page, paste the `prod_...` value into the **Stripe Product ID** field.

This links the Stripe product to the experience so the checkout uses the right product image/name.

---

## Step 4: Create Sessions in Notion

Open the **Sessions DB** (`320375efa2cc8068b2b4f8428008d1ff`) and create one row per date with:

| Field | Notes |
|-------|-------|
| Experience | Link to the Experience you just created |
| Date | The session date |
| Start time | e.g. 10:00 |
| End time | e.g. 12:00 |
| Max spots | Can override the experience-level default |
| Booked spots | Set to 0 (increments automatically on booking) |
| Status | Set to "Open" |

Repeat for each date you want to offer.

---

## Step 5: Verify on the website

The session will appear automatically on `/with-us` once it has a future date and Status = Open.

- Check `/with-us` — the experience card should appear
- Click through to the session page — verify price, spots, description look correct
- Do a test booking with a Stripe test card (`4242 4242 4242 4242`) to confirm:
  - Supabase gets a new row in `bookings`
  - Notion "Booked spots" increments to 1
  - Confirmation email arrives

---

## Notes

- **Price is always set on the Experience**, not the Session (unless you set `priceOverride` on the session)
- **Stripe Product ID is on the Experience**, not the Session
- `eventId` in Stripe metadata = the Session page ID (used for incrementing booked spots)
- The site ISR cache revalidates every hour — changes in Notion may take up to 60 min to appear
