---
name: restore-ig-session
description: >-
  Restore the Instagram instaloader session when it expires or gets
  401/rate-limited errors. USE WHEN the IG drip scraper fails with 401
  Unauthorized, "Please wait a few minutes", session expired, or logged out of
  Instagram. Also use when the user says the session is broken, Instagram isn't
  working, or needs to update IG_SESSION_B64.
tags: []
category: General
---
# Restore Instagram Session

Restores the instaloader session after expiry or account re-login. The session is stored as a base64-encoded pickle file in GitHub secret `IG_SESSION_B64` and deployed to the self-hosted runner.

## When to use this skill

- IG drip scraper shows `401 Unauthorized` on every account in a batch
- User says they were logged out of Instagram
- Auth failure streak reaches suspend threshold
- User updated the Instagram password or 2FA

---

## Step 1: Get fresh cookies from browser

1. Log into Instagram in your browser as the `nordvestandmore` account
2. Open DevTools → **Application** → **Cookies** → `instagram.com`
3. Copy the value of **`sessionid`**
4. Copy the value of **`csrftoken`**

---

## Step 2: Import the cookies into an instaloader session file

Run in terminal (from the project root or scraper directory):

```bash
cd ~/Documents/constanceremypro/nordvestandmore/scraper/ig_scraper
python3 _import_browser_session.py nordvestandmore <sessionid> <csrftoken>
```

This writes `~/.config/instaloader/session-nordvestandmore`.

---

## Step 3: Base64-encode the session file and update the GitHub secret

```bash
base64 -i ~/.config/instaloader/session-nordvestandmore | pbcopy
```

Then go to:
**GitHub → constanceremy/nordvestandmore → Settings → Secrets → Actions → `IG_SESSION_B64`**

Paste the clipboard contents and save.

---

## Step 4: Trigger force_refresh_session workflow run

```bash
GH_TOKEN=$GH_TOKEN \
  gh workflow run 238077514 \
  --repo constanceremy/nordvestandmore \
  --field force_refresh_session=true
```

This deploys the new session to the runner, clears the `suspended` flag, and resets `auth_failure_streak` to 0.

---

## Step 5: Verify success

```bash
GH_TOKEN=$GH_TOKEN \
  gh run list --repo constanceremy/nordvestandmore \
  --workflow=scrape-ig-drip.yml --limit 3
```

Look for the run to complete with status ✓. Then check the logs — the "Scrape IG batch" step should show accounts succeeding (not `401 Unauthorized`).

---

## Notes

- The session file is a pickle of `{sessionid, csrftoken}` — do NOT use `instaloader --login` with a password as Instagram may still block the new session
- The `force_refresh_session` flag both restores the file from secret AND unsuspends the scraper
- The workflow ID `238077514` refers to `scrape-ig-drip.yml`
- State file lives at `/tmp/ig_cursor/state.json` on the runner — it tracks the suspension flag and auth_failure_streak
