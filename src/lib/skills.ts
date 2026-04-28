import fs from "fs";
import path from "path";
import matter from "gray-matter";

const skillsDir = path.join(process.cwd(), "skills");

export type Skill = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  content: string;
};

export function getAllSkills(): Skill[] {
  if (!fs.existsSync(skillsDir)) return [];
  const files = fs.readdirSync(skillsDir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(skillsDir, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        name: data.name ?? slug,
        description: data.description ?? "",
        tags: data.tags ?? [],
        category: data.category ?? "General",
        content: content.trim(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSkillBySlug(slug: string): Skill | null {
  const filePath = path.join(skillsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    name: data.name ?? slug,
    description: data.description ?? "",
    tags: data.tags ?? [],
    category: data.category ?? "General",
    content: content.trim(),
  };
}

export function getAllTags(skills: Skill[]): string[] {
  const set = new Set<string>();
  skills.forEach((s) => s.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
