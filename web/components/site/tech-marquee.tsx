const ITEMS = [
  "PYTHON",
  "REACT",
  "N8N",
  "CLAUDE API",
  "LLM ORCHESTRATION",
  "NODE.JS",
  "SUPABASE",
  "POSTGRES",
  "MONGODB",
  "DOCKER",
  "VOICE & SPEECH PIPELINES",
  "REST APIs",
];

export function TechMarquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden bg-background border-b border-border py-4"
      style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div className="animate-marquee flex items-center gap-[22px] w-max">
        {doubled.map((item, i) => (
          <span key={i} className="contents">
            <span className="font-heading text-[13px] font-semibold tracking-wider text-text-faint whitespace-nowrap">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-purple opacity-60 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
