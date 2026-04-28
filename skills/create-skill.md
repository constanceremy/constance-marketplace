---
name: create-skill
description: >-
  Create, validate, update, or canonicalize Claude Code skills with standardized
  structure and naming conventions. USE WHEN creating a new skill OR validating
  an existing skill OR updating a skill OR restructuring a legacy skill to
  canonical format.
tags: []
category: General
---
# CreateSkill

Anthropic's framework for creating and managing Claude Code skills with standardized structure and naming conventions.

## Skill Conventions (This Project)

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

## Examples

**Example 1: Create a new skill**
```
User: "Create a skill for managing dbt model documentation"
-> Invokes CreateSkill workflow
-> Asks about purpose, triggers, and workflows
-> Scaffolds skill directory with SKILL.md and workflow files
```

**Example 2: Validate an existing skill**
```
User: "Validate the add-schema-field skill"
-> Invokes ValidateSkill workflow
-> Checks YAML frontmatter, structure, and naming
-> Reports compliance status
```

**Example 3: Update a skill with a new workflow**
```
User: "Add a new workflow to the add-schema-field skill"
-> Invokes UpdateSkill workflow
-> Reads current skill, adds workflow file, updates routing table
```
