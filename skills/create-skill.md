---
name: Create Skill
description: Create, validate, update, or canonicalize Claude Code skills with standardized structure and naming conventions.
tags: [claude-code, skills, scaffolding]
category: Development
---
USE WHEN creating a new skill OR validating an existing skill OR updating a skill OR restructuring a legacy skill to canonical format.

## Skill Conventions

**Naming:** kebab-case for directories and files (e.g., `add-schema-field/`, `SKILL.md`).

**Location:** `.claude/skills/{skill-name}/`

**Structure:**
```
.claude/skills/{skill-name}/
├── SKILL.md              # Main skill file (YAML frontmatter + markdown body)
└── Workflows/            # Optional: workflow files for multi-workflow skills
    ├── Create.md
    └── Validate.md
```

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **CreateSkill** | "create a skill", "new skill", "add a skill" | `Workflows/CreateSkill.md` |
| **ValidateSkill** | "validate skill", "check skill structure" | `Workflows/ValidateSkill.md` |
| **UpdateSkill** | "update skill", "add workflow to skill", "modify skill" | `Workflows/UpdateSkill.md` |
| **CanonicalizeSkill** | "canonicalize skill", "restructure skill", "fix skill format" | `Workflows/CanonicalizeSkill.md` |

## SKILL.md frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it.
triggers:
  - "phrase that should invoke this skill"
---
```

## Notes

- Always write a `description` that includes "USE WHEN" so the model knows when to auto-invoke it
- Workflows are optional — only add them if the skill has meaningfully different modes
- Keep the main `SKILL.md` as a router; put detailed steps in workflow files
