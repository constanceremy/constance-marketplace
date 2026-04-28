import { getAllSkills } from "@/lib/skills";
import { NextResponse } from "next/server";

const SITE_URL = "https://constance-marketplace.vercel.app";
const RAW_BASE =
  "https://raw.githubusercontent.com/constanceremy/constance-marketplace/main/skills";

export async function GET() {
  const skills = getAllSkills();

  const manifest = {
    version: "1.0.0",
    name: "constance-marketplace",
    description: "Skills & tools by Constance.",
    url: SITE_URL,
    skills: skills.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.description,
      tags: s.tags,
      category: s.category,
      url: `${SITE_URL}/skills/${s.slug}`,
      raw_url: `${RAW_BASE}/${s.slug}.md`,
      install: `curl -fsSL ${RAW_BASE}/${s.slug}.md -o .claude/skills/${s.slug}/SKILL.md`,
    })),
  };

  return NextResponse.json(manifest, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
