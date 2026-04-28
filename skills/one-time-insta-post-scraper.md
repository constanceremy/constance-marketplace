---
name: One-Time Insta Post Scraper
description: Scrape a single Instagram post URL into the Notion events database. Use when someone pastes an IG post URL and wants it added to Notion.
tags: [instagram, scraping, notion]
category: Scraping
---
Works even when the drip scraper session is expired, because it fetches the post via shortcode (a different API path).

## Steps

1. Run the script from the scraper directory using the nv_scraper venv:

```bash
cd ~/Documents/constanceremypro/nordvestandmore/scraper
nv_scraper/.venv/bin/python3 scrape_one_post.py <instagram_post_url>
```

2. The script will:
   - Load the `.env` from `nordvestandmore/.env` (Notion token, Gemini key)
   - Load the instaloader session from `~/.config/instaloader/session-nvandmore_events`
   - Fetch the post via shortcode
   - Analyze the caption + images with Gemini to extract events
   - Push all found events to Notion (with dedup, tagging, location cleanup)

3. Check the output for:
   - `✨ NEW →` lines — events created in Notion
   - `⚠️ Unknown location` — the location name wasn't recognized; fix it manually in Notion
   - `❌ No events found` — the post isn't an event (Gemini determined this)

## Notes

- The script monkey-patches `get_recent_posts` so it processes only the one post, running all the normal dedup/filter/push logic without re-fetching the full account feed
- Works even with an expired session (the shortcode fetch uses a different API path than the account feed scrape)
- If the post is a carousel, all slides are downloaded and sent to Gemini
- A single post can produce multiple Notion entries (e.g. a recurring event listed day-by-day)
