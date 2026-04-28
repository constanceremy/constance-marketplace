#!/usr/bin/env node
// Syncs SKILL.md files from project .claude/skills/ directories into the marketplace.
// Generates both the website skills/ flat files and the .claude-plugin/ registry structure.
// Add new source dirs to SOURCES below as you create more projects.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SKILLS_OUT = path.join(ROOT, "skills");
const PLUGINS_OUT = path.join(ROOT, "plugins");
const CLAUDE_PLUGIN_DIR = path.join(ROOT, ".claude-plugin");

const SOURCES = [
  {
    project: "nordvestandmore",
    dir: path.join(__dirname, "../../nordvestandmore/.claude/skills"),
  },
  // Add more projects here:
  // { project: "my-other-project", dir: path.join(__dirname, "../../other/.claude/skills") },
];

// Map skill categories to Claude Code plugin categories
const CATEGORY_MAP = {
  Scraping: "development",
  Development: "development",
  Content: "productivity",
  Automation: "productivity",
  General: "productivity",
};

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

function writeIfChanged(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
  if (existing === content) return false;
  fs.writeFileSync(filePath, content);
  return true;
}

let added = 0, updated = 0, unchanged = 0, skipped = 0;
const allPlugins = [];

for (const source of SOURCES) {
  if (!fs.existsSync(source.dir)) {
    console.log(`⚠  Skipping ${source.project} — directory not found`);
    continue;
  }

  const skillDirs = fs.readdirSync(source.dir).filter((d) =>
    fs.existsSync(path.join(source.dir, d, "SKILL.md"))
  );

  for (const skillDir of skillDirs) {
    const skillFile = path.join(source.dir, skillDir, "SKILL.md");
    const raw = fs.readFileSync(skillFile, "utf8");
    const { data, content } = matter(raw);

    if (!data.name || !data.description) {
      console.log(`⚠  Skipping ${skillDir} — missing name or description in frontmatter`);
      skipped++;
      continue;
    }

    const slug = skillDir;
    const tags = data.tags ?? [];
    const category = data.category ?? "General";
    const pluginCategory = CATEGORY_MAP[category] ?? "productivity";

    const outFrontmatter = { name: data.name, description: data.description, tags, category };
    const skillContent = redact(matter.stringify(content.trim(), outFrontmatter));
    const skillMdPath = path.join(SKILLS_OUT, `${slug}.md`);
    const skillExists = fs.existsSync(skillMdPath);
    const changed = writeIfChanged(skillMdPath, skillContent);

    // Plugin manifest
    const pluginJson = JSON.stringify({
      name: slug,
      version: "1.0.0",
      description: data.description,
      author: { name: "Constance Remy" },
      keywords: tags,
    }, null, 2) + "\n";
    writeIfChanged(path.join(PLUGINS_OUT, slug, ".claude-plugin", "plugin.json"), pluginJson);

    // Skill file inside plugin
    const pluginSkillContent = redact(matter.stringify(content.trim(), { name: data.name, description: data.description }));
    writeIfChanged(path.join(PLUGINS_OUT, slug, "skills", slug, "SKILL.md"), pluginSkillContent);

    if (changed) {
      console.log(`${skillExists ? "↑" : "+"} ${slug}${skillExists ? " (updated)" : " (added)"}`);
      skillExists ? updated++ : added++;
    } else {
      console.log(`  ${slug}`);
      unchanged++;
    }

    allPlugins.push({
      name: slug,
      description: data.description,
      author: { name: "Constance Remy" },
      source: `./plugins/${slug}`,
      category: pluginCategory,
      homepage: `https://constance-marketplace.vercel.app/skills/${slug}`,
    });
  }
}

// Write marketplace registry
const marketplaceJson = JSON.stringify({
  $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
  name: "constance-marketplace",
  description: "Skills & tools by Constance Remy",
  owner: { name: "Constance Remy" },
  plugins: allPlugins,
}, null, 2) + "\n";

fs.mkdirSync(CLAUDE_PLUGIN_DIR, { recursive: true });
const marketplaceChanged = writeIfChanged(path.join(CLAUDE_PLUGIN_DIR, "marketplace.json"), marketplaceJson);
if (marketplaceChanged) console.log("↑ .claude-plugin/marketplace.json (updated)");

console.log(`\n${added} added, ${updated} updated, ${unchanged} unchanged, ${skipped} skipped`);
if (added + updated > 0 || marketplaceChanged) {
  console.log("\nNext: git add -A && git commit -m 'sync: update skills' && git push");
}
