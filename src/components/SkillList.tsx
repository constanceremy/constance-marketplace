"use client";

import { useState } from "react";
import Link from "next/link";
import type { Skill } from "@/lib/skills";
import TagFilters from "./TagFilters";

type Props = {
  skills: Skill[];
  tags: string[];
};

export default function SkillList({ skills, tags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? skills.filter((s) => s.tags.includes(activeTag))
    : skills;

  return (
    <div>
      <TagFilters tags={tags} active={activeTag} onChange={setActiveTag} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm uppercase tracking-widest text-gray-400">
            No skills found
          </p>
        )}
        {filtered.map((skill) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
            className="border-b border-r border-black p-6 flex flex-col gap-3 hover:bg-black hover:text-white transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm uppercase tracking-widest font-normal">
                {skill.name}
              </h2>
              <span className="text-xs uppercase tracking-widest opacity-40 group-hover:opacity-60 shrink-0">
                {skill.category}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-60 group-hover:opacity-80">
              {skill.description}
            </p>
            {skill.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto pt-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs uppercase tracking-widest border border-current px-2 py-0.5 opacity-40 group-hover:opacity-70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
