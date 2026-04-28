import { getAllSkills, getAllTags } from "@/lib/skills";
import SkillList from "@/components/SkillList";

export default function Home() {
  const skills = getAllSkills();
  const tags = getAllTags(skills);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12 border-b border-black pb-8">
        <h1 className="text-xs uppercase tracking-widest mb-2">
          Constance Marketplace
        </h1>
        <p className="text-xs uppercase tracking-widest opacity-40">
          Skills &amp; tools — {skills.length} available
        </p>
      </div>

      <SkillList skills={skills} tags={tags} />
    </main>
  );
}
