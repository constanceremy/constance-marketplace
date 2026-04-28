"use client";

type Props = {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
};

export default function TagFilters({ tags, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 text-xs uppercase tracking-widest border border-black transition-colors ${
          active === null ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag === active ? null : tag)}
          className={`px-3 py-1 text-xs uppercase tracking-widest border border-black transition-colors ${
            active === tag ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
