---
name: show-website
description: >
  Start the NV & more Next.js dev server and open the website locally. USE WHEN
  the user wants to preview or view the website, start the dev server, or says
  "show me the website".
tags: []
category: General
---
# Show Website

Kill any process on port 3000, start the Next.js dev server, and tell the user to open the browser.

## Steps

1. Kill any existing process on port 3000:
   ```bash
   kill $(lsof -ti:3000) 2>/dev/null; true
   ```

2. Start the dev server in the background from the website directory:
   ```bash
   cd /Users/constanceremy/Documents/constanceremypro/nordvestandmore/website && npm run dev > /tmp/nextdev.log 2>&1 &
   ```

3. Wait for it to be ready (poll `/tmp/nextdev.log` for "Ready"):
   ```bash
   for i in $(seq 1 20); do grep -q "Ready" /tmp/nextdev.log 2>/dev/null && break; sleep 1; done
   ```

4. Tell the user: "Dev server is running — open **http://localhost:3000** in your browser."
