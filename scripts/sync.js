#!/usr/bin/env node
// Syncs SKILL.md files from project .claude/skills/ directories into the marketplace.
// Add new source dirs to SOURCES below as you create more projects.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_OUT = path.join(__dirname, "../skills");

const SOURCES = [
  {
    project: "nordvestandmore",
    dir: path.join(__dirname, "../../nordvestandmore/.claude/skills"),
  },
  // Add more projects here:
  // { project: "my-other-project", dir: path.join(__dirname, "../../other/.claude/skills") },
];

// Patterns that must never appear in published skills
const SECRET_PATTERNS = [
  { re: /ghp_[A-Za-z0-9]{36}/g, replacement: "$GH_TOKEN" },
  { re: /ghs_[A-Za-z0-9]{36}/g, replacement: "$GH_TOKEN" },
  { re: /sk-[A-Za-z0-9]{48}/g, replacement: "$OPENAI_API_KEY" },
];

function redact(text) {
  let out = text;
  for (const { re, replacement } of SECRET_PATTERNS) out = out.replace(re, replacement);
  return out;
}

let added = 0, updated = 0, unchanged = 0, skipped = 0;

for (const source of SOURCES) {
  if (!fs.existsSync(source.dir)) {
    console.log(`⚠  Skipping ${source.project} — directory not found`);
    continue;
  }

  const skillDirs = fs.readdirSync(source.dir).filter((d) => {
    const skillFile = path.join(source.dir, d, "SKILL.md");
    return fs.existsSync(skillFile);
  });

  for (const skillDir of skillDirs) {
    const skillFile = path.join(source.dir, skillDir, "SKILL.md");
    const raw = fs.readFileSync(skillFile, "utf8");
    const { data, content } = matter(raw);

    if (!data.name || !data.description) {
      console.log(`⚠  Skipping ${skillDir} — missing name or description in frontmatter`);
      skipped++;
      continue;
    }

    const outFrontmatter = {
      name: data.name,
      description: data.description,
      tags: data.tags ?? [],
      category: data.category ?? "General",
    };

    const outContent = redact(matter.stringify(content.trim(), outFrontmatter));
    const outFile = path.join(SKILLS_OUT, `${skillDir}.md`);
    const exists = fs.existsSync(outFile);
    const current = exists ? fs.readFileSync(outFile, "utf8") : null;

    if (current === outContent) {
      console.log(`  ${skillDir}`);
      unchanged++;
    } else {
      fs.writeFileSync(outFile, outContent);
      console.log(`${exists ? "↑" : "+"} ${skillDir}${exists ? " (updated)" : " (added)"}`);
      exists ? updated++ : added++;
    }
  }
}

console.log(`\n${added} added, ${updated} updated, ${unchanged} unchanged, ${skipped} skipped`);
if (added + updated > 0) {
  console.log("\nNext: git add skills/ && git commit -m 'sync: update skills' && git push");
}
