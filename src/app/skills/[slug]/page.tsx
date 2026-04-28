import { getAllSkills, getSkillBySlug } from "@/lib/skills";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export async function generateStaticParams() {
  return getAllSkills().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};
  return { title: `${skill.name} — Constance Marketplace` };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
        >
          ← Back
        </Link>
      </div>

      <div className="border-b border-black pb-8 mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-xs uppercase tracking-widest">{skill.name}</h1>
          <span className="text-xs uppercase tracking-widest opacity-40 shrink-0">
            {skill.category}
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-60 mb-4">
          {skill.description}
        </p>
        {skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-widest border border-black px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="border border-black">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black">
          <span className="text-xs uppercase tracking-widest opacity-40">
            Skill content
          </span>
          <CopyButton text={skill.content} />
        </div>
        <pre className="p-6 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono">
          {skill.content}
        </pre>
      </div>
    </main>
  );
}
