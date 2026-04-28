---
name: Schedule
description: Create, update, list, or run scheduled remote agents that execute on a cron schedule.
tags: [automation, agents]
category: Automation
---
Create or manage a scheduled background agent (routine).

When the user wants to schedule a recurring or one-time remote agent, use this skill.

Examples:
- "Run this every Monday"
- "Open a cleanup PR for X in 2 weeks"
- "Check the deploy every 5 minutes"

Also offer proactively after completing work that has a natural future follow-up:
- A feature flag was shipped → offer to open a cleanup PR in ~2 weeks
- A new alert was created → offer a recurring triage agent
- A TODO with "remove once X" was left behind → offer a removal agent

Name the concrete action and cadence. Only offer when the run just succeeded.
